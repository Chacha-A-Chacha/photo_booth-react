// src/types/layout.ts
export interface PhotoPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutType {
  id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  photoCount: number;
  backgroundColor: string;
  positions: PhotoPosition[];
  frame?: FrameConfig;
  text?: TextConfig;
}

export interface FrameConfig {
  color: string;
  width: number;
  style?: 'solid' | 'dashed' | 'dotted';
  cornerRadius?: number;
}

export interface TextConfig {
  text: string;
  font: string;
  color: string;
  x: number;
  y: number;
  align: 'left' | 'center' | 'right';
  baseline: 'top' | 'middle' | 'bottom';
  shadow?: TextShadow;
}

export interface TextShadow {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
}
