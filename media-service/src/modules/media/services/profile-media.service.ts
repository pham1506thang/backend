import { Injectable } from '@nestjs/common';
import { Media } from '../entities/media.entity';
import { MediaSize } from '../entities/media-size.entity';
import { MediaTag } from '../entities/media-tag.entity';
import { MediaRepository } from '../repositories/media.repository';
import { JwtUser } from 'shared-common';
import { PROFILE_IMAGE_SIZES, MEDIA_CATEGORIES, MEDIA_FILE_TYPES, MEDIA_PROCESSING_STATUS } from '../../../common/constants/image-sizes';
import { StoragePathUtil } from '../../../common/utils/storage-path.util';
import { BaseMediaService } from './base-media.service';
import { MediaResponseDto, MediaSizeResponseDto, MediaTagResponseDto } from '../dto';
import { InfiniteParamsDto } from 'shared-common';

@Injectable()
export class ProfileMediaService {
  constructor(
    private mediaRepository: MediaRepository,
    private baseMediaService: BaseMediaService,
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
    const mediaId = this.baseMediaService.generateMediaId();
    const fileExtension = this.baseMediaService.getFileExtension(file.originalname);
    const fileName = `${mediaId}.${fileExtension}`;

    // Generate storage path
    const date = new Date();
    const basePath = StoragePathUtil.generateMediaPath(MEDIA_CATEGORIES.PROFILE, MEDIA_FILE_TYPES.IMAGE, mediaId, date);
    const relativePath = `${basePath}/${fileName}`;
    const fullPath = StoragePathUtil.getFullStoragePath(MEDIA_CATEGORIES.PROFILE, MEDIA_FILE_TYPES.IMAGE, mediaId, fileName, date);

    // Ensure directory exists
    StoragePathUtil.ensureDirectoryExists(fullPath);

    // Save original file - use relative path from storage root
    await this.baseMediaService.uploadFile(file, relativePath);

    // Create media record
    const media = await this.mediaRepository.create({
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

    // Generate all profile image sizes
    await this.baseMediaService.generateImageSizes(media, file.buffer, date, MEDIA_CATEGORIES.PROFILE, PROFILE_IMAGE_SIZES);

    // Update processing status to completed and add processing metadata
    media.processingStatus = MEDIA_PROCESSING_STATUS.COMPLETED;
    media.metadata = {
      processingCompletedAt: new Date().toISOString(),
      generatedSizes: Object.keys(PROFILE_IMAGE_SIZES),
    };
    await this.mediaRepository.save(media);

    return this.mapToResponseDto(media);
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
   * Find profile images with infinite pagination
   */
  async findInfiniteProfileImages(params: InfiniteParamsDto, user: JwtUser) {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder()
      .where('media.category = :category', { category: MEDIA_CATEGORIES.PROFILE })
      .andWhere('media.isActive = :isActive', { isActive: true })
      .andWhere('media.uploaderId = :userId', { userId: user.id })
      .leftJoinAndSelect('media.sizes', 'sizes')
      .leftJoinAndSelect('media.tags', 'tags');

    return this.mediaRepository.findWithInfinitePagination({
      ...params,
      searchFields: ['originalName', 'fileName', 'altText', 'description'],
    }, queryBuilder);
  }


  /**
   * Get profile image details
   */
  async getProfileImage(id: string, user: JwtUser): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOneWithRelations(
      { id, category: MEDIA_CATEGORIES.PROFILE, isActive: true, uploaderId: user.id },
      ['sizes', 'tags']
    );

    if (!media) {
      throw new Error('Profile image not found');
    }

    return this.mapToResponseDto(media);
  }

  /**
   * Update profile image metadata
   */
  async updateProfileImage(id: string, updateData: any, user: JwtUser): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOneWithRelations(
      { id, category: MEDIA_CATEGORIES.PROFILE, isActive: true },
      ['sizes', 'tags']
    );

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
    const media = await this.mediaRepository.findOneWithRelations(
      { id, category: MEDIA_CATEGORIES.PROFILE, isActive: true }
    );

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
