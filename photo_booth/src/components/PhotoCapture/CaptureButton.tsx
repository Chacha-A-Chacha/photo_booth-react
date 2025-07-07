// src/components/PhotoCapture/CaptureButton.tsx
import React from 'react';
import { Camera, Loader2 } from 'lucide-react';

interface CaptureButtonProps {
  onCapture: () => void;
  disabled?: boolean;
  isCapturing?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CaptureButton: React.FC<CaptureButtonProps> = ({
  onCapture,
  disabled = false,
  isCapturing = false,
  size = 'lg'
}) => {
  const sizeClasses = {
    sm: 'p-2 w-12 h-12',
    md: 'p-3 w-16 h-16',
    lg: 'p-4 w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <button
      onClick={onCapture}
      disabled={disabled || isCapturing}
      className={`
        relative bg-purple-600 hover:bg-purple-700 disabled:opacity-50 
        disabled:cursor-not-allowed text-white rounded-full transition-colors 
        shadow-lg ${sizeClasses[size]}
      `}
      title="Take Photo"
    >
      {isCapturing ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Camera className={iconSizes[size]} />
      )}
    </button>
  );
};

export default CaptureButton;
