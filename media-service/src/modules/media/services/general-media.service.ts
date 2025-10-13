import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../entities/media.entity';
import { MediaSize } from '../entities/media-size.entity';
import { MediaTag } from '../entities/media-tag.entity';
import { MediaRepository } from '../repositories/media.repository';
import { JwtUser } from 'shared-common';
import { IMAGE_SIZES, MEDIA_CATEGORIES, MEDIA_FILE_TYPES, MEDIA_PROCESSING_STATUS } from '../../../common/constants/image-sizes';
import { StoragePathUtil } from '../../../common/utils/storage-path.util';
import { BaseMediaService } from './base-media.service';
import { MediaResponseDto, MediaSizeResponseDto, MediaTagResponseDto } from '../dto';
import { InfiniteParamsDto } from 'shared-common';

@Injectable()
export class GeneralMediaService {
  constructor(
    private mediaRepository: MediaRepository,
    @InjectRepository(MediaSize)
    private mediaSizeRepository: Repository<MediaSize>,
    private baseMediaService: BaseMediaService,
  ) {}

  /**
   * Upload single general image with all sizes
   */
  async uploadGeneralImage(file: any, user: JwtUser): Promise<MediaResponseDto> {
    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new Error('Only image files are allowed for general uploads');
    }

    // Generate unique filename and media ID
    const mediaId = this.baseMediaService.generateMediaId();
    const fileExtension = this.baseMediaService.getFileExtension(file.originalname);
    const fileName = `${mediaId}.${fileExtension}`;

    // Generate storage path
    const date = new Date();
    const basePath = StoragePathUtil.generateMediaPath(MEDIA_CATEGORIES.GENERAL, MEDIA_FILE_TYPES.IMAGE, mediaId, date);
    const fullPath = StoragePathUtil.getFullStoragePath(MEDIA_CATEGORIES.GENERAL, MEDIA_FILE_TYPES.IMAGE, mediaId, fileName, date);

    // Ensure directory exists
    StoragePathUtil.ensureDirectoryExists(fullPath);

    // Save original file
    await this.baseMediaService.uploadFile(file, basePath + '/' + fileName);

    // Create media record
    const media = await this.mediaRepository.create({
      id: mediaId,
      originalName: file.originalname,
      fileName,
      mimeType: file.mimetype,
      fileExtension: fileExtension,
      fileType: MEDIA_FILE_TYPES.IMAGE,
      category: MEDIA_CATEGORIES.GENERAL,
      size: file.size,
      uploaderId: user.id,
      processingStatus: MEDIA_PROCESSING_STATUS.PROCESSING,
      metadata: {},
    });

    // Generate all general image sizes
    await this.baseMediaService.generateImageSizes(media, file.buffer, date, MEDIA_CATEGORIES.GENERAL, IMAGE_SIZES);

    // Update processing status to completed and add processing metadata
    const processedAt = new Date();
    media.processingStatus = MEDIA_PROCESSING_STATUS.COMPLETED;
    media.processedAt = processedAt;
    media.metadata = {
      processingCompletedAt: processedAt.toISOString(),
      generatedSizes: Object.keys(IMAGE_SIZES),
    };
    await this.mediaRepository.save(media);

    return this.mapToResponseDto(media);
  }

  /**
   * Upload multiple general images
   */
  async uploadMultipleGeneralImages(files: any[], user: JwtUser): Promise<MediaResponseDto[]> {
    const results: MediaResponseDto[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadGeneralImage(file, user);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload general image ${file.originalname}:`, error);
        // Continue with other files
      }
    }

    return results;
  }

  /**
   * Find general images with infinite pagination
   */
  async findInfiniteGeneralImages(params: InfiniteParamsDto) {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder()
      .where('media.category = :category', { category: MEDIA_CATEGORIES.GENERAL })
      .andWhere('media.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('media.sizes', 'sizes')
      .leftJoinAndSelect('media.tags', 'tags');

    return this.mediaRepository.findWithInfinitePagination({
      ...params,
      searchFields: ['originalName', 'fileName', 'altText', 'description'],
    }, queryBuilder);
  }


  /**
   * Get general image details
   */
  async getGeneralImage(id: string): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOneWithRelations(
      { id, category: MEDIA_CATEGORIES.GENERAL, isActive: true },
      ['sizes', 'tags']
    );

    if (!media) {
      throw new Error('General image not found');
    }

    return this.mapToResponseDto(media);
  }

  /**
   * Get all available sizes for general image with detailed information
   */
  async getGeneralImageSizes(id: string): Promise<{ sizes: MediaSizeResponseDto[] }> {
    const media = await this.mediaRepository.findOneWithRelations(
      { id, category: MEDIA_CATEGORIES.GENERAL, isActive: true }
    );

    if (!media) {
      throw new Error('General image not found');
    }

    const mediaSizes = await this.mediaSizeRepository.find({
      where: { mediaId: id },
      order: { createdAt: 'ASC' },
    });

    return {
      sizes: mediaSizes.map(size => this.mapMediaSizeToResponseDto(size, media)),
    };
  }

  /**
   * Update general image metadata
   */
  async updateGeneralImage(id: string, updateData: any, user: JwtUser): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOneWithRelations(
      { id, category: MEDIA_CATEGORIES.GENERAL, isActive: true },
      ['sizes', 'tags']
    );

    if (!media) {
      throw new Error('General image not found');
    }

    // Check ownership
    if (media.uploaderId !== user.id) {
      throw new Error('You can only update your own general images');
    }

    // Update metadata
    Object.assign(media, updateData);
    
    // Set publishedAt if media becomes public
    if (updateData.isPublic && !media.isPublic) {
      media.publishedAt = new Date();
    }

    const updatedMedia = await this.mediaRepository.save(media);
    return this.mapToResponseDto(updatedMedia);
  }

  /**
   * Soft delete general image
   */
  async deleteGeneralImage(id: string, user: JwtUser): Promise<void> {
    const media = await this.mediaRepository.findOneWithRelations(
      { id, category: MEDIA_CATEGORIES.GENERAL, isActive: true }
    );

    if (!media) {
      throw new Error('General image not found');
    }

    // Check ownership
    if (media.uploaderId !== user.id) {
      throw new Error('You can only delete your own general images');
    }

    // Soft delete
    media.isActive = false;
    await this.mediaRepository.save(media);
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
      sizes: media.sizes?.map(size => this.mapMediaSizeToResponseDto(size, media)) || [],
      tags: media.tags?.map(tag => this.mapMediaTagToResponseDto(tag)) || [],
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
  }

  /**
   * Map MediaSize entity to response DTO
   */
  private mapMediaSizeToResponseDto(mediaSize: MediaSize, media: Media): MediaSizeResponseDto {
    // Use Media entity properties instead of parsing filePath
    const url = StoragePathUtil.getRelativeUrlPath(
      media.category, 
      media.fileType, 
      media.id, 
      mediaSize.fileName
    );
    
    return {
      sizeName: mediaSize.sizeName,
      fileName: mediaSize.fileName,
      filePath: mediaSize.filePath,
      width: mediaSize.width,
      height: mediaSize.height,
      size: mediaSize.size,
      quality: mediaSize.quality,
      url,
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
