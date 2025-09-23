import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../entities/media.entity';
import { MediaSize } from '../entities/media-size.entity';
import { MediaTag } from '../entities/media-tag.entity';
import { JwtUser } from 'shared-common';
import { PROFILE_IMAGE_SIZES, MEDIA_CATEGORIES, MEDIA_FILE_TYPES, MEDIA_PROCESSING_STATUS } from '../../../common/constants/image-sizes';
import { StoragePathUtil } from '../../../common/utils/storage-path.util';
import { ImageProcessingService } from './image-processing.service';
import { LocalStorageService } from './local-storage.service';
import { MediaResponseDto, MediaListQueryDto, MediaSizeResponseDto, MediaTagResponseDto } from '../dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ProfileMediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(MediaSize)
    private mediaSizeRepository: Repository<MediaSize>,
    private imageProcessingService: ImageProcessingService,
    private localStorageService: LocalStorageService,
  ) {}

  /**
   * Upload single profile image with all sizes
   */
  async uploadProfileImage(file: any, user: JwtUser): Promise<MediaResponseDto> {
    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new Error('Only image files are allowed for profile uploads');
    }

    // Generate unique filename and media ID
    const mediaId = this.generateMediaId();
    const fileExtension = this.getFileExtension(file.originalname);
    const fileName = `${mediaId}.${fileExtension}`;

    // Generate storage path
    const date = new Date();
    const basePath = StoragePathUtil.generateMediaPath('profile', mediaId, date);
    const relativePath = `${basePath}/${fileName}`;
    const fullPath = StoragePathUtil.getFullStoragePath('profile', mediaId, fileName, date);

    // Ensure directory exists
    StoragePathUtil.ensureDirectoryExists(fullPath);

    // Save original file - use relative path from storage root
    await this.localStorageService.uploadFile(file, relativePath);

    // Create media record
    const media = this.mediaRepository.create({
      id: mediaId,
      originalName: file.originalname,
      fileName,
      mimeType: file.mimetype,
      fileExtension: fileExtension,
      fileType: MEDIA_FILE_TYPES.IMAGE,
      category: MEDIA_CATEGORIES.PROFILE,
      size: file.size,
      uploaderId: user.id,
      processingStatus: MEDIA_PROCESSING_STATUS.PROCESSING,
      metadata: {},
    });

    const savedMedia = await this.mediaRepository.save(media);

    // Generate all profile image sizes
    await this.generateProfileImageSizes(savedMedia, file.buffer, date);

    // Update processing status to completed and add processing metadata
    savedMedia.processingStatus = MEDIA_PROCESSING_STATUS.COMPLETED;
    savedMedia.metadata = {
      processingCompletedAt: new Date().toISOString(),
      generatedSizes: Object.keys(PROFILE_IMAGE_SIZES),
    };
    await this.mediaRepository.save(savedMedia);

    return this.mapToResponseDto(savedMedia);
  }

  /**
   * Upload multiple profile images
   */
  async uploadMultipleProfileImages(files: any[], user: JwtUser): Promise<MediaResponseDto[]> {
    const results: MediaResponseDto[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadProfileImage(file, user);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload profile image ${file.originalname}:`, error);
        // Continue with other files
      }
    }

    return results;
  }

  /**
   * List profile images with pagination and filters
   */
  async listProfileImages(query: MediaListQueryDto): Promise<{ data: MediaResponseDto[]; total: number }> {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.category = :category', { category: MEDIA_CATEGORIES.PROFILE })
      .andWhere('media.isActive = :isActive', { isActive: true });

    // Apply filters
    if (query.userId) {
      queryBuilder.andWhere('media.uploaderId = :userId', { userId: query.userId });
    }

    if (query.fileType) {
      queryBuilder.andWhere('media.fileType = :fileType', { fileType: query.fileType });
    }

    if (query.dateFrom) {
      queryBuilder.andWhere('media.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }

    if (query.dateTo) {
      queryBuilder.andWhere('media.createdAt <= :dateTo', { dateTo: query.dateTo });
    }

    // Apply search
    if (query.search) {
      queryBuilder.andWhere(
        '(media.originalName ILIKE :search OR media.fileName ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Apply sorting
    const sortField = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'DESC';
    queryBuilder.orderBy(`media.${sortField}`, sortOrder);

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);
    queryBuilder.leftJoinAndSelect('media.sizes', 'sizes');
    queryBuilder.leftJoinAndSelect('media.tags', 'tags');

    const [medias, total] = await queryBuilder.getManyAndCount();

    const data = medias.map(media => this.mapToResponseDto(media));
    return {
      data,
      total,
    };
  }

  /**
   * Get profile image details
   */
  async getProfileImage(id: string, user: JwtUser): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOne({
      where: { id, category: MEDIA_CATEGORIES.PROFILE, isActive: true, uploaderId: user.id },
      relations: ['sizes', 'tags'],
    });

    if (!media) {
      throw new Error('Profile image not found');
    }

    return this.mapToResponseDto(media);
  }

  /**
   * Get all available sizes for profile image with detailed information
   */
  async getProfileImageSizes(id: string, user: JwtUser): Promise<{ sizes: MediaSizeResponseDto[] }> {
    const media = await this.mediaRepository.findOne({
      where: { id, category: MEDIA_CATEGORIES.PROFILE, isActive: true, uploaderId: user.id },
    });

    if (!media) {
      throw new Error('Profile image not found');
    }

    const mediaSizes = await this.mediaSizeRepository.find({
      where: { mediaId: id },
      order: { createdAt: 'ASC' },
    });

    return {
      sizes: mediaSizes.map(size => this.mapMediaSizeToResponseDto(size)),
    };
  }

  /**
   * Update profile image metadata
   */
  async updateProfileImage(id: string, updateData: any, user: JwtUser): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOne({
      where: { id, category: MEDIA_CATEGORIES.PROFILE, isActive: true },
      relations: ['sizes', 'tags'],
    });

    if (!media) {
      throw new Error('Profile image not found');
    }

    // Check ownership
    if (media.uploaderId !== user.id) {
      throw new Error('You can only update your own profile images');
    }

    // Update metadata
    Object.assign(media, updateData);
    media.updatedAt = new Date();

    const updatedMedia = await this.mediaRepository.save(media);
    return this.mapToResponseDto(updatedMedia);
  }

  /**
   * Soft delete profile image
   */
  async deleteProfileImage(id: string, user: JwtUser): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id, category: MEDIA_CATEGORIES.PROFILE, isActive: true },
    });

    if (!media) {
      throw new Error('Profile image not found');
    }

    // Check ownership
    if (media.uploaderId !== user.id) {
      throw new Error('You can only delete your own profile images');
    }

    // Soft delete
    media.isActive = false;
    media.updatedAt = new Date();
    await this.mediaRepository.save(media);
  }

  /**
   * Search profile images
   */
  async searchProfileImages(query: string, options: any = {}): Promise<{ data: MediaResponseDto[]; total: number }> {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.category = :category', { category: MEDIA_CATEGORIES.PROFILE })
      .andWhere('media.isActive = :isActive', { isActive: true })
      .andWhere(
        '(media.originalName ILIKE :query OR media.fileName ILIKE :query OR media.metadata::text ILIKE :query)',
        { query: `%${query}%` }
      );

    // Filter by user if provided
    if (options.userId) {
      queryBuilder.andWhere('media.uploaderId = :userId', { userId: options.userId });
    }

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);
    queryBuilder.orderBy('media.createdAt', 'DESC');
    queryBuilder.leftJoinAndSelect('media.sizes', 'sizes');
    queryBuilder.leftJoinAndSelect('media.tags', 'tags');

    const [medias, total] = await queryBuilder.getManyAndCount();

    return {
      data: medias.map(media => this.mapToResponseDto(media)),
      total,
    };
  }

  /**
   * Get profile images by tag
   */
  async getProfileImagesByTag(tagName: string, options: any = {}): Promise<{ data: MediaResponseDto[]; total: number }> {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .leftJoin('media.tags', 'tag')
      .where('media.category = :category', { category: MEDIA_CATEGORIES.PROFILE })
      .andWhere('media.isActive = :isActive', { isActive: true })
      .andWhere('tag.name = :tagName', { tagName });

    // Filter by user if provided
    if (options.userId) {
      queryBuilder.andWhere('media.uploaderId = :userId', { userId: options.userId });
    }

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);
    queryBuilder.orderBy('media.createdAt', 'DESC');
    queryBuilder.leftJoinAndSelect('media.sizes', 'sizes');
    queryBuilder.leftJoinAndSelect('media.tags', 'tags');

    const [medias, total] = await queryBuilder.getManyAndCount();

    return {
      data: medias.map(media => this.mapToResponseDto(media)),
      total,
    };
  }

  /**
   * Get file URL for profile image
   */
  async getProfileImageFileUrl(id: string, size: string = 'original', user: JwtUser): Promise<string> {
    const media = await this.mediaRepository.findOne({
      where: { id, category: MEDIA_CATEGORIES.PROFILE, isActive: true, uploaderId: user.id },
    });

    if (!media) {
      throw new Error('Profile image not found');
    }

    if (size === 'original') {
      return StoragePathUtil.getRelativeUrlPath('profile', id, media.fileName);
    }

    // Get specific size
    const mediaSize = await this.mediaSizeRepository.findOne({
      where: { mediaId: id, sizeName: size },
    });

    if (!mediaSize) {
      throw new Error(`Size ${size} not found for this profile image`);
    }

    return StoragePathUtil.getRelativeUrlPath('profile', id, mediaSize.fileName);
  }

  /**
   * Generate all profile image sizes (1:1 ratio)
   */
  private async generateProfileImageSizes(media: Media, originalBuffer: Buffer, date: Date): Promise<void> {
    const sizes = Object.keys(PROFILE_IMAGE_SIZES) as Array<keyof typeof PROFILE_IMAGE_SIZES>;

    for (const sizeName of sizes) {
      if (sizeName === 'original') continue; // Skip original, already saved

      const sizeConfig = PROFILE_IMAGE_SIZES[sizeName];
      const fileExtension = this.getFileExtension(media.fileName);
      const fileName = `${media.id}_${sizeName}.${fileExtension}`;

      // Process image using generateThumbnail method
      const processedResult = await this.imageProcessingService.generateThumbnail(
        originalBuffer,
        sizeConfig.width,
        sizeConfig.height,
        sizeConfig.quality
      );

      // Save processed image
      const fileForUpload = { buffer: processedResult };
      const basePath = StoragePathUtil.generateMediaPath('profile', media.id, date);
      const relativePath = `${basePath}/${fileName}`;
      await this.localStorageService.uploadFile(fileForUpload, relativePath);

      // Get image dimensions
      const dimensions = await this.imageProcessingService.getImageMetadata(processedResult);

      // Save size record
      const mediaSize = this.mediaSizeRepository.create({
        mediaId: media.id,
        sizeName,
        fileName,
        filePath: StoragePathUtil.generateMediaPath('profile', media.id, date),
        width: dimensions.width,
        height: dimensions.height,
        size: processedResult.length,
        quality: sizeConfig.quality,
      });

      await this.mediaSizeRepository.save(mediaSize);
    }
  }

  /**
   * Generate unique media ID
   */
  private generateMediaId(): string {
    return randomUUID();
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'jpg';
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(media: Media): MediaResponseDto {
    return {
      id: media.id,
      originalName: media.originalName,
      fileName: media.fileName,
      mimeType: media.mimeType,
      fileExtension: media.fileExtension,
      fileType: media.fileType,
      category: media.category,
      size: media.size,
      quality: media.quality,
      uploaderId: media.uploaderId,
      isActive: media.isActive,
      isPublic: media.isPublic,
      altText: media.altText,
      description: media.description,
      processingStatus: media.processingStatus,
      metadata: media.metadata,
      sizes: media.sizes?.map(size => this.mapMediaSizeToResponseDto(size)) || [],
      tags: media.tags?.map(tag => this.mapMediaTagToResponseDto(tag)) || [],
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
  }

  /**
   * Map MediaSize entity to response DTO
   */
  private mapMediaSizeToResponseDto(mediaSize: MediaSize): MediaSizeResponseDto {
    return {
      sizeName: mediaSize.sizeName,
      fileName: mediaSize.fileName,
      filePath: mediaSize.filePath,
      width: mediaSize.width,
      height: mediaSize.height,
      size: mediaSize.size,
      quality: mediaSize.quality,
      url: `/medias/${mediaSize.filePath}/${mediaSize.fileName}`,
      createdAt: mediaSize.createdAt,
    };
  }

  /**
   * Map MediaTag entity to response DTO
   */
  private mapMediaTagToResponseDto(mediaTag: MediaTag): MediaTagResponseDto {
    return {
      id: mediaTag.id,
      tagName: mediaTag.tagName,
      tagValue: mediaTag.tagValue,
      createdBy: mediaTag.createdBy,
      createdAt: mediaTag.createdAt,
    };
  }
}
