// src/types/photo.ts
import type { FilterType } from './filter';

export interface Photo {
  id: string;
  data: string; // Base64 data URL
  timestamp: number;
  filter?: FilterType;
  metadata?: PhotoMetadata;
}

export interface PhotoMetadata {
  width: number;
  height: number;
  size: number;
  format: string;
  deviceInfo?: {
    userAgent: string;
    platform: string;
  };
}

export interface PhotoCaptureState {
  photos: Photo[];
  currentIndex: number;
  isCapturing: boolean;
  maxPhotos: number;
}

export interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto?: (index: number) => void;
  showDelete?: boolean;
  className?: string;
}
