// src/components/Camera/CameraControls.tsx
import React from 'react';
import { RotateCcw } from 'lucide-react';

interface CameraControlsProps {
  onCapture: () => void;
  onToggleCamera: () => void;
  disabled?: boolean;
  hasMultipleCameras?: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onToggleCamera,
  disabled = false,
  hasMultipleCameras = false
}) => {
  return (
    <div className="relative flex items-center justify-center gap-4 sm:gap-8 px-6 py-6 bg-paper border-t-4 border-ink">
      {/* Spacer to balance the layout when toggle is shown */}
      {hasMultipleCameras && <div className="w-12 sm:w-14" aria-hidden />}

      {/* Shutter */}
      <button
        onClick={onCapture}
        disabled={disabled}
        aria-label="Take photo"
        className="group relative disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="block w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-coral border-4 border-ink shadow-pop group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-pop-sm group-active:translate-x-[4px] group-active:translate-y-[4px] group-active:shadow-none transition-all" />
        <span className="absolute inset-2 sm:inset-2.5 rounded-full border-2 border-cream pointer-events-none" />
        {disabled && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-7 h-7 border-3 border-cream border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </button>

      {/* Camera toggle */}
      {hasMultipleCameras ? (
        <button
          onClick={onToggleCamera}
          disabled={disabled}
          aria-label="Switch camera"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cream border-2 border-ink shadow-pop-sm flex items-center justify-center hover:bg-mustard hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <RotateCcw className="w-5 h-5 text-ink" strokeWidth={2.5} />
        </button>
      ) : null}
    </div>
  );
};

export default CameraControls;
