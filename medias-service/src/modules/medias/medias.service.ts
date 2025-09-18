import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, Between } from 'typeorm';
import { Media, MediaVersion, MediaSize, MediaTag } from './entities';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaListQueryDto } from './dto/media-list-query.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { LocalStorageService } from './services/local-storage.service';
import { FileOperationsService } from './services/file-operations.service';
import { ImageProcessingService } from './services/image-processing.service';
import { FilePathUtils } from './utils/file-path.utils';
import { QueueService, MediaProcessingMessage } from '../queue/queue.service';
import { WebSocketService } from '../websocket/websocket.service';
import { join } from 'path';

export type ProcessingStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

@Injectable()
export class MediasService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(MediaVersion)
    private mediaVersionRepository: Repository<MediaVersion>,
    @InjectRepository(MediaSize)
    private mediaSizeRepository: Repository<MediaSize>,
    @InjectRepository(MediaTag)
    private mediaTagRepository: Repository<MediaTag>,
    private storageService: LocalStorageService,
    private fileOps: FileOperationsService,
    private imageProcessing: ImageProcessingService,
    private queueService: QueueService,
    private webSocketService: WebSocketService
  ) {}

  async uploadFile(
    file: any,
    createMediaDto: any,
    userId: string
  ): Promise<MediaResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.svg',
      '.mp3',
      '.wav',
      '.mp4',
      '.avi',
      '.mov',
      '.pdf',
      '.doc',
      '.docx',
    ];

    const fileExt = this.getFileExtension(file.originalname);
    if (!allowedTypes.includes(fileExt.toLowerCase())) {
      throw new BadRequestException(`File type ${fileExt} not allowed`);
    }

    // Generate unique filename
    const uniqueFilename = this.generateUniqueFilename(file.originalname);

    // Create media record immediately with pending status
    const media = this.mediaRepository.create({
      filename: createMediaDto.filename || file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      filePath: file.path, // Temporary path
      fileExtension: fileExt,
      userId: userId,
      processingStatus: 'pending' as ProcessingStatus,
      metadata: createMediaDto.metadata || {},
    });

    const savedMedia = await this.mediaRepository.save(media);

    // Create initial version
    const version = this.mediaVersionRepository.create({
      mediaId: savedMedia.id,
      version: '1.0.0',
      isCurrent: true,
      filePath: file.path,
    });
    await this.mediaVersionRepository.save(version);

    // Handle tags
    if (createMediaDto.tags && createMediaDto.tags.length > 0) {
      await this.handleTags(savedMedia.id, createMediaDto.tags);
    }

    return this.mapToResponseDto(savedMedia);
  }

  async queueMediaProcessing(
    mediaId: string,
    filePath: string,
    originalName: string,
    mimeType: string,
    userId: string
  ): Promise<boolean> {
    const message: MediaProcessingMessage = {
      mediaId,
      filePath,
      originalName,
      mimeType,
      userId,
      processingOptions: {
        generateSizes: true,
        sizes: ['thumbnail', 'small', 'medium', 'large'],
        quality: 80,
        format: 'webp',
      },
    };

    return this.queueService.publishMediaProcessing(message);
  }

  async processMediaFile(message: MediaProcessingMessage): Promise<void> {
    const { mediaId, filePath, mimeType, processingOptions } = message;

    try {
      // Update status to processing
      await this.updateProcessingStatus(mediaId, 'processing');

      // Notify progress
      this.webSocketService.notifyMediaProcessingProgress(mediaId, 10);

      // Check if it's an image
      if (this.isImageFile(mimeType)) {
        // Process image with multiple sizes
        await this.processImageFile(mediaId, filePath, processingOptions);
      } else {
        // For non-image files, just move to final location
        await this.moveFileToFinalLocation(mediaId, filePath);
      }

      // Notify completion
      this.webSocketService.notifyMediaProcessingProgress(mediaId, 100);
    } catch (error) {
      console.error(`Error processing media ${mediaId}:`, error);
      throw error;
    }
  }

  private async processImageFile(
    mediaId: string,
    filePath: string,
    options: any
  ): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!media) throw new NotFoundException('Media not found');

    // Generate final file path
    const finalPath = this.generateFinalFilePath(media, 'original');

    // Process image with Sharp
    const processedFiles = await this.imageProcessing.processImage(
      filePath,
      finalPath,
      options.sizes,
      options.quality,
      options.format
    );

    // Update media with final paths
    media.filePath = processedFiles.original;
    media.processingStatus = 'completed';
    await this.mediaRepository.save(media);

    // Save size records
    for (const [size, path] of Object.entries(processedFiles)) {
      if (size !== 'original') {
        const mediaSize = this.mediaSizeRepository.create({
          mediaId,
          size: size as string,
          filePath: path as string,
          width: this.getImageDimensions(path as string).width,
          height: this.getImageDimensions(path as string).height,
        });
        await this.mediaSizeRepository.save(mediaSize);
      }
    }
  }

  private async moveFileToFinalLocation(
    mediaId: string,
    filePath: string
  ): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!media) throw new NotFoundException('Media not found');

    const finalPath = this.generateFinalFilePath(media, 'original');
    await this.fileOps.moveFile(filePath, finalPath);

    media.filePath = finalPath;
    media.processingStatus = 'completed';
    await this.mediaRepository.save(media);
  }

  async updateProcessingStatus(
    mediaId: string,
    status: ProcessingStatus
  ): Promise<void> {
    await this.mediaRepository.update(mediaId, { processingStatus: status });
  }

  async notifyProcessingComplete(
    mediaId: string,
    status: 'completed' | 'failed',
    error?: string
  ): Promise<void> {
    this.webSocketService.notifyMediaProcessingComplete(mediaId, status, error);
  }

  async getProcessingStatus(
    mediaId: string
  ): Promise<{ status: ProcessingStatus; progress?: number }> {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!media) throw new NotFoundException('Media not found');

    return {
      status: media.processingStatus,
      progress: media.processingStatus === 'processing' ? 50 : undefined,
    };
  }

  // ... (keep existing methods from original service)
  async findAll(query: MediaListQueryDto): Promise<{
    data: MediaResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, fileType, tag } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.filename = Like(`%${search}%`);
    }

    if (fileType) {
      where.fileExtension = fileType;
    }

    const [medias, total] = await this.mediaRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: ['versions', 'sizes', 'tags'],
      order: { createdAt: 'DESC' },
    });

    return {
      data: medias.map(media => this.mapToResponseDto(media)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['versions', 'sizes', 'tags'],
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return this.mapToResponseDto(media);
  }

  async update(
    id: string,
    updateMediaDto: UpdateMediaDto
  ): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');

    Object.assign(media, updateMediaDto);
    const updatedMedia = await this.mediaRepository.save(media);

    return this.mapToResponseDto(updatedMedia);
  }

  async remove(id: string): Promise<void> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');

    // Soft delete
    media.deletedAt = new Date();
    await this.mediaRepository.save(media);
  }

  async getFileUrl(id: string, size?: string): Promise<{ url: string }> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');

    let filePath = media.filePath;

    if (size && size !== 'original') {
      const mediaSize = await this.mediaSizeRepository.findOne({
        where: { mediaId: id, size },
      });
      if (mediaSize) {
        filePath = mediaSize.filePath;
      }
    }

    const url = this.storageService.getFileUrl(filePath);
    return { url };
  }

  async getAvailableSizes(id: string): Promise<{ sizes: string[] }> {
    const sizes = await this.mediaSizeRepository.find({
      where: { mediaId: id },
      select: ['size'],
    });

    return {
      sizes: ['original', ...sizes.map(s => s.size)],
    };
  }

  async search(query: string): Promise<MediaResponseDto[]> {
    const medias = await this.mediaRepository.find({
      where: { filename: Like(`%${query}%`) },
      relations: ['versions', 'sizes', 'tags'],
    });

    return medias.map(media => this.mapToResponseDto(media));
  }

  async filter(filters: {
    fileType?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<MediaResponseDto[]> {
    const where: any = {};

    if (filters.fileType) {
      where.fileExtension = filters.fileType;
    }

    if (filters.dateFrom && filters.dateTo) {
      where.createdAt = Between(
        new Date(filters.dateFrom),
        new Date(filters.dateTo)
      );
    }

    const medias = await this.mediaRepository.find({
      where,
      relations: ['versions', 'sizes', 'tags'],
    });

    return medias.map(media => this.mapToResponseDto(media));
  }

  async getTags(): Promise<{ tags: string[] }> {
    const tags = await this.mediaTagRepository.find({
      select: ['name'],
      distinct: true,
    });

    return {
      tags: tags.map(tag => tag.name),
    };
  }

  async getByTag(tagName: string): Promise<MediaResponseDto[]> {
    const medias = await this.mediaRepository
      .createQueryBuilder('media')
      .leftJoinAndSelect('media.tags', 'tag')
      .where('tag.name = :tagName', { tagName })
      .getMany();

    return medias.map(media => this.mapToResponseDto(media));
  }

  // Profile upload methods
  async uploadAvatar(file: any, userId: string): Promise<MediaResponseDto> {
    // Similar to uploadFile but with profile-specific logic
    return this.uploadFile(file, { filename: `avatar_${userId}` }, userId);
  }

  async getUserAvatar(userId: string): Promise<MediaResponseDto | null> {
    const media = await this.mediaRepository.findOne({
      where: { userId, filename: Like(`avatar_${userId}%`) },
      relations: ['versions', 'sizes'],
    });

    return media ? this.mapToResponseDto(media) : null;
  }

  async deleteUserAvatar(userId: string): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { userId, filename: Like(`avatar_${userId}%`) },
    });

    if (media) {
      await this.remove(media.id);
    }
  }

  // Helper methods
  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }

  private generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = this.getFileExtension(originalName);
    return `${timestamp}_${random}.${ext}`;
  }

  private generateFinalFilePath(media: Media, size: string): string {
    const date = new Date(media.createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return join(
      'images',
      year.toString(),
      month,
      media.id,
      'versions',
      '1.0.0',
      `${size}.${media.fileExtension}`
    );
  }

  private isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  private getImageDimensions(filePath: string): {
    width: number;
    height: number;
  } {
    // This would use Sharp to get dimensions
    // For now, return default values
    return { width: 0, height: 0 };
  }

  private async handleTags(mediaId: string, tags: string[]): Promise<void> {
    for (const tagName of tags) {
      let tag = await this.mediaTagRepository.findOne({
        where: { name: tagName },
      });
      if (!tag) {
        tag = this.mediaTagRepository.create({ name: tagName });
        tag = await this.mediaTagRepository.save(tag);
      }

      // Associate tag with media
      await this.mediaRepository
        .createQueryBuilder()
        .relation(Media, 'tags')
        .of(mediaId)
        .add(tag.id);
    }
  }

  private mapToResponseDto(media: Media): MediaResponseDto {
    return {
      id: media.id,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      fileExtension: media.fileExtension,
      filePath: media.filePath,
      processingStatus: media.processingStatus,
      metadata: media.metadata,
      userId: media.userId,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
      versions: media.versions || [],
      sizes: media.sizes || [],
      tags: media.tags || [],
    };
  }
}
