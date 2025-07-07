// src/components/Camera/CameraView.tsx
import React, { useState, forwardRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCcw, AlertCircle } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import CameraControls from './CameraControls';
import CameraPermissions from './CameraPermissions';
import { useCamera } from '../../hooks/useCamera';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import type { FilterType } from '../../types/filter';
import { APP_CONFIG } from '../../constants/config';

interface CameraViewProps {
  onCapture: (photoData: string) => void;
  selectedFilter: FilterType;
  capturedCount: number;
  totalCount: number;
}

const CameraView = forwardRef<any, CameraViewProps>(({ 
  onCapture, 
  selectedFilter, 
  capturedCount, 
  totalCount 
}, ref) => {
  const [isCountdown, setIsCountdown] = useState(false);
  const { 
    hasPermission, 
    error: cameraError, 
    startCamera, 
    toggleCamera, 
    hasMultipleCameras,
    getVideoConstraints 
  } = useCamera();
  const { handleError } = useErrorHandler();

  const handleCaptureClick = () => {
    if (!ref || !('current' in ref) || !ref.current) {
      handleError(new Error('Camera not available'));
      return;
    }
    setIsCountdown(true);
  };

  const handleCountdownComplete = () => {
    setIsCountdown(false);
    try {
      if (!ref || !('current' in ref) || !ref.current) {
        throw new Error('Camera not available');
      }
      
      const imageSrc = ref.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      } else {
        throw new Error('Failed to capture image');
      }
    } catch (err) {
      handleError(err as Error);
    }
  };

  const handlePermissionGranted = () => {
    startCamera();
  };

  const handlePermissionDenied = (err: Error) => {
    handleError(err);
  };

  if (hasPermission === null) {
    return (
      <CameraPermissions
        onGranted={handlePermissionGranted}
        onDenied={handlePermissionDenied}
      />
    );
  }

  if (hasPermission === false || cameraError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Camera Access Required
        </h2>
        <p className="text-gray-600 mb-4">
          {cameraError || 'Please allow camera access to use the photo booth.'}
        </p>
        <button
          onClick={() => startCamera()}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const videoConstraints = getVideoConstraints();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative">
        <Webcam
          ref={ref}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className={`w-full h-auto ${selectedFilter.className}`}
          onUserMediaError={(err) => {
            handleError(new Error('Camera initialization failed'));
          }}
        />
        
        {isCountdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <CountdownTimer
              duration={APP_CONFIG.countdownDuration}
              onComplete={handleCountdownComplete}
            />
          </div>
        )}
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
            Photo {capturedCount + 1} of {totalCount}
          </div>
          {hasMultipleCameras && (
            <button
              onClick={toggleCamera}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              title="Switch Camera"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <CameraControls
        onCapture={handleCaptureClick}
        onToggleCamera={toggleCamera}
        disabled={isCountdown}
        hasMultipleCameras={hasMultipleCameras}
      />
    </div>
  );
});

CameraView.displayName = 'CameraView';

export default CameraView;
