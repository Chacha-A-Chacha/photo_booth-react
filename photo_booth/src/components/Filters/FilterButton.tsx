// src/components/Filters/FilterButton.tsx
import React from 'react';
import type { FilterType } from '../../types/filter';

interface FilterButtonProps {
  filter: FilterType;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  filter, 
  isSelected, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative p-2 rounded-lg border-2 transition-all text-left
        ${isSelected 
          ? 'border-purple-500 bg-purple-50' 
          : 'border-gray-200 hover:border-purple-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={filter.description}
    >
      <div className={`w-full h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded mb-2 ${filter.previewClass}`} />
      <div className="text-xs font-medium text-gray-700">{filter.name}</div>
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border border-white" />
      )}
    </button>
  );
};

export { FilterButton };
