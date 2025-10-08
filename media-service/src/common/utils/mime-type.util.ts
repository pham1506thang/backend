/**
 * Utility for MIME type detection and file type categorization
 */

export type FileTypeCategory = 'image' | 'audio' | 'video' | 'document' | 'other';

/**
 * Get MIME type from file extension
 */
export function getMimeTypeFromExtension(extension: string): string {
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
export function getFileTypeFromMimeType(mimeType: string): FileTypeCategory {
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

/**
 * Get file type category from file extension
 */
export function getFileTypeFromExtension(extension: string): FileTypeCategory {
  const mimeType = getMimeTypeFromExtension(extension);
  return getFileTypeFromMimeType(mimeType);
}

/**
 * Check if file extension is valid for given file type category
 */
export function isValidFileTypeForCategory(
  extension: string,
  category: FileTypeCategory
): boolean {
  const fileType = getFileTypeFromExtension(extension);
  return fileType === category;
}

/**
 * Get allowed extensions for a file type category
 */
export function getAllowedExtensionsForCategory(
  category: FileTypeCategory
): string[] {
  const categoryExtensions: Record<FileTypeCategory, string[]> = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'],
    audio: ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'],
    video: ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.wmv'],
    document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
    other: [],
  };

  return categoryExtensions[category] || [];
}
