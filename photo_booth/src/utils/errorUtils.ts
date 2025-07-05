// src/utils/errorUtils.ts
import type { AppError, ErrorContext, ErrorMetadata } from '../types/error';
import { createAppError, ERROR_MESSAGES } from '../types/error';

export const handleCameraError = (error: Error): AppError => {
  if (error.name === 'NotAllowedError') {
    return createAppError('CAMERA_PERMISSION_DENIED');
  }
  if (error.name === 'NotFoundError') {
    return createAppError('CAMERA_NOT_FOUND');
  }
  if (error.name === 'NotSupportedError') {
    return createAppError('CAMERA_NOT_SUPPORTED');
  }
  if (error.name === 'NotReadableError') {
    return createAppError('CAMERA_INITIALIZATION_FAILED');
  }
  return createAppError('CAMERA_INITIALIZATION_FAILED', error.message);
};

export const handleCanvasError = (error: Error, operation?: string): AppError => {
  const context: ErrorContext = {
    component: 'Canvas',
    action: operation
  };
  
  if (error.message.includes('context')) {
    return createAppError('CANVAS_CONTEXT_ERROR', error.message, undefined, false, context);
  }
  
  return createAppError('CANVAS_ERROR', error.message, undefined, true, context);
};

export const handleDownloadError = (error: Error): AppError => {
  return createAppError('DOWNLOAD_FAILED', error.message);
};

export const handleStorageError = (error: Error, operation: string, key?: string): AppError => {
  const context: ErrorContext = {
    component: 'Storage',
    action: operation
  };
  
  return createAppError('STORAGE_ERROR', error.message, key, true, context);
};

export const logError = (error: AppError, additionalContext?: Record<string, any>): void => {
  const metadata: ErrorMetadata = {
    errorId: generateErrorId(),
    sessionId: getSessionId(),
    timestamp: error.timestamp,
    userAgent: navigator.userAgent,
    url: window.location.href,
    referrer: document.referrer,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };

  // Add performance data if available
  if ('memory' in performance) {
    metadata.performance = {
      memory: (performance as any).memory?.usedJSHeapSize
    };
  }

  const errorData = {
    ...error,
    metadata,
    additionalContext
  };

  console.error('Application Error:', errorData);
  
  // Send to error reporting service in production
  if (process.env.NODE_ENV === 'production') {
    reportError(errorData);
  }
};

export const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('photo_booth_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('photo_booth_session_id', sessionId);
  }
  return sessionId;
};

export const reportError = (errorData: any): void => {
  // In production, send to error reporting service
  // Example: Sentry, LogRocket, etc.
  if (typeof window !== 'undefined' && 'fetch' in window) {
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorData)
    }).catch(err => {
      console.error('Failed to report error:', err);
    });
  }
};

export const isNetworkError = (error: Error): boolean => {
  return error.message.includes('fetch') || 
         error.message.includes('network') ||
         error.name === 'NetworkError';
};

export const createUserFriendlyMessage = (error: AppError): string => {
  const baseMessage = ERROR_MESSAGES[error.code] || 'An unexpected error occurred';
  
  if (error.code === 'CAMERA_PERMISSION_DENIED') {
    return `${baseMessage} Click the camera icon in your browser's address bar to allow access.`;
  }
  
  if (error.code === 'CAMERA_NOT_FOUND') {
    return `${baseMessage} Make sure your camera is connected and not being used by another application.`;
  }
  
  return baseMessage;
};
