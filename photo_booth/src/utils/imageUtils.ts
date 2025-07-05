// src/utils/imageUtils.ts
import { createCanvas, loadImage } from './canvasUtils';

export const resizeImage = (
  image: HTMLImageElement, 
  maxWidth: number, 
  maxHeight: number, 
  maintainAspectRatio: boolean = true
): HTMLCanvasElement => {
  const canvas = createCanvas(maxWidth, maxHeight);
  const ctx = canvas.getContext('2d')!;
  
  let { width, height } = image;
  
  if (maintainAspectRatio) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = width * ratio;
    height = height * ratio;
  }
  
  canvas.width = width;
  canvas.height = height;
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, width, height);
  
  return canvas;
};

export const cropImage = (
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
): HTMLCanvasElement => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  
  return canvas;
};

export const flipImage = (image: HTMLImageElement, horizontal: boolean = true): HTMLCanvasElement => {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d')!;
  
  ctx.save();
  
  if (horizontal) {
    ctx.scale(-1, 1);
    ctx.translate(-image.width, 0);
  } else {
    ctx.scale(1, -1);
    ctx.translate(0, -image.height);
  }
  
  ctx.drawImage(image, 0, 0);
  ctx.restore();
  
  return canvas;
};

export const rotateImage = (image: HTMLImageElement, degrees: number): HTMLCanvasElement => {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  
  const newWidth = image.width * cos + image.height * sin;
  const newHeight = image.width * sin + image.height * cos;
  
  const canvas = createCanvas(newWidth, newHeight);
  const ctx = canvas.getContext('2d')!;
  
  ctx.save();
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();
  
  return canvas;
};

export const adjustImageBrightness = (
  canvas: HTMLCanvasElement,
  brightness: number
): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + brightness));     // Red
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness)); // Green
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness)); // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

export const adjustImageContrast = (
  canvas: HTMLCanvasElement,
  contrast: number
): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

export const createImageThumbnail = (
  image: HTMLImageElement,
  size: number = 150
): HTMLCanvasElement => {
  return resizeImage(image, size, size, true);
};

export const getImageDimensions = (dataURL: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataURL;
  });
};

export const compressImage = (
  canvas: HTMLCanvasElement,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): string => {
  let outputCanvas = canvas;
  
  if (canvas.width > maxWidth || canvas.height > maxHeight) {
    const tempImage = new Image();
    tempImage.src = canvas.toDataURL();
    outputCanvas = resizeImage(tempImage, maxWidth, maxHeight, true);
  }
  
  return outputCanvas.toDataURL('image/jpeg', quality);
};

export const detectImageFormat = (dataURL: string): string => {
  if (dataURL.startsWith('data:image/png')) return 'png';
  if (dataURL.startsWith('data:image/jpeg')) return 'jpeg';
  if (dataURL.startsWith('data:image/webp')) return 'webp';
  return 'unknown';
};

export const convertImageFormat = (
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp',
  quality: number = 0.92
): string => {
  const mimeType = `image/${format}`;
  return canvas.toDataURL(mimeType, quality);
};
