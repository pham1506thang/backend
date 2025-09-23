// Predefined sizes - System managed, not user configurable
// General images use 3:2 ratio (landscape)
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 100, quality: 80 }, // 3:2 ratio
  small: { width: 300, height: 200, quality: 85 }, // 3:2 ratio
  medium: { width: 600, height: 400, quality: 90 }, // 3:2 ratio
  large: { width: 1200, height: 800, quality: 95 }, // 3:2 ratio
  original: { quality: 100 },
} as const;

// Profile images use 1:1 ratio (square)
export const PROFILE_IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150, quality: 80 }, // 1:1 ratio
  small: { width: 300, height: 300, quality: 85 }, // 1:1 ratio
  medium: { width: 600, height: 600, quality: 90 }, // 1:1 ratio
  large: { width: 1200, height: 1200, quality: 95 }, // 1:1 ratio
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
export type ProfileImageSizeName = keyof typeof PROFILE_IMAGE_SIZES;

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
