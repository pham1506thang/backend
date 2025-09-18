import { FileOperationsService } from '../services/file-operations.service';

export class FilePathUtils {
  private static fileOps = new FileOperationsService();

  static generateMediaPath(
    mediaId: string,
    fileType: 'image' | 'audio' | 'video',
    version: string = '1.0.0',
    sizeName: string = 'original',
    extension: string
  ): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    return `${fileType}s/${year}/${month}/${mediaId}/versions/${version}/${sizeName}.${extension}`;
  }

  static generateFileName(originalName: string): string {
    return this.fileOps.generateUniqueFileName(originalName);
  }

  static getFileExtension(filename: string): string {
    return this.fileOps.getFileExtension(filename);
  }

  static getMimeTypeFromExtension(extension: string): string {
    return this.fileOps.getMimeTypeFromExtension(extension);
  }

  static getFileTypeFromMimeType(
    mimeType: string
  ): 'image' | 'audio' | 'video' | 'document' | 'other' {
    return this.fileOps.getFileTypeFromMimeType(mimeType);
  }

  static isValidFileType(filename: string, allowedTypes: string[]): boolean {
    return this.fileOps.isValidFileType(filename, allowedTypes);
  }

  static formatFileSize(bytes: number): string {
    return this.fileOps.formatFileSize(bytes);
  }
}
