// src/components/Camera/CameraPermissions.tsx
import React from 'react';
import { Aperture, Camera, Lock, Loader2, ShieldCheck, Settings } from 'lucide-react';
import type { CameraPermissionState } from '../../types/camera';

interface CameraPermissionsProps {
  permission: CameraPermissionState;
  onRequest: () => void;
}

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop p-6 sm:p-8">
    {children}
  </div>
);

const BrowserHints: React.FC = () => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isiOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  let hint =
    'Click the camera icon in your browser\'s address bar, then choose "Allow".';

  if (isiOS) {
    hint = 'Open Settings → Safari → Camera and choose "Allow".';
  } else if (isAndroid) {
    hint = 'Tap the lock icon in the address bar → Permissions → Camera → Allow.';
  } else if (isFirefox) {
    hint = 'Click the camera icon to the left of the address bar and clear the blocked permission.';
  } else if (isSafari) {
    hint = 'Open Safari → Settings for This Website → set Camera to "Allow".';
  }

  return (
    <div className="mt-4 bg-cream border-2 border-ink rounded-xl p-3 text-left">
      <div className="flex items-start gap-2 text-sm text-charcoal">
        <Settings className="w-4 h-4 mt-0.5 text-coral shrink-0" strokeWidth={2.5} />
        <span>{hint}</span>
      </div>
    </div>
  );
};

const CameraPermissions: React.FC<CameraPermissionsProps> = ({ permission, onRequest }) => {
  // Brief boot probe — usually <100ms.
  if (permission.state === 'checking') {
    return (
      <Card>
        <div className="text-center">
          <div className="inline-flex w-14 h-14 bg-cream border-4 border-ink rounded-2xl items-center justify-center mb-4">
            <Loader2 className="w-7 h-7 text-ink animate-spin" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl text-ink mb-1">Getting ready…</h2>
          <p className="text-charcoal/70">Checking your camera setup.</p>
        </div>
      </Card>
    );
  }

  if (permission.state === 'unsupported') {
    return (
      <Card>
        <div className="text-center">
          <div className="inline-flex w-14 h-14 bg-coral border-4 border-ink rounded-2xl items-center justify-center mb-4 rotate-[-4deg]">
            <Lock className="w-7 h-7 text-cream" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl text-ink mb-2">Camera Not Supported</h2>
          <p className="text-charcoal/80">
            {permission.error ||
              'This browser doesn\'t support camera access. Try Chrome, Firefox, or Safari.'}
          </p>
        </div>
      </Card>
    );
  }

  if (permission.state === 'requesting') {
    return (
      <Card>
        <div className="text-center">
          <div className="inline-flex w-14 h-14 bg-mustard border-4 border-ink rounded-2xl items-center justify-center mb-4 rotate-[-4deg]">
            <Camera className="w-7 h-7 text-ink animate-pulse" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl text-ink mb-2">Waiting for permission…</h2>
          <p className="text-charcoal/80">
            Look for the prompt at the top of your browser and choose <strong>Allow</strong>.
          </p>
        </div>
      </Card>
    );
  }

  if (permission.state === 'denied') {
    return (
      <Card>
        <div className="text-center">
          <div className="inline-flex w-14 h-14 bg-coral border-4 border-ink rounded-2xl items-center justify-center mb-4 rotate-[-4deg]">
            <Lock className="w-7 h-7 text-cream" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl text-ink mb-2">Camera Blocked</h2>
          <p className="text-charcoal/80 mb-4">
            {permission.error ||
              'We can\'t reach your camera. Once a browser blocks it, you\'ll need to re-allow it manually.'}
          </p>

          <button
            onClick={onRequest}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-ink text-cream font-semibold px-6 py-3 rounded-xl border-2 border-ink shadow-pop-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            <Camera className="w-4 h-4" strokeWidth={2.5} />
            <span>Try Again</span>
          </button>

          <BrowserHints />
        </div>
      </Card>
    );
  }

  // 'prompt' — first visit, or permission was reset. Show welcome gate.
  return (
    <Card>
      <div className="text-center">
        <div className="inline-flex w-16 h-16 bg-coral border-4 border-ink rounded-2xl items-center justify-center mb-5 rotate-[-4deg] shadow-pop-sm">
          <Aperture className="w-9 h-9 text-cream" strokeWidth={2.5} />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-2 leading-none">
          Smile, you’re on
        </h2>
        <p className="text-charcoal/80 max-w-md mx-auto mb-6">
          Photo Booth uses your camera to capture photos. Tap below and your browser will ask for permission.
        </p>

        <button
          onClick={onRequest}
          className="inline-flex items-center justify-center gap-2 bg-coral text-cream font-semibold px-8 py-3.5 rounded-xl border-2 border-ink shadow-pop hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-pop-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          <Camera className="w-5 h-5" strokeWidth={2.5} />
          <span>Start Camera</span>
        </button>

        <div className="mt-6 inline-flex items-center gap-2 text-xs text-charcoal/70 bg-cream border-2 border-ink rounded-full px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 text-ink" strokeWidth={2.5} />
          <span>Photos stay on your device. Nothing is uploaded.</span>
        </div>
      </div>
    </Card>
  );
};

export default CameraPermissions;
