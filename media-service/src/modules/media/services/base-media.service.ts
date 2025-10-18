import { Injectable } from '@nestjs/common';
import { Media } from '../entities/media.entity';
import { MEDIA_FILE_TYPES } from '../../../common/constants/image-sizes';
import { StoragePathUtil } from '../../../common/utils/storage-path.util';
import { ImageProcessingService } from './image-processing.service';
import { LocalStorageService } from './local-storage.service';
import { randomUUID } from 'crypto';
import { MediaSizeRepository } from '../repositories/media-size.repository';

@Injectable()
export class BaseMediaService {
  constructor(
    private mediaSizeRepository: MediaSizeRepository,
    private imageProcessingService: ImageProcessingService,
    private localStorageService: LocalStorageService,
  ) {}

  /**
   * Generate all image sizes for a media item
   */
  async generateImageSizes(
    media: Media,
    originalBuffer: Buffer,
    date: Date,
    category: 'general' | 'profile',
    sizeConfigs: Record<string, any>
  ): Promise<void> {
    const sizes = Object.keys(sizeConfigs) as Array<keyof typeof sizeConfigs>;

    for (const sizeName of sizes) {
      if (sizeName === 'original') continue; // Skip original, already saved

      const sizeConfig = sizeConfigs[sizeName];
      const fileExtension = this.getFileExtension(media.fileName);
      const fileName = `${media.id}_${sizeName}.${fileExtension}`;

      // Process image
      const processedResult = await this.imageProcessingService.generateThumbnail(
        originalBuffer,
        sizeConfig.width,
        sizeConfig.height,
        sizeConfig.quality
      );

      // Save processed image
      const fileForUpload = { buffer: processedResult };
      const basePath = StoragePathUtil.generateMediaPath(category, MEDIA_FILE_TYPES.IMAGE, media.id, date);
      const relativePath = `${basePath}/${fileName}`;
      await this.localStorageService.uploadFile(fileForUpload, relativePath);

      // Get image dimensions
      const dimensions = await this.imageProcessingService.getImageMetadata(processedResult);

      // Save size record
      await this.mediaSizeRepository.create({
        mediaId: media.id,
        sizeName,
        fileName,
        filePath: basePath,
        width: dimensions.width,
        height: dimensions.height,
        size: processedResult.length,
        quality: sizeConfig.quality,
      });

    }
  }

  /**
   * Generate unique media ID
   */
  generateMediaId(): string {
    return randomUUID();
  }

  /**
   * Get file extension from filename
   */
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'jpg';
  }

  /**
   * Upload file to storage
   */
  async uploadFile(file: any, path: string): Promise<void> {
    await this.localStorageService.uploadFile(file, path);
  }
}
