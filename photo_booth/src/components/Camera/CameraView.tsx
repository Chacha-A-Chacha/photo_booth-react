// src/components/Camera/CameraView.tsx
import { useState, forwardRef } from 'react';
import Webcam from 'react-webcam';
import { RotateCcw } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import CameraControls from './CameraControls';
import CameraPermissions from './CameraPermissions';
import { useCamera } from '../../hooks/useCamera';
import { usePermissions } from '../../hooks/usePermissions';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import type { FilterType } from '../../types/filter';
import { APP_CONFIG } from '../../constants/config';
import { applyFilterToDataURL } from '../../utils/canvasUtils';

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

  const { cameraPermission, requestCameraPermission, isGranted } = usePermissions();
  const { toggleCamera, hasMultipleCameras, getVideoConstraints } = useCamera();
  const { handleError } = useErrorHandler();

  const handleCaptureClick = () => {
    if (!ref || !('current' in ref) || !ref.current) {
      handleError(new Error('Camera not available'));
      return;
    }
    setIsCountdown(true);
  };

  const handleCountdownComplete = async () => {
    setIsCountdown(false);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 600);
    try {
      if (!ref || !('current' in ref) || !ref.current) {
        throw new Error('Camera not available');
      }

      const rawSrc = ref.current.getScreenshot();
      if (!rawSrc) {
        throw new Error('Failed to capture image');
      }
      const filteredSrc = await applyFilterToDataURL(rawSrc, selectedFilter);
      onCapture(filteredSrc);
    } catch (err) {
      handleError(err as Error);
    }
  };

  if (!isGranted) {
    return (
      <CameraPermissions
        permission={cameraPermission}
        onRequest={requestCameraPermission}
      />
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
