// src/utils/layoutUtils.ts
import type { LayoutType, TextConfig } from '../types/layout';
import type { FilterType } from '../types/filter';
import { loadImage, validateCanvas } from './canvasUtils';
import { LAYOUTS } from '../constants/layouts';

// Compute a center-crop source rect that fills the destination box ("cover").
const coverCrop = (
  imgW: number,
  imgH: number,
  dstW: number,
  dstH: number
) => {
  const srcAspect = imgW / imgH;
  const dstAspect = dstW / dstH;
  let sx = 0, sy = 0, sWidth = imgW, sHeight = imgH;
  if (srcAspect > dstAspect) {
    sWidth = imgH * dstAspect;
    sx = (imgW - sWidth) / 2;
  } else if (srcAspect < dstAspect) {
    sHeight = imgW / dstAspect;
    sy = (imgH - sHeight) / 2;
  }
  return { sx, sy, sWidth, sHeight };
};

export const composePhotoStrip = async (
  canvas: HTMLCanvasElement,
  photos: string[],
  layout: LayoutType,
  filter?: FilterType
): Promise<HTMLCanvasElement> => {
  try {
    validateCanvas(canvas);

    const ctx = canvas.getContext('2d')!;
    canvas.width = layout.width;
    canvas.height = layout.height;

    // Background
    ctx.fillStyle = layout.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Photos with center-crop ("cover") and optional filter
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const position = layout.positions[i];
      if (!photo || !position) continue;

      const img = await loadImage(photo);
      const { sx, sy, sWidth, sHeight } = coverCrop(
        img.width,
        img.height,
        position.width,
        position.height
      );

      ctx.save();
      if (filter && filter.cssFilter !== 'none') {
        ctx.filter = filter.cssFilter;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        img,
        sx, sy, sWidth, sHeight,
        position.x, position.y, position.width, position.height
      );
      ctx.restore();
    }

    // Frame: stroke is centered on the path, so inset by half the line width
    // so the full frame stays inside the canvas.
    if (layout.frame) {
      const fw = layout.frame.width;
      const offset = fw / 2;
      const w = canvas.width - fw;
      const h = canvas.height - fw;

      ctx.save();
      ctx.strokeStyle = layout.frame.color;
      ctx.lineWidth = fw;
      if (layout.frame.style === 'dashed') {
        ctx.setLineDash([fw * 2, fw]);
      } else if (layout.frame.style === 'dotted') {
        ctx.setLineDash([1, fw * 1.5]);
        ctx.lineCap = 'round';
      }

      const radius = layout.frame.cornerRadius;
      const supportsRoundRect =
        typeof (ctx as CanvasRenderingContext2D & { roundRect?: unknown }).roundRect === 'function';
      if (radius && supportsRoundRect) {
        ctx.beginPath();
        (ctx as CanvasRenderingContext2D & {
          roundRect: (x: number, y: number, w: number, h: number, r: number) => void;
        }).roundRect(offset, offset, w, h, radius);
        ctx.stroke();
      } else {
        ctx.strokeRect(offset, offset, w, h);
      }
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Text / logo
    if (layout.text) {
      drawText(ctx, layout.text);
    }

    return canvas;
  } catch (error) {
    console.error('Photo strip composition error:', error);
    throw new Error('Failed to compose photo strip');
  }
};

const drawText = (ctx: CanvasRenderingContext2D, textConfig: TextConfig): void => {
  if (!textConfig.text) return;
  
  ctx.save();
  ctx.font = textConfig.font || '16px Arial';
  ctx.fillStyle = textConfig.color || '#000000';
  ctx.textAlign = textConfig.align || 'center';
  ctx.textBaseline = textConfig.baseline || 'middle';
  
  // Add text shadow if specified
  if (textConfig.shadow) {
    ctx.shadowColor = textConfig.shadow.color || '#000000';
    ctx.shadowOffsetX = textConfig.shadow.offsetX || 2;
    ctx.shadowOffsetY = textConfig.shadow.offsetY || 2;
    ctx.shadowBlur = textConfig.shadow.blur || 4;
  }
  
  ctx.fillText(textConfig.text, textConfig.x, textConfig.y);
  ctx.restore();
};

export const calculateOptimalLayout = (
  photos: string[], 
  containerWidth: number, 
  containerHeight: number
): LayoutType => {
  const photoCount = photos.length;
  if (photoCount === 0) {
    throw new Error('No photos provided');
  }
  
  // Calculate optimal grid dimensions
  const cols = Math.ceil(Math.sqrt(photoCount));
  const rows = Math.ceil(photoCount / cols);
  
  // Calculate photo dimensions with padding
  const padding = 10;
  const photoWidth = Math.floor((containerWidth - padding * (cols + 1)) / cols);
  const photoHeight = Math.floor((containerHeight - padding * (rows + 1)) / rows);
  
  // Generate positions
  const positions = [];
  for (let i = 0; i < photoCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    positions.push({
      x: padding + col * (photoWidth + padding),
      y: padding + row * (photoHeight + padding),
      width: photoWidth,
      height: photoHeight
    });
  }
  
  return {
    id: 'auto-generated',
    name: 'Auto Layout',
    width: containerWidth,
    height: containerHeight,
    photoCount,
    backgroundColor: '#ffffff',
    positions
  };
};

export const validateLayoutId = (layoutId: string): boolean => {
  return LAYOUTS.some(layout => layout.id === layoutId);
};

export const getLayoutById = (layoutId: string): LayoutType | undefined => {
  return LAYOUTS.find(layout => layout.id === layoutId);
};
