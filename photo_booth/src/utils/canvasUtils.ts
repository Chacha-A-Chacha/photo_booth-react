// src/utils/canvasUtils.ts
import type { FilterType } from '../types/filter';
import type { LayoutType } from '../types/layout';

export const createCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const validateCanvas = (canvas: HTMLCanvasElement): boolean => {
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Invalid canvas element');
  }
  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error('Canvas has no dimensions');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Cannot get canvas context');
  }
  return true;
};

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string = 'photo-booth.png'): void => {
  try {
    validateCanvas(canvas);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download image');
  }
};

export const optimizeImage = (canvas: HTMLCanvasElement, quality: number = 0.9, format: string = 'image/jpeg'): string => {
  validateCanvas(canvas);
  return canvas.toDataURL(format, quality);
};

export const resizeCanvas = (canvas: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement => {
  validateCanvas(canvas);
  
  const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
  const newWidth = Math.floor(canvas.width * ratio);
  const newHeight = Math.floor(canvas.height * ratio);
  
  const resizedCanvas = createCanvas(newWidth, newHeight);
  const ctx = resizedCanvas.getContext('2d')!;
  
  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
  
  return resizedCanvas;
};

export const applyFilterToCanvas = (canvas: HTMLCanvasElement, filter: FilterType): HTMLCanvasElement => {
  validateCanvas(canvas);
  
  const filteredCanvas = createCanvas(canvas.width, canvas.height);
  const ctx = filteredCanvas.getContext('2d')!;
  
  // Apply CSS filter
  ctx.filter = filter.cssFilter || 'none';
  ctx.drawImage(canvas, 0, 0);
  
  return filteredCanvas;
};

export const combineCanvases = (canvases: HTMLCanvasElement[], layout: LayoutType): HTMLCanvasElement => {
  if (!canvases || canvases.length === 0) {
    throw new Error('No canvases provided');
  }
  
  const combinedCanvas = createCanvas(layout.width, layout.height);
  const ctx = combinedCanvas.getContext('2d')!;
  
  // Clear and set background
  ctx.fillStyle = layout.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, layout.width, layout.height);
  
  // Draw each canvas
  canvases.forEach((canvas, index) => {
    const position = layout.positions[index];
    if (canvas && position) {
      ctx.drawImage(canvas, position.x, position.y, position.width, position.height);
    }
  });
  
  return combinedCanvas;
};
