// src/components/Filters/FilterPanel.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';
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
    <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-ink flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-coral" strokeWidth={2.5} />
          Filters
        </h3>
        <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">
          {FILTERS.length}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {FILTERS.map((filter) => {
          const isSelected = selectedFilter.id === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter)}
              disabled={disabled}
              title={filter.description}
              aria-pressed={isSelected}
              className={`
                group relative flex flex-col items-center gap-1.5 rounded-2xl border-2 border-ink p-2 transition-all
                ${isSelected
                  ? 'bg-coral text-cream shadow-pop-sm -translate-y-0.5'
                  : 'bg-cream text-ink hover:bg-mustard hover:-translate-y-0.5 hover:shadow-pop-sm'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div
                className="w-full aspect-square rounded-lg border-2 border-ink overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, #FFB8A8 0%, #FFD89E 35%, #C4B5FD 70%, #7DD3FC 100%)',
                  filter: filter.cssFilter !== 'none' ? filter.cssFilter : undefined
                }}
              />
              <span className="text-[11px] font-bold uppercase tracking-wide leading-tight text-center">
                {filter.name}
              </span>
              {isSelected && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-mustard border-2 border-ink rounded-full flex items-center justify-center text-ink text-[10px] font-black">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {disabled && (
        <p className="mt-3 text-xs text-charcoal/60 text-center italic">
          Retake photos to change filter
        </p>
      )}
    </div>
  );
};

export default FilterPanel;
