// src/hooks/usePhotoCapture.ts
import { useState, useCallback } from 'react';
import type { Photo, PhotoCaptureState } from '../types/photo';
import type { FilterType } from '../types/filter';
import { APP_CONFIG } from '../constants/config';
import { validateImageDataURL } from '../utils/validationUtils';

export const usePhotoCapture = (maxPhotos: number = APP_CONFIG.maxPhotos) => {
  const [state, setState] = useState<PhotoCaptureState>({
    photos: [],
    currentIndex: 0,
    isCapturing: false,
    maxPhotos
  });

  const addPhoto = useCallback((photoData: string, filter?: FilterType) => {
    if (state.photos.length >= maxPhotos) {
      throw new Error('Maximum number of photos reached');
    }
    
    if (!validateImageDataURL(photoData)) {
      throw new Error('Invalid photo data');
    }

    const photo: Photo = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data: photoData,
      timestamp: Date.now(),
      filter,
      metadata: {
        width: 0,
        height: 0,
        size: photoData.length,
        format: photoData.split(';')[0].split(':')[1] || 'image/jpeg'
      }
    };

    setState(prev => ({
      ...prev,
      photos: [...prev.photos, photo],
      currentIndex: prev.currentIndex + 1
    }));

    return photo;
  }, [maxPhotos, state.photos.length]);

  const removePhoto = useCallback((index: number) => {
    if (index < 0 || index >= state.photos.length) {
      throw new Error('Invalid photo index');
    }
    
    setState(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      currentIndex: Math.max(0, prev.currentIndex - 1)
    }));
  }, [state.photos.length]);

  const clearPhotos = useCallback(() => {
    setState(prev => ({
      ...prev,
      photos: [],
      currentIndex: 0
    }));
  }, []);

  const replacePhoto = useCallback((index: number, photoData: string, filter?: FilterType) => {
    if (index < 0 || index >= state.photos.length) {
      throw new Error('Invalid photo index');
    }
    
    if (!validateImageDataURL(photoData)) {
      throw new Error('Invalid photo data');
    }

    const photo: Photo = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data: photoData,
      timestamp: Date.now(),
      filter,
      metadata: {
        width: 0,
        height: 0,
        size: photoData.length,
        format: photoData.split(';')[0].split(':')[1] || 'image/jpeg'
      }
    };

    setState(prev => ({
      ...prev,
      photos: prev.photos.map((p, i) => i === index ? photo : p)
    }));
  }, [state.photos.length]);

  const setCapturing = useCallback((isCapturing: boolean) => {
    setState(prev => ({ ...prev, isCapturing }));
  }, []);

  const getPhotosByFilter = useCallback((filterId: string) => {
    return state.photos.filter(photo => photo.filter?.id === filterId);
  }, [state.photos]);

  const getPhotoById = useCallback((id: string) => {
    return state.photos.find(photo => photo.id === id);
  }, [state.photos]);

  return {
    ...state,
    addPhoto,
    removePhoto,
    clearPhotos,
    replacePhoto,
    setCapturing,
    getPhotosByFilter,
    getPhotoById,
    isComplete: state.photos.length >= maxPhotos,
    canAddMore: state.photos.length < maxPhotos,
    isEmpty: state.photos.length === 0,
    progress: (state.photos.length / maxPhotos) * 100
  };
};
