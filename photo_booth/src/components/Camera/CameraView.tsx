// src/components/Camera/CameraView.tsx
import { useState, useEffect, forwardRef } from 'react';
import Webcam from 'react-webcam';
import { RotateCcw, X, Trash2 } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import CameraControls from './CameraControls';
import CameraPermissions from './CameraPermissions';
import { useCamera } from '../../hooks/useCamera';
import { usePermissions } from '../../hooks/usePermissions';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import type { FilterType } from '../../types/filter';
import type { Photo } from '../../types/photo';
import { APP_CONFIG } from '../../constants/config';
import { applyFilterToDataURL } from '../../utils/canvasUtils';

interface CameraViewProps {
  onCapture: (photoData: string) => void;
  onDeletePhoto: (index: number) => void;
  photos: Photo[];
  selectedFilter: FilterType;
  totalCount: number;
}

type Phase = 'idle' | 'prelude' | 'count';
const PRELUDE_MS = 900;

const CameraView = forwardRef<any, CameraViewProps>(({
  onCapture,
  onDeletePhoto,
  photos,
  selectedFilter,
  totalCount
}, ref) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [showFlash, setShowFlash] = useState(false);

  const { cameraPermission, requestCameraPermission, isGranted } = usePermissions();
  const { toggleCamera, hasMultipleCameras, getVideoConstraints } = useCamera();
  const { handleError } = useErrorHandler();

  const capturedCount = photos.length;
  const isCapturing = phase !== 'idle';

  // Prelude → countdown transition
  useEffect(() => {
    if (phase !== 'prelude') return;
    const t = setTimeout(() => setPhase('count'), PRELUDE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const handleCaptureClick = () => {
    if (isCapturing) return;
    if (!ref || !('current' in ref) || !ref.current) {
      handleError(new Error('Camera not available'));
      return;
    }
    if (capturedCount >= totalCount) return;
    setPhase('prelude');
  };

  const handleCancel = () => {
    setPhase('idle');
  };

  const handleCountdownComplete = async () => {
    setPhase('idle');
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
  const upcomingShot = Math.min(capturedCount + 1, totalCount);

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

        {/* Prelude — "get ready" beat before countdown */}
        {phase === 'prelude' && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
            <div className="text-center animate-pop-in">
              <div className="font-display text-3xl sm:text-5xl text-mustard mb-2 leading-none">
                Get Ready!
              </div>
              <div className="font-display text-cream text-base sm:text-lg tracking-wide">
                Photo {upcomingShot} of {totalCount}
              </div>
            </div>
          </div>
        )}

        {/* Countdown */}
        {phase === 'count' && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/70 backdrop-blur-sm">
            <CountdownTimer
              duration={APP_CONFIG.countdownDuration}
              onComplete={handleCountdownComplete}
            />
          </div>
        )}

        {/* Cancel pill */}
        {isCapturing && (
          <button
            onClick={handleCancel}
            aria-label="Cancel capture"
            className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 bg-cream border-2 border-ink rounded-full pl-2.5 pr-3 py-1 shadow-pop-sm hover:bg-coral hover:text-cream transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-wider">Cancel</span>
          </button>
        )}

        {/* Top-left: photo counter */}
        <div className="absolute top-4 left-4 bg-cream border-2 border-ink rounded-full px-3 py-1 shadow-pop-sm pointer-events-none">
          <span className="font-display text-ink text-sm tracking-wide">
            {upcomingShot} / {totalCount}
          </span>
        </div>

        {/* Camera switch (when not capturing) */}
        {hasMultipleCameras && !isCapturing && (
          <button
            onClick={toggleCamera}
            className="absolute top-14 right-4 bg-cream border-2 border-ink rounded-full p-2 shadow-pop-sm hover:bg-mustard transition-colors"
            title="Switch Camera"
            aria-label="Switch Camera"
          >
            <RotateCcw className="w-4 h-4 text-ink" strokeWidth={2.5} />
          </button>
        )}

        {/* Filter badge bottom-left */}
        <div className="absolute bottom-4 left-4 bg-coral border-2 border-ink rounded-full px-3 py-1 shadow-pop-sm pointer-events-none">
          <span className="text-cream font-semibold text-xs uppercase tracking-wider">
            {selectedFilter.name}
          </span>
        </div>
      </div>

      <CameraControls
        onCapture={handleCaptureClick}
        onToggleCamera={toggleCamera}
        disabled={isCapturing}
        hasMultipleCameras={hasMultipleCameras}
      />

      {/* Live thumbnail strip */}
      <div className="px-4 sm:px-6 pb-4 pt-1 bg-paper border-t-2 border-ink/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
            Your shots
          </span>
          {capturedCount > 0 && (
            <span className="text-[11px] font-semibold text-charcoal/60">
              Tap × to retake
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {Array.from({ length: totalCount }).map((_, i) => {
            const photo = photos[i];
            const isCurrent = i === capturedCount && phase === 'idle';
            if (photo) {
              const tilt = i % 2 === 0 ? 'tilt-l' : 'tilt-r';
              return (
                <div key={photo.id} className={`relative group ${tilt}`}>
                  <div className="bg-cream border-2 border-ink rounded-md p-1 shadow-pop-sm">
                    <img
                      src={photo.data}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-12 sm:h-14 object-cover rounded-sm"
                    />
                  </div>
                  <button
                    onClick={() => onDeletePhoto(i)}
                    aria-label={`Delete photo ${i + 1}`}
                    className="absolute -top-1.5 -right-1.5 p-0.5 bg-coral text-cream border-2 border-ink rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    title="Delete this photo"
                  >
                    <Trash2 className="w-3 h-3" strokeWidth={2.5} />
                  </button>
                </div>
              );
            }
            return (
              <div
                key={`slot-${i}`}
                className={`flex items-center justify-center h-12 sm:h-14 rounded-md border-2 border-dashed ${
                  isCurrent ? 'border-coral bg-coral/10 animate-pulse' : 'border-ink/30'
                }`}
              >
                <span
                  className={`font-display text-base ${
                    isCurrent ? 'text-coral' : 'text-ink/40'
                  }`}
                >
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

CameraView.displayName = 'CameraView';

export default CameraView;
