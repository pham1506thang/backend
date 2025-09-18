import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { IStorageService } from '../interfaces/storage.interface';
import { FileOperationsService } from './file-operations.service';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly basePath: string;

  constructor(private readonly fileOps: FileOperationsService) {
    this.basePath = process.env.STORAGE_PATH || '/storage/medias';
  }

  async uploadFile(file: any, path: string): Promise<string> {
    const fullPath = join(this.basePath, path);

    // Use file operations service for better error handling
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const buffer = Buffer.isBuffer(file.buffer)
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        file.buffer
      : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Buffer.from(file.buffer as ArrayBuffer);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.fileOps.writeFile(fullPath, buffer);

    return path; // Return relative path
  }

  async deleteFile(path: string): Promise<void> {
    const fullPath = join(this.basePath, path);
    await this.fileOps.deleteFile(fullPath);
  }

  getFileUrl(path: string): string {
    // Return direct file URL for static serving
    return `/medias/${path}`;
  }

  async fileExists(path: string): Promise<boolean> {
    const fullPath = join(this.basePath, path);
    return await this.fileOps.fileExists(fullPath);
  }

  /**
   * Get file stats
   */
  async getFileStats(path: string): Promise<{ size: number; mtime: Date }> {
    const fullPath = join(this.basePath, path);
    return await this.fileOps.getFileStats(fullPath);
  }

  /**
   * Copy file
   */
  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    const fullSourcePath = join(this.basePath, sourcePath);
    const fullDestPath = join(this.basePath, destPath);
    await this.fileOps.copyFile(fullSourcePath, fullDestPath);
  }

  /**
   * Move file
   */
  async moveFile(sourcePath: string, destPath: string): Promise<void> {
    const fullSourcePath = join(this.basePath, sourcePath);
    const fullDestPath = join(this.basePath, destPath);
    await this.fileOps.moveFile(fullSourcePath, fullDestPath);
  }
}
