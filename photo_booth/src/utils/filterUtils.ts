// src/utils/filterUtils.ts
import type { FilterType, CustomFilterOptions } from '../types/filter';

export const createCustomFilter = (options: CustomFilterOptions): string => {
  const filters: string[] = [];
  
  if (options.brightness) filters.push(`brightness(${options.brightness})`);
  if (options.contrast) filters.push(`contrast(${options.contrast})`);
  if (options.saturation) filters.push(`saturate(${options.saturation})`);
  if (options.hue) filters.push(`hue-rotate(${options.hue}deg)`);
  if (options.blur) filters.push(`blur(${options.blur}px)`);
  if (options.sepia) filters.push(`sepia(${options.sepia})`);
  if (options.grayscale) filters.push(`grayscale(${options.grayscale})`);
  
  return filters.length > 0 ? filters.join(' ') : 'none';
};

export const applyFilterToImageData = (
  imageData: ImageData,
  filter: FilterType
): ImageData => {
  const data = imageData.data;
  const newImageData = new ImageData(
    new Uint8ClampedArray(data),
    imageData.width,
    imageData.height
  );
  
  // Apply filter based on type
  switch (filter.id) {
    case 'bw':
      return applyGrayscaleFilter(newImageData);
    case 'sepia':
      return applySepiaFilter(newImageData);
    case 'vintage':
      return applyVintageFilter(newImageData);
    default:
      return newImageData;
  }
};

const applyGrayscaleFilter = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;     // red
    data[i + 1] = gray; // green
    data[i + 2] = gray; // blue
  }
  
  return imageData;
};

const applySepiaFilter = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
  
  return imageData;
};

const applyVintageFilter = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Vintage effect: reduce blue, enhance red/yellow
    data[i] = Math.min(255, r * 1.2);
    data[i + 1] = Math.min(255, g * 1.1);
    data[i + 2] = Math.min(255, b * 0.8);
  }
  
  return imageData;
};

export const getFilterPreview = (filter: FilterType): string => {
  return `
    <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded ${filter.className}"></div>
  `;
};

export const validateFilter = (filter: FilterType): boolean => {
  return !!(filter.id && filter.name && filter.cssFilter);
};
