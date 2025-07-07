// src/App.tsx
import React, { useState, useRef } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import ErrorBoundary from './components/UI/ErrorBoundary';
import CameraView from './components/Camera/CameraView';
import PhotoPreview from './components/PhotoCapture/PhotoPreview';
import FilterPanel from './components/Filters/FilterPanel';
import LayoutSelector from './components/Layout/LayoutSelector';
import DownloadButton from './components/Export/DownloadButton';
import SharePanel from './components/Export/SharePanel';
import LoadingState from './components/UI/LoadingState';
import { usePhotoCapture } from './hooks/usePhotoCapture';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCanvas } from './hooks/useCanvas';
import { useErrorHandler } from './hooks/useErrorHandler';
import { LAYOUTS, FILTERS, DEFAULT_LAYOUT, DEFAULT_FILTER, STORAGE_KEYS } from './constants';

function App() {
  const [currentStep, setCurrentStep] = useState<'camera' | 'preview'>('camera');
  const [selectedLayout, setSelectedLayout] = useLocalStorage(STORAGE_KEYS.SELECTED_LAYOUT, DEFAULT_LAYOUT);
  const [selectedFilter, setSelectedFilter] = useLocalStorage(STORAGE_KEYS.SELECTED_FILTER, DEFAULT_FILTER);
  
  const { photos, addPhoto, clearPhotos, canAddMore, isComplete } = usePhotoCapture(selectedLayout.photoCount);
  const { canvasRef, initializeCanvas, downloadImage, isProcessing } = useCanvas();
  const { error, isLoading, executeWithErrorHandling } = useErrorHandler();
  
  const webcamRef = useRef<any>(null);

  React.useEffect(() => {
    if (currentStep === 'preview') {
      initializeCanvas(selectedLayout.width, selectedLayout.height);
    }
  }, [currentStep, selectedLayout, initializeCanvas]);

  const handlePhotoCapture = async (photoData: string) => {
    await executeWithErrorHandling(async () => {
      addPhoto(photoData, selectedFilter);
      if (!canAddMore) {
        setCurrentStep('preview');
      }
    });
  };

  const handleRetake = () => {
    clearPhotos();
    setCurrentStep('camera');
  };

  const handleDownload = async () => {
    await executeWithErrorHandling(async () => {
      downloadImage(`photo-booth-${Date.now()}.png`);
    });
  };

  const handleLayoutChange = (layout: typeof selectedLayout) => {
    if (photos.length === 0) {
      setSelectedLayout(layout);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">Error: {error.message}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-8 p-6 bg-white rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3">
              <Camera className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-800">Photo Booth</h1>
            </div>
            <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-purple-700 font-medium">
                {photos.length}/{selectedLayout.photoCount}
              </span>
            </div>
          </header>

          {/* Loading State */}
          {(isLoading || isProcessing) && (
            <LoadingState 
              message={isProcessing ? "Processing photos..." : "Loading..."} 
            />
          )}

          {/* Main Content */}
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Camera/Preview Area */}
            <div className="lg:col-span-2">
              {currentStep === 'camera' && (
                <CameraView
                  ref={webcamRef}
                  onCapture={handlePhotoCapture}
                  selectedFilter={selectedFilter}
                  capturedCount={photos.length}
                  totalCount={selectedLayout.photoCount}
                />
              )}

              {currentStep === 'preview' && (
                <PhotoPreview
                  photos={photos}
                  layout={selectedLayout}
                  filter={selectedFilter}
                  canvasRef={canvasRef}
                />
              )}
            </div>

            {/* Controls Panel */}
            <aside className="space-y-6">
              <FilterPanel
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                disabled={currentStep === 'preview'}
              />
              
              <LayoutSelector
                selectedLayout={selectedLayout}
                onLayoutChange={handleLayoutChange}
                disabled={photos.length > 0}
              />

              {currentStep === 'preview' && (
                <>
                  <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={handleRetake}
                        className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Retake Photos</span>
                      </button>
                      <DownloadButton 
                        onClick={handleDownload}
                        disabled={isLoading || isProcessing}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>

                  <SharePanel 
                    canvasRef={canvasRef}
                    filename={`photo-booth-${Date.now()}.png`}
                  />
                </>
              )}
            </aside>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
