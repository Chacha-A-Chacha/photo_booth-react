// src/types/camera.ts
export interface CameraDevice {
  deviceId: string;
  label: string;
  kind: 'videoinput';
  groupId: string;
}

export interface VideoConstraints {
  width: { ideal: number };
  height: { ideal: number };
  facingMode: 'user' | 'environment';
  deviceId?: { exact: string };
}

export interface CameraState {
  isActive: boolean;
  hasPermission: boolean | null;
  error: string | null;
  devices: CameraDevice[];
  currentDeviceId: string | null;
  facingMode: 'user' | 'environment';
}

export interface CameraPermissionState {
  state: 'checking' | 'granted' | 'denied' | 'requesting';
  error: string | null;
}
