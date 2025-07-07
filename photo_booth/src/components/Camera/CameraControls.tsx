// src/components/Camera/CameraControls.tsx
import React from 'react';
import { Camera, RotateCcw } from 'lucide-react';

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
    <div className="flex items-center justify-center space-x-6 p-6 bg-gray-50">
      {hasMultipleCameras && (
        <button
          onClick={onToggleCamera}
          disabled={disabled}
          className="p-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
          title="Switch Camera"
        >
          <RotateCcw className="w-5 h-5 text-gray-600" />
        </button>
      )}
      
      <button
        onClick={onCapture}
        disabled={disabled}
        className="relative p-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors shadow-lg"
        title="Take Photo"
      >
        <Camera className="w-8 h-8 text-white" />
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default CameraControls;
