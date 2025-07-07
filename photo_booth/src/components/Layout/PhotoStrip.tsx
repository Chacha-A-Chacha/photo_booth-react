// src/components/Layout/PhotoStrip.tsx
import React from 'react';
import type { LayoutType } from '../../types/layout';

interface PhotoStripProps {
  layout: LayoutType;
  photos: string[];
  className?: string;
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ layout, photos, className = '' }) => {
  return (
    <div 
      className={`relative bg-white shadow-lg ${className}`}
      style={{ 
        width: layout.width / 4, 
        height: layout.height / 4,
        backgroundColor: layout.backgroundColor 
      }}
    >
      {photos.map((photo, index) => {
        const position = layout.positions[index];
        if (!position) return null;
        
        return (
          <img
            key={index}
            src={photo}
            alt={`Photo ${index + 1}`}
            className="absolute object-cover"
            style={{
              left: position.x / 4,
              top: position.y / 4,
              width: position.width / 4,
              height: position.height / 4
            }}
          />
        );
      })}
      {layout.frame && (
        <div 
          className="absolute inset-0"
          style={{
            border: `${layout.frame.width}px ${layout.frame.style} ${layout.frame.color}`
          }}
        />
      )}
    </div>
  );
};

export { PhotoStrip };
