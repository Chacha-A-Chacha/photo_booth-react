// src/hooks/useCamera.ts
import { useState, useCallback, useEffect } from 'react';
import type { CameraDevice, VideoConstraints } from '../types/camera';
import { APP_CONFIG } from '../constants/config';

interface CameraDeviceState {
  devices: CameraDevice[];
  currentDeviceId: string | null;
  facingMode: 'user' | 'environment';
}

export const useCamera = () => {
  const [state, setState] = useState<CameraDeviceState>({
    devices: [],
    currentDeviceId: null,
    facingMode: 'user'
  });

  const getDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return [];
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(
        device => device.kind === 'videoinput'
      ) as CameraDevice[];

      setState(prev => ({
        ...prev,
        devices: videoDevices,
        currentDeviceId: prev.currentDeviceId ?? videoDevices[0]?.deviceId ?? null
      }));

      return videoDevices;
    } catch {
      return [];
    }
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
    // Re-enumerate when devices are plugged in/out.
    const onChange = () => { getDevices(); };
    navigator.mediaDevices?.addEventListener?.('devicechange', onChange);
    return () => {
      navigator.mediaDevices?.removeEventListener?.('devicechange', onChange);
    };
  }, [getDevices]);

  return {
    ...state,
    toggleCamera,
    switchDevice,
    getVideoConstraints,
    hasMultipleCameras: state.devices.length > 1
  };
};
