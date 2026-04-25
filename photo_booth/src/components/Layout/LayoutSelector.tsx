// src/components/Layout/LayoutSelector.tsx
import React from 'react';
import { LayoutGrid } from 'lucide-react';
import type { LayoutType } from '../../types/layout';
import { LAYOUTS } from '../../constants/layouts';

interface LayoutSelectorProps {
  selectedLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  disabled?: boolean;
}

const LayoutThumb: React.FC<{ layout: LayoutType; selected: boolean }> = ({ layout, selected }) => {
  const aspect = layout.width / layout.height;
  const thumbW = 56;
  const thumbH = thumbW / aspect;
  const sx = thumbW / layout.width;
  const sy = thumbH / layout.height;

  return (
    <div
      className={`relative shrink-0 rounded-md border-2 ${selected ? 'border-cream' : 'border-ink'} overflow-hidden`}
      style={{
        width: thumbW,
        height: thumbH,
        background: selected ? 'rgba(255,247,237,0.25)' : layout.backgroundColor
      }}
      aria-hidden
    >
      {layout.positions.map((pos, i) => (
        <div
          key={i}
          className={`absolute ${selected ? 'bg-cream' : 'bg-ink/70'}`}
          style={{
            left: pos.x * sx,
            top: pos.y * sy,
            width: pos.width * sx,
            height: pos.height * sy
          }}
        />
      ))}
    </div>
  );
};

const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  selectedLayout,
  onLayoutChange,
  disabled = false
}) => {
  return (
    <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-ink flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-coral" strokeWidth={2.5} />
          Layout
        </h3>
        <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">
          {LAYOUTS.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {LAYOUTS.map((layout) => {
          const isSelected = selectedLayout.id === layout.id;
          return (
            <button
              key={layout.id}
              onClick={() => onLayoutChange(layout)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={`
                w-full flex items-center gap-3 rounded-2xl border-2 border-ink p-3 text-left transition-all
                ${isSelected
                  ? 'bg-ink text-cream shadow-pop-sm -translate-y-0.5'
                  : 'bg-cream text-ink hover:bg-lilac hover:-translate-y-0.5 hover:shadow-pop-sm'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <LayoutThumb layout={layout} selected={isSelected} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{layout.name}</div>
                <div className={`text-xs truncate ${isSelected ? 'text-cream/70' : 'text-charcoal/70'}`}>
                  {layout.photoCount} photo{layout.photoCount > 1 ? 's' : ''} · {layout.description}
                </div>
              </div>
              {isSelected && (
                <span className="shrink-0 w-5 h-5 bg-coral border-2 border-cream rounded-full flex items-center justify-center text-cream text-[10px] font-black">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {disabled && (
        <p className="mt-3 text-xs text-charcoal/60 text-center italic">
          Retake photos to change layout
        </p>
      )}
    </div>
  );
};

export default LayoutSelector;
