// src/constants/layouts.ts
import type { LayoutType } from '../types/layout';

export const LAYOUTS: LayoutType[] = [
  {
    id: 'strip-4',
    name: 'Classic Strip',
    description: '4 photos in a vertical strip',
    width: 600,
    height: 1800,
    photoCount: 4,
    backgroundColor: '#ffffff',
    positions: [
      { x: 50, y: 50, width: 500, height: 375 },
      { x: 50, y: 475, width: 500, height: 375 },
      { x: 50, y: 900, width: 500, height: 375 },
      { x: 50, y: 1325, width: 500, height: 375 }
    ],
    frame: {
      color: '#000000',
      width: 2,
      style: 'solid'
    },
    text: {
      text: 'Photo Booth',
      font: '24px Arial',
      color: '#666666',
      x: 300,
      y: 1750,
      align: 'center',
      baseline: 'middle'
    }
  },
  {
    id: 'postcard',
    name: 'Postcard',
    description: '2 photos side by side',
    width: 1200,
    height: 800,
    photoCount: 2,
    backgroundColor: '#f8f9fa',
    positions: [
      { x: 50, y: 100, width: 550, height: 600 },
      { x: 650, y: 100, width: 550, height: 600 }
    ],
    frame: {
      color: '#e9ecef',
      width: 10,
      style: 'solid',
      cornerRadius: 15
    }
  },
  {
    id: 'square-4',
    name: 'Square Grid',
    description: '4 photos in a 2x2 grid',
    width: 800,
    height: 800,
    photoCount: 4,
    backgroundColor: '#ffffff',
    positions: [
      { x: 50, y: 50, width: 325, height: 325 },
      { x: 425, y: 50, width: 325, height: 325 },
      { x: 50, y: 425, width: 325, height: 325 },
      { x: 425, y: 425, width: 325, height: 325 }
    ],
    frame: {
      color: '#000000',
      width: 5,
      style: 'solid'
    }
  },
  {
    id: 'polaroid',
    name: 'Polaroid Style',
    description: 'Single photo with polaroid frame',
    width: 600,
    height: 750,
    photoCount: 1,
    backgroundColor: '#ffffff',
    positions: [
      { x: 50, y: 50, width: 500, height: 500 }
    ],
    frame: {
      color: '#f8f9fa',
      width: 20,
      style: 'solid'
    },
    text: {
      text: 'Made with Photo Booth',
      font: '18px cursive',
      color: '#6c757d',
      x: 300,
      y: 650,
      align: 'center',
      baseline: 'middle'
    }
  },
  {
    id: 'collage-6',
    name: 'Photo Collage',
    description: '6 photos in mixed layout',
    width: 1200,
    height: 900,
    photoCount: 6,
    backgroundColor: '#f1f3f4',
    positions: [
      { x: 50, y: 50, width: 300, height: 250 },
      { x: 400, y: 50, width: 300, height: 250 },
      { x: 750, y: 50, width: 300, height: 250 },
      { x: 50, y: 350, width: 300, height: 250 },
      { x: 400, y: 350, width: 300, height: 250 },
      { x: 750, y: 350, width: 300, height: 250 }
    ],
    frame: {
      color: '#ffffff',
      width: 8,
      style: 'solid',
      cornerRadius: 10
    }
  },
  {
    id: 'mini-strip',
    name: 'Mini Strip',
    description: '3 small photos vertically',
    width: 400,
    height: 1200,
    photoCount: 3,
    backgroundColor: '#ffffff',
    positions: [
      { x: 50, y: 50, width: 300, height: 300 },
      { x: 50, y: 400, width: 300, height: 300 },
      { x: 50, y: 750, width: 300, height: 300 }
    ],
    frame: {
      color: '#000000',
      width: 3,
      style: 'dashed'
    }
  }
];

export const DEFAULT_LAYOUT = LAYOUTS[0];

export const LAYOUT_CATEGORIES = {
  STRIPS: ['strip-4', 'mini-strip'],
  GRIDS: ['square-4', 'collage-6'],
  SINGLE: ['polaroid'],
  HORIZONTAL: ['postcard']
};

export const LAYOUT_SIZES = {
  SMALL: { width: 400, height: 600 },
  MEDIUM: { width: 600, height: 800 },
  LARGE: { width: 800, height: 1200 },
  EXTRA_LARGE: { width: 1200, height: 1800 }
};
