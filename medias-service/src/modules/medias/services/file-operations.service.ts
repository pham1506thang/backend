import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { createHash } from 'crypto';

@Injectable()
export class FileOperationsService {
  /**
   * Generate unique filename with hash to avoid conflicts
   */
  generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = extname(originalName);
    const nameWithoutExt = basename(originalName, extension);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');

    // Create hash for additional uniqueness
    const hash = createHash('md5')
      .update(`${originalName}-${timestamp}-${random}`)
      .digest('hex')
      .substring(0, 8);

    return `${sanitizedName}_${timestamp}_${hash}${extension}`;
  }

  /**
   * Ensure directory exists, create if not
   */
  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Write file buffer to disk with proper error handling
   */
  async writeFile(filePath: string, buffer: Buffer): Promise<void> {
    const dir = dirname(filePath);
    await this.ensureDirectoryExists(dir);
    await fs.writeFile(filePath, buffer);
  }

  /**
   * Read file from disk
   */
  async readFile(filePath: string): Promise<Buffer> {
    return await fs.readFile(filePath);
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete file safely
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, ignore error
      console.warn(`Failed to delete file ${filePath}:`, error.message);
    }
  }

  /**
   * Get file stats
   */
  async getFileStats(filePath: string): Promise<{ size: number; mtime: Date }> {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      mtime: stats.mtime,
    };
  }

  /**
   * Copy file
   */
  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    const dir = dirname(destPath);
    await this.ensureDirectoryExists(dir);
    await fs.copyFile(sourcePath, destPath);
  }

  /**
   * Move file
   */
  async moveFile(sourcePath: string, destPath: string): Promise<void> {
    const dir = dirname(destPath);
    await this.ensureDirectoryExists(dir);
    await fs.rename(sourcePath, destPath);
  }

  /**
   * Get file extension
   */
  getFileExtension(filename: string): string {
    return extname(filename).toLowerCase();
  }

  /**
   * Get file size in human readable format
   */
  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Validate file type by extension
   */
  isValidFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = this.getFileExtension(filename);
    return allowedTypes.includes(extension);
  }

  /**
   * Get MIME type from file extension
   */
  getMimeTypeFromExtension(extension: string): string {
    const mimeTypes: Record<string, string> = {
      // Images
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
      '.tiff': 'image/tiff',

      // Audio
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',
      '.aac': 'audio/aac',
      '.flac': 'audio/flac',

      // Video
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.webm': 'video/webm',
      '.mkv': 'video/x-matroska',
      '.wmv': 'video/x-ms-wmv',

      // Documents
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };

    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Get file type category from MIME type
   */
  getFileTypeFromMimeType(
    mimeType: string
  ): 'image' | 'audio' | 'video' | 'document' | 'other' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('sheet') ||
      mimeType.includes('presentation')
    )
      return 'document';
    return 'other';
  }
}
