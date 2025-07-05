// src/hooks/useCanvas.ts
import { useRef, useCallback, useState } from 'react';
import type { LayoutType } from '../types/layout';
import type { FilterType } from '../types/filter';
import { validateCanvas, createCanvas } from '../utils/canvasUtils';
import { composePhotoStrip } from '../utils/layoutUtils';
import { downloadCanvasAsImage } from '../utils/downloadUtils';
import { handleCanvasError } from '../utils/errorUtils';

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeCanvas = useCallback((width: number, height: number) => {
    try {
      const canvas = createCanvas(width, height);
      canvasRef.current = canvas;
      setError(null);
      return canvas;
    } catch (error) {
      const appError = handleCanvasError(error as Error, 'initialize');
      setError(appError.message);
      throw appError;
    }
  }, []);

  const composePhotos = useCallback(async (
    photos: string[],
    layout: LayoutType,
    filter?: FilterType
  ) => {
    if (!canvasRef.current) {
      throw new Error('Canvas not initialized');
    }

    setIsProcessing(true);
    setError(null);

    try {
      await composePhotoStrip(canvasRef.current, photos, layout, filter);
      return canvasRef.current;
    } catch (error) {
      const appError = handleCanvasError(error as Error, 'compose');
      setError(appError.message);
      throw appError;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const downloadImage = useCallback((filename?: string) => {
    if (!canvasRef.current) {
      throw new Error('Canvas not initialized');
    }

    try {
      downloadCanvasAsImage(canvasRef.current, filename);
    } catch (error) {
      const appError = handleCanvasError(error as Error, 'download');
      setError(appError.message);
      throw appError;
    }
  }, []);

  const getDataURL = useCallback((format: 'PNG' | 'JPEG' | 'WEBP' = 'PNG', quality = 0.9) => {
    if (!canvasRef.current) {
      throw new Error('Canvas not initialized');
    }

    try {
      validateCanvas(canvasRef.current);
      const mimeType = `image/${format.toLowerCase()}`;
      return canvasRef.current.toDataURL(mimeType, quality);
    } catch (error) {
      const appError = handleCanvasError(error as Error, 'getDataURL');
      setError(appError.message);
      throw appError;
    }
  }, []);

  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    try {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setError(null);
    } catch (error) {
      const appError = handleCanvasError(error as Error, 'clear');
      setError(appError.message);
      throw appError;
    }
  }, []);

  const getCanvasBlob = useCallback((format: 'PNG' | 'JPEG' | 'WEBP' = 'PNG', quality = 0.9): Promise<Blob> => {
    if (!canvasRef.current) {
      throw new Error('Canvas not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        validateCanvas(canvasRef.current!);
        const mimeType = `image/${format.toLowerCase()}`;
        canvasRef.current!.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, mimeType, quality);
      } catch (error) {
        const appError = handleCanvasError(error as Error, 'getBlob');
        reject(appError);
      }
    });
  }, []);

  return {
    canvasRef,
    isProcessing,
    error,
    initializeCanvas,
    composePhotos,
    downloadImage,
    getDataURL,
    clearCanvas,
    getCanvasBlob,
    isReady: !!canvasRef.current
  };
};
