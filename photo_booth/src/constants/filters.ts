// src/constants/filters.ts
import type { FilterType } from '../types/filter';

export const FILTERS: FilterType[] = [
  {
    id: 'none',
    name: 'Original',
    cssFilter: 'none',
    className: 'filter-none',
    previewClass: 'filter-none',
    description: 'No filter applied',
    intensity: 0
  },
  {
    id: 'vintage',
    name: 'Vintage',
    cssFilter: 'sepia(0.5) contrast(1.2) brightness(0.8)',
    className: 'filter-vintage',
    previewClass: 'filter-vintage',
    description: 'Warm vintage look',
    intensity: 0.5
  },
  {
    id: 'bw',
    name: 'Black & White',
    cssFilter: 'grayscale(100%) contrast(1.2)',
    className: 'filter-bw',
    previewClass: 'filter-bw',
    description: 'Classic black and white',
    intensity: 1.0
  },
  {
    id: 'warm',
    name: 'Warm',
    cssFilter: 'contrast(1.1) brightness(1.1) saturate(1.3)',
    className: 'filter-warm',
    previewClass: 'filter-warm',
    description: 'Warm and cozy tones',
    intensity: 0.3
  },
  {
    id: 'cool',
    name: 'Cool',
    cssFilter: 'contrast(1.1) brightness(0.9) hue-rotate(180deg)',
    className: 'filter-cool',
    previewClass: 'filter-cool',
    description: 'Cool blue tones',
    intensity: 0.4
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    cssFilter: 'contrast(1.5) brightness(0.7) saturate(1.5)',
    className: 'filter-dramatic',
    previewClass: 'filter-dramatic',
    description: 'High contrast dramatic look',
    intensity: 0.7
  },
  {
    id: 'soft',
    name: 'Soft',
    cssFilter: 'contrast(0.8) brightness(1.2) blur(0.5px)',
    className: 'filter-soft',
    previewClass: 'filter-soft',
    description: 'Soft dreamy effect',
    intensity: 0.3
  },
  {
    id: 'retro',
    name: 'Retro',
    cssFilter: 'sepia(0.8) hue-rotate(315deg) saturate(1.5)',
    className: 'filter-retro',
    previewClass: 'filter-retro',
    description: 'Retro film look',
    intensity: 0.6
  }
];

export const DEFAULT_FILTER = FILTERS[0];

export const FILTER_CATEGORIES = {
  BASIC: ['none', 'bw', 'vintage'],
  ARTISTIC: ['dramatic', 'soft', 'retro'],
  TEMPERATURE: ['warm', 'cool']
};

export const FILTER_INTENSITIES = {
  LIGHT: 0.3,
  MEDIUM: 0.5,
  STRONG: 0.7,
  MAXIMUM: 1.0
};
