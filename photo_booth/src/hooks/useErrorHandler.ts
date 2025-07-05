// src/hooks/useErrorHandler.ts
import { useState, useCallback } from 'react';
import type { AppError } from '../types/error';
import { logError, createUserFriendlyMessage } from '../utils/errorUtils';

export const useErrorHandler = () => {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: Error | AppError, context?: Record<string, any>) => {
    let appError: AppError;

    if ('code' in error) {
      appError = error as AppError;
    } else {
      appError = {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        timestamp: Date.now(),
        recoverable: true
      };
    }

    setError(appError);
    logError(appError, context);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      return result;
    } catch (error) {
      handleError(error as Error, context);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getUserFriendlyMessage = useCallback(() => {
    return error ? createUserFriendlyMessage(error) : null;
  }, [error]);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
    getUserFriendlyMessage,
    hasError: !!error
  };
};
