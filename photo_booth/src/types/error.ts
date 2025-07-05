import React from 'react';

// Error codes for different types of application errors
export type ErrorCode = 
  | 'CAMERA_NOT_SUPPORTED'
  | 'CAMERA_PERMISSION_DENIED'
  | 'CAMERA_NOT_FOUND'
  | 'CAMERA_INITIALIZATION_FAILED'
  | 'PHOTO_CAPTURE_FAILED'
  | 'CANVAS_ERROR'
  | 'CANVAS_CONTEXT_ERROR'
  | 'DOWNLOAD_FAILED'
  | 'STORAGE_ERROR'
  | 'FILTER_APPLICATION_ERROR'
  | 'LAYOUT_COMPOSITION_ERROR'
  | 'IMAGE_PROCESSING_ERROR'
  | 'PERMISSION_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

// Main application error interface
export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  timestamp: number;
  recoverable: boolean;
  context?: ErrorContext;
}

// Additional context for errors
export interface ErrorContext {
  component?: string;
  action?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  deviceInfo?: DeviceInfo;
}

// Device information for error reporting
export interface DeviceInfo {
  platform: string;
  userAgent: string;
  screenResolution: string;
  hasCamera: boolean;
  supportedFormats: string[];
}

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Error handler configuration
export interface ErrorHandlerOptions {
  shouldReportError?: boolean;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  enableConsoleLogging?: boolean;
}

// Camera specific errors
export interface CameraError extends AppError {
  code: 'CAMERA_NOT_SUPPORTED' | 'CAMERA_PERMISSION_DENIED' | 'CAMERA_NOT_FOUND' | 'CAMERA_INITIALIZATION_FAILED';
  deviceId?: string;
  constraints?: MediaStreamConstraints;
}

// Canvas specific errors
export interface CanvasError extends AppError {
  code: 'CANVAS_ERROR' | 'CANVAS_CONTEXT_ERROR' | 'IMAGE_PROCESSING_ERROR';
  canvasWidth?: number;
  canvasHeight?: number;
  operation?: string;
}

// Permission specific errors
export interface PermissionError extends AppError {
  code: 'PERMISSION_ERROR' | 'CAMERA_PERMISSION_DENIED';
  permission: 'camera' | 'microphone' | 'storage';
  state: 'denied' | 'prompt' | 'granted';
}

// Storage specific errors
export interface StorageError extends AppError {
  code: 'STORAGE_ERROR';
  storageType: 'localStorage' | 'sessionStorage' | 'indexedDB';
  operation: 'read' | 'write' | 'delete' | 'clear';
  key?: string;
}

// Network specific errors
export interface NetworkError extends AppError {
  code: 'NETWORK_ERROR';
  status?: number;
  endpoint?: string;
  method?: string;
}

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Enhanced error with severity
export interface EnhancedError extends AppError {
  severity: ErrorSeverity;
  userImpact: string;
  suggestedAction: string;
  reportToService: boolean;
}

// Error reporting payload
export interface ErrorReportPayload {
  error: AppError;
  userAgent: string;
  timestamp: number;
  url: string;
  userId?: string;
  sessionId?: string;
  additionalContext?: Record<string, unknown>;
}

// Error boundary fallback props
export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  hasRetried?: boolean;
  maxRetries?: number;
}

// Error toast/notification interface
export interface ErrorNotification {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  actions?: ErrorAction[];
}

// Error action interface
export interface ErrorAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'destructive';
}

// Error metadata for analytics
export interface ErrorMetadata {
  errorId: string;
  sessionId: string;
  userId?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  referrer: string;
  viewport: {
    width: number;
    height: number;
  };
  performance?: {
    memory?: number;
    navigation?: PerformanceNavigationTiming;
  };
}

