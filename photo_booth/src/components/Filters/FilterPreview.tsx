// src/components/Filters/FilterPreview.tsx
import React from 'react';
import type { FilterType } from '../../types/filter';

interface FilterPreviewProps {
  filter: FilterType;
  imageUrl?: string;
}

const FilterPreview: React.FC<FilterPreviewProps> = ({ filter, imageUrl }) => {
  return (
    <div className="relative">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={`${filter.name} preview`}
          className={`w-full h-32 object-cover rounded ${filter.previewClass}`}
        />
      ) : (
        <div className={`w-full h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded ${filter.previewClass}`} />
      )}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {filter.name}
      </div>
    </div>
  );
};

export { FilterPreview };