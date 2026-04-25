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