// Predefined error messages
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  CAMERA_NOT_SUPPORTED: 'Camera not supported in this browser',
  CAMERA_PERMISSION_DENIED: 'Camera access denied. Please allow camera permissions.',
  CAMERA_NOT_FOUND: 'No camera found. Please connect a camera and try again.',
  CAMERA_INITIALIZATION_FAILED: 'Failed to initialize camera. Please try again.',
  PHOTO_CAPTURE_FAILED: 'Failed to capture photo. Please try again.',
  CANVAS_ERROR: 'Canvas operation failed. Please try again.',
  CANVAS_CONTEXT_ERROR: 'Cannot get canvas context. Please refresh the page.',
  DOWNLOAD_FAILED: 'Failed to download image. Please try again.',
  STORAGE_ERROR: 'Storage operation failed. Please check your browser settings.',
  FILTER_APPLICATION_ERROR: 'Failed to apply filter. Please try a different filter.',
  LAYOUT_COMPOSITION_ERROR: 'Failed to compose photo layout. Please try again.',
  IMAGE_PROCESSING_ERROR: 'Failed to process image. Please try again.',
  PERMISSION_ERROR: 'Permission denied. Please allow required permissions.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// Error recovery strategies
export const ERROR_RECOVERY_STRATEGIES: Record<ErrorCode, string[]> = {
  CAMERA_NOT_SUPPORTED: ['Use a modern browser', 'Update your browser'],
  CAMERA_PERMISSION_DENIED: ['Allow camera access', 'Refresh the page', 'Check browser settings'],
  CAMERA_NOT_FOUND: ['Connect a camera', 'Check camera drivers', 'Try a different device'],
  CAMERA_INITIALIZATION_FAILED: ['Refresh the page', 'Close other camera apps', 'Restart browser'],
  PHOTO_CAPTURE_FAILED: ['Try again', 'Check camera connection', 'Refresh the page'],
  CANVAS_ERROR: ['Refresh the page', 'Try a different browser', 'Clear browser cache'],
  CANVAS_CONTEXT_ERROR: ['Refresh the page', 'Enable hardware acceleration'],
  DOWNLOAD_FAILED: ['Try again', 'Check download permissions', 'Try a different browser'],
  STORAGE_ERROR: ['Clear browser data', 'Check storage permissions', 'Try incognito mode'],
  FILTER_APPLICATION_ERROR: ['Try a different filter', 'Refresh the page'],
  LAYOUT_COMPOSITION_ERROR: ['Try a different layout', 'Refresh the page'],
  IMAGE_PROCESSING_ERROR: ['Try again', 'Use a smaller image', 'Refresh the page'],
  PERMISSION_ERROR: ['Allow permissions', 'Check browser settings', 'Refresh the page'],
  NETWORK_ERROR: ['Check internet connection', 'Try again later', 'Refresh the page'],
  UNKNOWN_ERROR: ['Refresh the page', 'Try a different browser', 'Contact support']
};

// Helper function to create standardized errors
export const createAppError = (
  code: ErrorCode,
  message?: string,
  details?: string,
  recoverable: boolean = true,
  context?: ErrorContext
): AppError => ({
  code,
  message: message || ERROR_MESSAGES[code],
  details,
  timestamp: Date.now(),
  recoverable,
  context
});

// Helper function to determine if error is recoverable
export const isRecoverableError = (error: Error | AppError): boolean => {
  if ('recoverable' in error) {
    return error.recoverable;
  }
  
  const recoverableKeywords = ['canvas', 'download', 'filter', 'layout', 'processing'];
  return recoverableKeywords.some(keyword => 
    error.message.toLowerCase().includes(keyword)
  );
};

// Helper function to get error severity
export const getErrorSeverity = (code: ErrorCode): ErrorSeverity => {
  const severityMap: Record<ErrorCode, ErrorSeverity> = {
    CAMERA_NOT_SUPPORTED: 'high',
    CAMERA_PERMISSION_DENIED: 'high',
    CAMERA_NOT_FOUND: 'high',
    CAMERA_INITIALIZATION_FAILED: 'medium',
    PHOTO_CAPTURE_FAILED: 'medium',
    CANVAS_ERROR: 'medium',
    CANVAS_CONTEXT_ERROR: 'high',
    DOWNLOAD_FAILED: 'low',
    STORAGE_ERROR: 'low',
    FILTER_APPLICATION_ERROR: 'low',
    LAYOUT_COMPOSITION_ERROR: 'medium',
    IMAGE_PROCESSING_ERROR: 'medium',
    PERMISSION_ERROR: 'high',
    NETWORK_ERROR: 'medium',
    UNKNOWN_ERROR: 'high'
  };
  
  return severityMap[code] || 'medium';
};
