// src/hooks/useCamera.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import type { CameraDevice, CameraState, VideoConstraints } from '../types/camera';
import { APP_CONFIG } from '../constants/config';
import { handleCameraError } from '../utils/errorUtils';

export const useCamera = () => {
  const [state, setState] = useState<CameraState>({
    isActive: false,
    hasPermission: null,
    error: null,
    devices: [],
    currentDeviceId: null,
    facingMode: 'user'
  });
  
  const webcamRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getDevices = useCallback(async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(device => device.kind === 'videoinput') as CameraDevice[];
      
      setState(prev => ({ 
        ...prev, 
        devices: videoDevices,
        currentDeviceId: videoDevices[0]?.deviceId || null
      }));
      
      return videoDevices;
    } catch (error) {
      const appError = handleCameraError(error as Error);
      setState(prev => ({ ...prev, error: appError.message }));
      throw appError;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: APP_CONFIG.camera.defaultWidth },
          height: { ideal: APP_CONFIG.camera.defaultHeight },
          facingMode: state.facingMode,
          deviceId: state.currentDeviceId ? { exact: state.currentDeviceId } : undefined
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      setState(prev => ({ 
        ...prev, 
        isActive: true, 
        hasPermission: true 
      }));
      
      await getDevices();
      return stream;
    } catch (error) {
      const appError = handleCameraError(error as Error);
      setState(prev => ({ 
        ...prev, 
        isActive: false, 
        hasPermission: false,
        error: appError.message 
      }));
      throw appError;
    }
  }, [state.facingMode, state.currentDeviceId, getDevices]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setState(prev => ({ ...prev, isActive: false }));
  }, []);

  const toggleCamera = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      facingMode: prev.facingMode === 'user' ? 'environment' : 'user' 
    }));
  }, []);

  const switchDevice = useCallback((deviceId: string) => {
    setState(prev => ({ ...prev, currentDeviceId: deviceId }));
  }, []);

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) {
      throw new Error('Camera not available');
    }
    
    try {
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        throw new Error('Failed to capture photo');
      }
      return screenshot;
    } catch (error) {
      const appError = handleCameraError(error as Error);
      setState(prev => ({ ...prev, error: appError.message }));
      throw appError;
    }
  }, []);

  const checkPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setState(prev => ({ ...prev, hasPermission: true }));
      return true;
    } catch (error) {
      const appError = handleCameraError(error as Error);
      setState(prev => ({ 
        ...prev, 
        hasPermission: false,
        error: appError.message 
      }));
      return false;
    }
  }, []);

  const getVideoConstraints = useCallback((): VideoConstraints => {
    return {
      width: { ideal: APP_CONFIG.camera.defaultWidth },
      height: { ideal: APP_CONFIG.camera.defaultHeight },
      facingMode: state.facingMode,
      deviceId: state.currentDeviceId ? { exact: state.currentDeviceId } : undefined
    };
  }, [state.facingMode, state.currentDeviceId]);

  useEffect(() => {
    getDevices();
    return () => stopCamera();
  }, [getDevices, stopCamera]);

  return {
    ...state,
    webcamRef,
    startCamera,
    stopCamera,
    toggleCamera,
    switchDevice,
    capturePhoto,
    checkPermissions,
    getVideoConstraints,
    hasMultipleCameras: state.devices.length > 1
  };
};
