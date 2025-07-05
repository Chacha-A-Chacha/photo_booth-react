// src/utils/validationUtils.ts
import type { FilterType } from '../types/filter';
import type { LayoutType } from '../types/layout';

export const validateImageDataURL = (dataURL: string): boolean => {
  if (!dataURL || typeof dataURL !== 'string') {
    return false;
  }
  
  const validPrefixes = [
    'data:image/jpeg;base64,',
    'data:image/png;base64,',
    'data:image/webp;base64,'
  ];
  
  return validPrefixes.some(prefix => dataURL.startsWith(prefix));
};

export const validateCanvasDimensions = (width: number, height: number): boolean => {
  if (typeof width !== 'number' || typeof height !== 'number') {
    return false;
  }
  
  const maxSize = 32767; // Browser canvas limit
  const minSize = 1;
  
  return width >= minSize && height >= minSize && width <= maxSize && height <= maxSize;
};

export const validateFilter = (filter: FilterType): boolean => {
  if (!filter || typeof filter !== 'object') {
    return false;
  }
  
  const requiredFields = ['id', 'name', 'cssFilter'];
  return requiredFields.every(field => field in filter && filter[field as keyof FilterType]);
};

export const validateLayout = (layout: LayoutType): boolean => {
  if (!layout || typeof layout !== 'object') {
    return false;
  }
  
  const requiredFields = ['id', 'name', 'width', 'height', 'photoCount', 'positions'];
  const hasRequiredFields = requiredFields.every(field => field in layout);
  
  if (!hasRequiredFields) {
    return false;
  }
  
  // Validate positions array
  if (!Array.isArray(layout.positions) || layout.positions.length !== layout.photoCount) {
    return false;
  }
  
  // Validate each position
  return layout.positions.every(pos => 
    typeof pos.x === 'number' && 
    typeof pos.y === 'number' && 
    typeof pos.width === 'number' && 
    typeof pos.height === 'number' &&
    pos.x >= 0 && pos.y >= 0 && pos.width > 0 && pos.height > 0
  );
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  if (!file || !(file instanceof File)) {
    return false;
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateImageFile = (file: File): boolean => {
  if (!file || !(file instanceof File)) {
    return false;
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return allowedTypes.includes(file.type);
};

export const validateMediaDevices = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

export const validateWebRTCSupport = (): boolean => {
  return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection);
};

export const validateCanvasSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  } catch {
    return false;
  }
};

export const validateBrowserFeatures = (): { supported: boolean; missing: string[] } => {
  const features = {
    canvas: validateCanvasSupport(),
    mediaDevices: validateMediaDevices(),
    webRTC: validateWebRTCSupport(),
    localStorage: 'localStorage' in window,
    fetch: 'fetch' in window,
    blob: 'Blob' in window,
    url: 'URL' in window
  };
  
  const missing = Object.entries(features)
    .filter(([_, supported]) => !supported)
    .map(([feature]) => feature);
  
  return {
    supported: missing.length === 0,
    missing
  };
};

export const sanitizeFilename = (filename: string): string => {
  // Remove invalid characters for file names
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

export const validatePhotoCount = (count: number, min: number = 1, max: number = 10): boolean => {
  return Number.isInteger(count) && count >= min && count <= max;
};
