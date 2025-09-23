// Predefined sizes - System managed, not user configurable
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150, quality: 80 },
  small: { width: 300, height: 300, quality: 85 },
  medium: { width: 600, height: 600, quality: 90 },
  large: { width: 1200, height: 1200, quality: 95 },
  original: { quality: 100 },
} as const;


// Future - Audio/Video variants (interface only)
export const AUDIO_VARIANTS = {
  original: { quality: 100 },
  preview: { duration: 30, quality: 80 }, // 30s preview
};

export const VIDEO_VARIANTS = {
  original: { quality: 100 },
  thumbnail: { width: 300, height: 200, quality: 80 },
  preview: { duration: 10, quality: 70 }, // 10s preview
  compressed: { quality: 60, maxWidth: 720 },
};

export type ImageSizeName = keyof typeof IMAGE_SIZES;

// Media categories
export const MEDIA_CATEGORIES = {
  GENERAL: 'general',
  PROFILE: 'profile',
} as const;

// Media file types
export const MEDIA_FILE_TYPES = {
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
} as const;

// Media processing status
export const MEDIA_PROCESSING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type MediaCategory = typeof MEDIA_CATEGORIES[keyof typeof MEDIA_CATEGORIES];
export type MediaFileType = typeof MEDIA_FILE_TYPES[keyof typeof MEDIA_FILE_TYPES];
export type MediaProcessingStatus = typeof MEDIA_PROCESSING_STATUS[keyof typeof MEDIA_PROCESSING_STATUS];
