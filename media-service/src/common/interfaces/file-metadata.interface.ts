import { FileTypeCategory } from '../utils/mime-type.util';

/**
 * Common interface for file metadata
 */
export interface FileMetadata {
  size: number;
  mtime: Date;
  width?: number;
  height?: number;
  format?: string;
  mimeType?: string;
  fileType?: FileTypeCategory;
}

/**
 * Interface for image-specific metadata
 */
export interface ImageMetadata extends FileMetadata {
  width: number;
  height: number;
  format: string;
}

/**
 * Interface for file stats (basic file system info)
 */
export interface FileStats {
  size: number;
  mtime: Date;
}
