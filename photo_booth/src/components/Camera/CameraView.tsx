// src/components/Camera/CameraView.tsx
import { useState, forwardRef } from 'react';
import Webcam from 'react-webcam';
import { RotateCcw, AlertCircle } from 'lucide-react';
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
  const [showFlash, setShowFlash] = useState(false);
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
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 600);
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
      <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop p-8 text-center">
        <div className="inline-flex w-16 h-16 bg-coral border-4 border-ink rounded-2xl items-center justify-center mb-4 rotate-[-4deg]">
          <AlertCircle className="w-9 h-9 text-cream" strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-2xl text-ink mb-2">
          Camera Access Required
        </h2>
        <p className="text-charcoal/80 mb-6">
          {cameraError || 'Please allow camera access to use the photo booth.'}
        </p>
        <button
          onClick={() => startCamera()}
          className="bg-ink text-cream font-semibold px-6 py-3 rounded-xl border-2 border-ink hover:bg-coral transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const videoConstraints = getVideoConstraints();

  return (
    <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop overflow-hidden">
      <div className="relative bg-ink">
        <Webcam
          ref={ref}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          mirrored
          className={`w-full h-auto block ${selectedFilter.className}`}
          onUserMediaError={() => {
            handleError(new Error('Camera initialization failed'));
          }}
        />

        {/* Capture flash */}
        {showFlash && (
          <div className="absolute inset-0 bg-cream pointer-events-none animate-flash" />
        )}

        {/* Countdown */}
        {isCountdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/70 backdrop-blur-sm">
            <CountdownTimer
              duration={APP_CONFIG.countdownDuration}
              onComplete={handleCountdownComplete}
            />
          </div>
        )}

        {/* Top overlay: photo counter + camera switch */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
          <div className="bg-cream border-2 border-ink rounded-full px-3 py-1 shadow-pop-sm">
            <span className="font-display text-ink text-sm tracking-wide">
              {capturedCount + 1} / {totalCount}
            </span>
          </div>
          {hasMultipleCameras && (
            <button
              onClick={toggleCamera}
              className="pointer-events-auto bg-cream border-2 border-ink rounded-full p-2 shadow-pop-sm hover:bg-mustard transition-colors"
              title="Switch Camera"
              aria-label="Switch Camera"
            >
              <RotateCcw className="w-4 h-4 text-ink" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Filter badge bottom-left */}
        <div className="absolute bottom-4 left-4 bg-coral border-2 border-ink rounded-full px-3 py-1 shadow-pop-sm">
          <span className="text-cream font-semibold text-xs uppercase tracking-wider">
            {selectedFilter.name}
          </span>
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
