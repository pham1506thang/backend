import * as path from 'path';

export class StoragePathUtil {
  /**
   * Generate media path with date-based organization
   * @param category - 'images' | 'profile' | 'audio' | 'video'
   * @param mediaId - unique media identifier
   * @param date - upload date (defaults to current date)
   * @returns relative path like 'images/2024/01/mediaId'
   */
  static generateMediaPath(
    category: 'images' | 'profile' | 'audio' | 'video',
    mediaId: string,
    date: Date = new Date()
  ): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${category}/${year}/${month}/${mediaId}`;
  }

  /**
   * Get full storage path for a file
   * @param category - 'images' | 'profile' | 'audio' | 'video'
   * @param mediaId - unique media identifier
   * @param fileName - file name
   * @param date - upload date (defaults to current date)
   * @returns full absolute path
   */
  static getFullStoragePath(
    category: 'images' | 'profile' | 'audio' | 'video',
    mediaId: string,
    fileName: string,
    date: Date = new Date()
  ): string {
    const basePath = this.generateMediaPath(category, mediaId, date);
    return path.join(process.env.STORAGE_PATH || '/storage/medias', basePath, fileName);
  }

  /**
   * Get relative URL path for serving files
   * @param category - 'images' | 'profile' | 'audio' | 'video'
   * @param mediaId - unique media identifier
   * @param fileName - file name
   * @param date - upload date (defaults to current date)
   * @returns relative URL path
   */
  static getRelativeUrlPath(
    category: 'images' | 'profile' | 'audio' | 'video',
    mediaId: string,
    fileName: string,
    date: Date = new Date()
  ): string {
    const basePath = this.generateMediaPath(category, mediaId, date);
    return `/medias/${basePath}/${fileName}`;
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
