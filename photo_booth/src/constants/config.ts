// src/constants/config.ts
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Photo Booth',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  maxPhotos: parseInt(import.meta.env.VITE_MAX_PHOTOS) || 10,
  countdownDuration: parseInt(import.meta.env.VITE_COUNTDOWN_DURATION) || 3,
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  camera: {
    defaultWidth: parseInt(import.meta.env.VITE_CAMERA_RESOLUTION_WIDTH) || 1280,
    defaultHeight: parseInt(import.meta.env.VITE_CAMERA_RESOLUTION_HEIGHT) || 720,
    facingMode: 'user' as const
  },
  canvas: {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 0.9
  },
  storage: {
    keyPrefix: 'photo_booth_',
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
  }
};

export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const CAMERA_CONSTRAINTS = {
  video: {
    width: { ideal: APP_CONFIG.camera.defaultWidth },
    height: { ideal: APP_CONFIG.camera.defaultHeight },
    facingMode: APP_CONFIG.camera.facingMode
  }
};

export const DOWNLOAD_FORMATS = {
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  WEBP: 'image/webp'
} as const;

export const QUALITY_PRESETS = {
  LOW: 0.6,
  MEDIUM: 0.8,
  HIGH: 0.9,
  MAXIMUM: 1.0
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const;

export const STORAGE_KEYS = {
  SELECTED_FILTER: `${APP_CONFIG.storage.keyPrefix}selected_filter`,
  SELECTED_LAYOUT: `${APP_CONFIG.storage.keyPrefix}selected_layout`,
  SESSION_PHOTOS: `${APP_CONFIG.storage.keyPrefix}session_photos`,
  USER_PREFERENCES: `${APP_CONFIG.storage.keyPrefix}user_preferences`
} as const;
