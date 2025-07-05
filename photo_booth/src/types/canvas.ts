// src/types/canvas.ts
export interface CanvasConfig {
  width: number;
  height: number;
  quality: number;
  format: 'image/png' | 'image/jpeg' | 'image/webp';
}

export interface CanvasUtils {
  createCanvas: (width: number, height: number) => HTMLCanvasElement;
  loadImage: (src: string) => Promise<HTMLImageElement>;
  validateCanvas: (canvas: HTMLCanvasElement) => boolean;
  downloadCanvas: (canvas: HTMLCanvasElement, filename?: string) => void;
  optimizeImage: (canvas: HTMLCanvasElement, quality?: number) => string;
}

export interface DrawingOperation {
  type: 'image' | 'text' | 'shape';
  data: any;
  position: { x: number; y: number; width: number; height: number };
  style?: any;
}
