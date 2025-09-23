import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { IMAGE_SIZES } from '../../../common/constants/image-sizes';

export interface ImageSizeConfig {
  width: number;
  height: number;
  quality: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ImageProcessingResult {
  buffer: Buffer;
  width: number;
  height: number;
  size: number;
  format: string;
}

@Injectable()
export class ImageProcessingService {

  /**
   * Process image to generate multiple sizes
   */
  async processImage(
    inputBuffer: Buffer,
    sizes: string[] = ['thumbnail', 'small', 'medium', 'large']
  ): Promise<Record<string, ImageProcessingResult>> {
    const results: Record<string, ImageProcessingResult> = {};

    // Get original image metadata
    const metadata = await sharp(inputBuffer).metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Process each size
    for (const sizeName of sizes) {
      if (sizeName === 'original') {
        results[sizeName] = {
          buffer: inputBuffer,
          width: originalWidth,
          height: originalHeight,
          size: inputBuffer.length,
          format: metadata.format || 'unknown',
        };
        continue;
      }

      const config = IMAGE_SIZES[sizeName as keyof typeof IMAGE_SIZES];
      if (!config) {
        throw new Error(`Unknown size configuration: ${sizeName}`);
      }

      const result = await this.resizeImage(inputBuffer, config);
      results[sizeName] = result;
    }

    return results;
  }

  /**
   * Resize image with specific configuration
   */
  private async resizeImage(
    inputBuffer: Buffer,
    config: typeof IMAGE_SIZES[keyof typeof IMAGE_SIZES]
  ): Promise<ImageProcessingResult> {
    let sharpInstance = sharp(inputBuffer);

    // Check if config has width and height (not original)
    if ('width' in config && 'height' in config) {
      // Resize with smart cropping
      sharpInstance = sharpInstance.resize(config.width, config.height, {
        fit: 'cover',
        position: 'center',
      });
    }

    // Apply quality - use JPEG as default format
    sharpInstance = sharpInstance.jpeg({ quality: config.quality });

    const buffer = await sharpInstance.toBuffer();
    const metadata = await sharp(buffer).metadata();

    return {
      buffer,
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: buffer.length,
      format: metadata.format || 'unknown',
    };
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(inputBuffer: Buffer): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
  }> {
    const metadata = await sharp(inputBuffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: inputBuffer.length,
    };
  }

  /**
   * Validate if buffer is a valid image
   */
  async validateImage(inputBuffer: Buffer): Promise<boolean> {
    try {
      const metadata = await sharp(inputBuffer).metadata();
      return !!(metadata.width && metadata.height);
    } catch {
      return false;
    }
  }

  /**
   * Convert image to WebP format
   */
  async convertToWebP(
    inputBuffer: Buffer,
    quality: number = 90
  ): Promise<Buffer> {
    return await sharp(inputBuffer).webp({ quality }).toBuffer();
  }

  /**
   * Generate thumbnail with specific dimensions
   */
  async generateThumbnail(
    inputBuffer: Buffer,
    width: number,
    height: number,
    quality: number = 80
  ): Promise<Buffer> {
    return await sharp(inputBuffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality })
      .toBuffer();
  }

  /**
   * Get available size configurations
   */
  getAvailableSizes(): string[] {
    return Object.keys(IMAGE_SIZES);
  }

  /**
   * Get size configuration
   */
  getSizeConfig(sizeName: string): typeof IMAGE_SIZES[keyof typeof IMAGE_SIZES] | undefined {
    return IMAGE_SIZES[sizeName as keyof typeof IMAGE_SIZES];
  }
}
