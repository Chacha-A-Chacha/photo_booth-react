// src/utils/downloadUtils.ts
import { validateCanvas } from './canvasUtils';

export const downloadCanvasAsImage = (
  canvas: HTMLCanvasElement, 
  filename: string = 'photo-booth.png',
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.92
): void => {
  try {
    validateCanvas(canvas);
    
    const mimeType = `image/${format}`;
    const dataURL = canvas.toDataURL(mimeType, quality);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download image');
  }
};

export const generateFileName = (
  prefix: string = 'photo-booth',
  format: 'png' | 'jpeg' | 'webp' = 'png',
  timestamp: boolean = true
): string => {
  const now = timestamp ? new Date().toISOString().replace(/[:.]/g, '-') : '';
  const timestampSuffix = timestamp ? `-${now}` : '';
  return `${prefix}${timestampSuffix}.${format}`;
};

export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.92
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    validateCanvas(canvas);
    
    const mimeType = `image/${format}`;
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      mimeType,
      quality
    );
  });
};

export const shareCanvas = async (
  canvas: HTMLCanvasElement,
  filename: string = 'photo-booth.png',
  format: 'png' | 'jpeg' | 'webp' = 'png'
): Promise<void> => {
  if (!navigator.share) {
    throw new Error('Web Share API not supported');
  }
  
  try {
    const blob = await canvasToBlob(canvas, format);
    const file = new File([blob], filename, { type: blob.type });
    
    await navigator.share({
      title: 'Photo Booth',
      text: 'Check out my photo booth creation!',
      files: [file]
    });
  } catch (error) {
    console.error('Share failed:', error);
    throw new Error('Failed to share image');
  }
};

export const copyCanvasToClipboard = async (
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png'
): Promise<void> => {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API not supported');
  }
  
  try {
    const blob = await canvasToBlob(canvas, format);
    const item = new ClipboardItem({ [blob.type]: blob });
    
    await navigator.clipboard.write([item]);
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    throw new Error('Failed to copy to clipboard');
  }
};

export const getOptimalFormat = (hasTransparency: boolean = false): 'png' | 'jpeg' | 'webp' => {
  if (hasTransparency) return 'png';
  
  // Check WebP support
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  return webpSupported ? 'webp' : 'jpeg';
};
