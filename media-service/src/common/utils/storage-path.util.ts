import * as path from 'path';
import { MEDIA_CATEGORIES, MEDIA_FILE_TYPES } from '../constants/image-sizes';

export class StoragePathUtil {
  /**
   * Generate media path with date-based organization including file type
   * @param category - 'general' | 'profile'
   * @param fileType - 'image' | 'audio' | 'video'
   * @param mediaId - unique media identifier
   * @param date - upload date (defaults to current date)
   * @returns relative path like 'general/image/2024/01/01/mediaId' or 'profile/image/2024/01/01/mediaId'
   */
  static generateMediaPath(
    category: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES],
    fileType: typeof MEDIA_FILE_TYPES[keyof typeof MEDIA_FILE_TYPES],
    mediaId: string,
    date: Date = new Date()
  ): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${category}/${fileType}/${year}/${month}/${day}/${mediaId}`;
  }

  /**
   * Get full storage path for a file
   * @param category - 'general' | 'profile'
   * @param fileType - 'image' | 'audio' | 'video'
   * @param mediaId - unique media identifier
   * @param fileName - file name
   * @param date - upload date (defaults to current date)
   * @returns full absolute path
   */
  static getFullStoragePath(
    category: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES],
    fileType: typeof MEDIA_FILE_TYPES[keyof typeof MEDIA_FILE_TYPES],
    mediaId: string,
    fileName: string,
    date: Date = new Date()
  ): string {
    const basePath = this.generateMediaPath(category, fileType, mediaId, date);
    return path.join(process.env.STORAGE_PATH || '/app/storage/medias', basePath, fileName);
  }

  /**
   * Get relative URL path for serving files
   * @param category - 'general' | 'profile'
   * @param fileType - 'image' | 'audio' | 'video'
   * @param mediaId - unique media identifier
   * @param fileName - file name
   * @param date - upload date (defaults to current date)
   * @returns relative URL path
   */
  static getRelativeUrlPath(
    category: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES],
    fileType: typeof MEDIA_FILE_TYPES[keyof typeof MEDIA_FILE_TYPES],
    mediaId: string,
    fileName: string,
    date: Date = new Date()
  ): string {
    const basePath = this.generateMediaPath(category, fileType, mediaId, date);
    return `/medias/${basePath}/${fileName}`;
  }

  /**
   * Generate media path with date-based organization (backward compatibility)
   * @deprecated Use generateMediaPath with fileType parameter instead
   * @param category - 'general' | 'profile'
   * @param mediaId - unique media identifier
   * @param date - upload date (defaults to current date)
   * @returns relative path like 'general/image/2024/01/01/mediaId' (assumes image type)
   */
  static generateMediaPathLegacy(
    category: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES],
    mediaId: string,
    date: Date = new Date()
  ): string {
    return this.generateMediaPath(category, MEDIA_FILE_TYPES.IMAGE, mediaId, date);
  }

  /**
   * Get full storage path for a file (backward compatibility)
   * @deprecated Use getFullStoragePath with fileType parameter instead
   * @param category - 'general' | 'profile'
   * @param mediaId - unique media identifier
   * @param fileName - file name
   * @param date - upload date (defaults to current date)
   * @returns full absolute path (assumes image type)
   */
  static getFullStoragePathLegacy(
    category: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES],
    mediaId: string,
    fileName: string,
    date: Date = new Date()
  ): string {
    return this.getFullStoragePath(category, MEDIA_FILE_TYPES.IMAGE, mediaId, fileName, date);
  }

  /**
   * Get relative URL path for serving files (backward compatibility)
   * @deprecated Use getRelativeUrlPath with fileType parameter instead
   * @param category - 'general' | 'profile'
   * @param mediaId - unique media identifier
   * @param fileName - file name
   * @param date - upload date (defaults to current date)
   * @returns relative URL path (assumes image type)
   */
  static getRelativeUrlPathLegacy(
    category: typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES],
    mediaId: string,
    fileName: string,
    date: Date = new Date()
  ): string {
    return this.getRelativeUrlPath(category, MEDIA_FILE_TYPES.IMAGE, mediaId, fileName, date);
  }

  /**
   * Ensure directory exists for the given path
   * @param fullPath - full file path
   */
  static ensureDirectoryExists(fullPath: string): void {
    const fs = require('fs');
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}
