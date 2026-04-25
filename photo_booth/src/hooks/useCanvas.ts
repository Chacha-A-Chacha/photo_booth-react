// src/hooks/useCanvas.ts
import { useCallback, useState } from 'react';
import type { LayoutType } from '../types/layout';
import type { FilterType } from '../types/filter';
import { composePhotoStrip } from '../utils/layoutUtils';
import { downloadCanvasAsImage } from '../utils/downloadUtils';
import { handleCanvasError } from '../utils/errorUtils';

// The caller owns the <canvas> element and passes it in. This avoids the
// previous bug where each useCanvas() instance had its own (unattached)
// canvasRef and silently no-op'd composition.
export const useCanvas = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const composePhotos = useCallback(async (
    canvas: HTMLCanvasElement | null,
    photos: string[],
    layout: LayoutType,
    filter?: FilterType
  ) => {
    if (!canvas) {
      const message = 'Canvas not ready';
      setError(message);
      return null;
    }

    setIsProcessing(true);
    setError(null);
    try {
      await composePhotoStrip(canvas, photos, layout, filter);
      return canvas;
    } catch (err) {
      const appError = handleCanvasError(err as Error, 'compose');
      setError(appError.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const downloadImage = useCallback((
    canvas: HTMLCanvasElement | null,
    filename?: string
  ) => {
    if (!canvas) {
      throw new Error('Canvas not ready');
    }
    try {
      downloadCanvasAsImage(canvas, filename);
    } catch (err) {
      const appError = handleCanvasError(err as Error, 'download');
      setError(appError.message);
      throw appError;
    }
  }, []);

  return {
    isProcessing,
    error,
    composePhotos,
    downloadImage
  };
};
