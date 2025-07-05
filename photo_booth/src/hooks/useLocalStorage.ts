// src/hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';
import { handleStorageError } from '../utils/errorUtils';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      const appError = handleStorageError(error as Error, 'read', key);
      console.error(appError.message);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      const appError = handleStorageError(error as Error, 'write', key);
      console.error(appError.message);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      const appError = handleStorageError(error as Error, 'delete', key);
      console.error(appError.message);
    }
  }, [key, initialValue]);

  const clearStorage = useCallback(() => {
    try {
      window.localStorage.clear();
      setStoredValue(initialValue);
    } catch (error) {
      const appError = handleStorageError(error as Error, 'clear');
      console.error(appError.message);
    }
  }, [initialValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          const appError = handleStorageError(error as Error, 'read', key);
          console.error(appError.message);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue, clearStorage] as const;
};
