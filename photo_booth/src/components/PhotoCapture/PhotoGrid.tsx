// src/components/PhotoCapture/PhotoGrid.tsx
import React from 'react';
import { Trash2 } from 'lucide-react';

interface PhotoGridProps {
  photos: string[];
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
      <div className="text-center text-gray-500 py-8">
        No photos captured yet
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Captured Photos ({photos.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img 
              src={photo} 
              alt={`Photo ${index + 1}`}
              className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 group-hover:border-purple-400 transition-colors"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-2 py-1 rounded">
                {index + 1}
              </span>
            </div>
            {showDelete && onDeletePhoto && (
              <button
                onClick={() => onDeletePhoto(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Delete Photo"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
