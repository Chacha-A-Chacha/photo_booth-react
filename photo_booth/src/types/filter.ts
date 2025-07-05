// src/types/filter.ts
export interface FilterType {
  id: string;
  name: string;
  cssFilter: string;
  className: string;
  previewClass: string;
  description?: string;
  intensity?: number;
}

export interface FilterPanelProps {
  filters: FilterType[];
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  disabled?: boolean;
}

export interface CustomFilterOptions {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  blur?: number;
  sepia?: number;
  grayscale?: number;
}
