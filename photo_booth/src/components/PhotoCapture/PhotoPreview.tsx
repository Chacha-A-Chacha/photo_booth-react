// src/components/PhotoCapture/PhotoPreview.tsx
import React, { useEffect } from 'react';
import type { LayoutType, FilterType } from '../../types';
import { useCanvas } from '../../hooks/useCanvas';
import PhotoGrid from './PhotoGrid';

interface PhotoPreviewProps {
  photos: string[];
  layout: LayoutType;
  filter?: FilterType;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ 
  photos, 
  layout, 
  filter, 
  canvasRef 
}) => {
  const { composePhotos, isProcessing, error } = useCanvas();

  useEffect(() => {
    if (photos.length > 0 && canvasRef.current) {
      composePhotos(photos, layout, filter);
    }
  }, [photos, layout, filter, composePhotos]);

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative bg-gray-50 rounded-lg p-4">
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow-md max-w-full h-auto"
            style={{ maxHeight: '600px' }}
          />
        </div>
        
        <PhotoGrid photos={photos} />
      </div>
    </div>
  );
};

export default PhotoPreview;
