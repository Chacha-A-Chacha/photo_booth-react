// src/hooks/usePermissions.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import type { CameraPermissionState } from '../types/camera';
import { handleCameraError } from '../utils/errorUtils';

const isMediaDevicesSupported = () =>
  typeof navigator !== 'undefined' &&
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function';

export const usePermissions = () => {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionState>({
    state: 'checking',
    error: null
  });

  const statusRef = useRef<PermissionStatus | null>(null);

  const requestCameraPermission = useCallback(async () => {
    if (!isMediaDevicesSupported()) {
      setCameraPermission({
        state: 'unsupported',
        error: 'Camera is not supported in this browser.'
      });
      return false;
    }

    setCameraPermission({ state: 'requesting', error: null });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission({ state: 'granted', error: null });
      return true;
    } catch (error) {
      const appError = handleCameraError(error as Error);
      setCameraPermission({
        state: 'denied',
        error: appError.message
      });
      return false;
    }
  }, []);

  // Initial probe: check permission state without triggering a prompt.
  useEffect(() => {
    let cancelled = false;

    const probe = async () => {
      if (!isMediaDevicesSupported()) {
        if (!cancelled) {
          setCameraPermission({
            state: 'unsupported',
            error: 'Camera is not supported in this browser.'
          });
        }
        return;
      }

      // Permissions API available?
      if (typeof navigator.permissions?.query === 'function') {
        try {
          const status = await navigator.permissions.query({
            name: 'camera' as PermissionName
          });
          if (cancelled) return;

          statusRef.current = status;

          const apply = (s: PermissionState) => {
            if (s === 'granted') {
              setCameraPermission({ state: 'granted', error: null });
            } else if (s === 'denied') {
              setCameraPermission({
                state: 'denied',
                error: 'Camera access was denied.'
              });
            } else {
              setCameraPermission({ state: 'prompt', error: null });
            }
          };

          apply(status.state);
          status.onchange = () => apply(status.state);
          return;
        } catch {
          // Browser supports permissions.query but not 'camera' (older Firefox/Safari).
          // Fall through to the safe default.
        }
      }

      // Fallback: do NOT auto-trigger getUserMedia. Wait for user click.
      if (!cancelled) {
        setCameraPermission({ state: 'prompt', error: null });
      }
    };

    probe();
    return () => {
      cancelled = true;
      if (statusRef.current) {
        statusRef.current.onchange = null;
      }
    };
  }, []);

  return {
    cameraPermission,
    requestCameraPermission,
    isGranted: cameraPermission.state === 'granted',
    isDenied: cameraPermission.state === 'denied',
    isPrompt: cameraPermission.state === 'prompt',
    isRequesting: cameraPermission.state === 'requesting',
    isUnsupported: cameraPermission.state === 'unsupported'
  };
};
