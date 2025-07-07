// src/components/Filters/FilterPanel.tsx
import React from 'react';
import type { FilterType } from '../../types/filter';
import { FILTERS } from '../../constants/filters';

interface FilterPanelProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  disabled?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  selectedFilter, 
  onFilterChange, 
  disabled = false 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
      <div className="grid grid-cols-2 gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter)}
            disabled={disabled}
            className={`
              relative p-3 rounded-lg border-2 transition-all
              ${selectedFilter.id === filter.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={filter.description}
          >
            <div 
              className={`w-full h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded mb-2 ${filter.previewClass}`}
            />
            <div className="text-sm font-medium text-gray-700">
              {filter.name}
            </div>
            {selectedFilter.id === filter.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
