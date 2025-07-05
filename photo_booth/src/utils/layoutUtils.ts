// src/utils/layoutUtils.ts
import type { LayoutType, TextConfig } from '../types/layout';
import type { FilterType } from '../types/filter';
import { loadImage, createCanvas, validateCanvas } from './canvasUtils';

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

    // Clear canvas with background
    ctx.fillStyle = layout.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw photos
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const position = layout.positions[i];
      
      if (photo && position) {
        const img = await loadImage(photo);
        
        // Create temporary canvas for filter application
        const tempCanvas = createCanvas(position.width, position.height);
        const tempCtx = tempCanvas.getContext('2d')!;
        
        // Apply filter if specified
        if (filter && filter.cssFilter !== 'none') {
          tempCtx.filter = filter.cssFilter;
        }
        
        // Draw image with proper scaling
        tempCtx.drawImage(img, 0, 0, position.width, position.height);
        
        // Draw to main canvas
        ctx.drawImage(tempCanvas, position.x, position.y);
      }
    }

    // Draw frame/border
    if (layout.frame) {
      ctx.strokeStyle = layout.frame.color;
      ctx.lineWidth = layout.frame.width;
      if (layout.frame.style === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (layout.frame.style === 'dotted') {
        ctx.setLineDash([2, 2]);
      }
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.setLineDash([]); // Reset line dash
    }

    // Add text/logo if specified
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
