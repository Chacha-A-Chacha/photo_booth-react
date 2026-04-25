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

export type CameraPermissionStatus =
  | 'checking'
  | 'prompt'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unsupported';

export interface CameraPermissionState {
  state: CameraPermissionStatus;
  error: string | null;
}
