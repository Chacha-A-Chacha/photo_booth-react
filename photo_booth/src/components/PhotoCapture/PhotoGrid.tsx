// src/components/PhotoCapture/PhotoGrid.tsx
import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Photo } from '../../types';

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto?: (index: number) => void;
  showDelete?: boolean;
  className?: string;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  onDeletePhoto,
  showDelete = false,
  className = ""
}) => {
  if (photos.length === 0) {
    return (
      <div className="text-center text-charcoal/60 py-6 italic">
        No photos captured yet
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <h4 className="font-display text-base text-ink mb-2">
        Frames · {photos.length}
      </h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {photos.map((photo, index) => {
          const tilt = index % 2 === 0 ? 'tilt-l' : 'tilt-r';
          return (
            <div key={photo.id} className={`relative group ${tilt}`}>
              <div className="bg-cream border-2 border-ink rounded-md p-1.5 shadow-pop-sm">
                <img
                  src={photo.data}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-16 object-cover rounded-sm"
                />
                <div className="text-center font-display text-[10px] text-ink/70 leading-tight pt-0.5">
                  #{index + 1}
                </div>
              </div>
              {showDelete && onDeletePhoto && (
                <button
                  onClick={() => onDeletePhoto(index)}
                  className="absolute -top-1 -right-1 p-1 bg-coral text-cream border-2 border-ink rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-coral-dark"
                  title="Delete Photo"
                  aria-label="Delete photo"
                >
                  <Trash2 className="w-3 h-3" strokeWidth={2.5} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotoGrid;
