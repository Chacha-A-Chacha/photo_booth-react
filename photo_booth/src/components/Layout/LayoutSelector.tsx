// src/components/Layout/LayoutSelector.tsx
import React from 'react';
import type { LayoutType } from '../../types/layout';
import { LAYOUTS } from '../../constants/layouts';

interface LayoutSelectorProps {
  selectedLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  disabled?: boolean;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ 
  selectedLayout, 
  onLayoutChange, 
  disabled = false 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Layouts</h3>
      <div className="space-y-3">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutChange(layout)}
            disabled={disabled}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all
              ${selectedLayout.id === layout.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">{layout.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {layout.description}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {layout.photoCount} photos • {layout.width}x{layout.height}
                </div>
              </div>
              {selectedLayout.id === layout.id && (
                <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
