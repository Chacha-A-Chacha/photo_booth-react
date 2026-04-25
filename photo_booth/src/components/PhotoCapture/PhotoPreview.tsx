// src/components/PhotoCapture/PhotoPreview.tsx
import React, { useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { LayoutType, Photo } from '../../types';
import { useCanvas } from '../../hooks/useCanvas';
import PhotoGrid from './PhotoGrid';

interface PhotoPreviewProps {
  photos: Photo[];
  layout: LayoutType;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photos,
  layout,
  canvasRef
}) => {
  const { composePhotos, isProcessing, error } = useCanvas();

  useEffect(() => {
    if (photos.length > 0 && canvasRef.current) {
      // Filters are baked into each photo at capture time, so we don't
      // re-apply them at composition.
      composePhotos(photos.map(p => p.data), layout);
    }
  }, [photos, layout, composePhotos, canvasRef]);

  if (error) {
    return (
      <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop p-8 text-center">
        <div className="font-display text-2xl text-coral mb-2">Oops!</div>
        <div className="text-ink mb-6">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-ink text-cream font-semibold px-6 py-3 rounded-xl border-2 border-ink hover:bg-coral transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-ink flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-coral" strokeWidth={2.5} />
          Your Strip
        </h3>
        <span className="text-xs font-semibold uppercase tracking-wider bg-mustard text-ink border-2 border-ink rounded-full px-2.5 py-0.5">
          {layout.name}
        </span>
      </div>

      <div className="flex justify-center">
        <div className="relative inline-block tilt-l p-3 bg-cream border-4 border-ink rounded-2xl shadow-pop">
          {isProcessing && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream/85 rounded-2xl">
              <div className="w-10 h-10 border-4 border-ink border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="block rounded-lg max-w-full h-auto"
            style={{ maxHeight: '60vh' }}
          />
          <div className="text-center mt-2 font-display text-ink/70 text-sm tracking-wide">
            ✦ photo booth ✦
          </div>
        </div>
      </div>

      <PhotoGrid photos={photos} />
    </div>
  );
};

export default PhotoPreview;
