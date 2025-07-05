// src/hooks/usePermissions.ts
import { useState, useCallback, useEffect } from 'react';
import type { CameraPermissionState } from '../types/camera';
import { handleCameraError } from '../utils/errorUtils';

export const usePermissions = () => {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionState>({
    state: 'checking',
    error: null
  });

  const checkCameraPermission = useCallback(async () => {
    setCameraPermission({ state: 'checking', error: null });

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

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

  const requestCameraPermission = useCallback(async () => {
    setCameraPermission({ state: 'requesting', error: null });
    return await checkCameraPermission();
  }, [checkCameraPermission]);

  const checkPermissionStatus = useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      switch (permission.state) {
        case 'granted':
          setCameraPermission({ state: 'granted', error: null });
          return true;
        case 'denied':
          setCameraPermission({ state: 'denied', error: 'Camera permission denied' });
          return false;
        case 'prompt':
          setCameraPermission({ state: 'checking', error: null });
          return null;
        default:
          return null;
      }
    } catch (error) {
      // Fallback to getUserMedia check
      return await checkCameraPermission();
    }
  }, [checkCameraPermission]);

  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  return {
    cameraPermission,
    checkCameraPermission,
    requestCameraPermission,
    checkPermissionStatus,
    hasCamera: cameraPermission.state === 'granted',
    needsPermission: cameraPermission.state === 'denied' || cameraPermission.state === 'checking'
  };
};
