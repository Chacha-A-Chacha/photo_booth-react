// src/App.tsx
import React, { useState, useRef } from 'react';
import { Aperture, RotateCcw, Sparkles } from 'lucide-react';
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
import { DEFAULT_LAYOUT, DEFAULT_FILTER, STORAGE_KEYS } from './constants';

function App() {
  const [currentStep, setCurrentStep] = useState<'camera' | 'preview'>('camera');
  const [selectedLayout, setSelectedLayout] = useLocalStorage(STORAGE_KEYS.SELECTED_LAYOUT, DEFAULT_LAYOUT);
  const [selectedFilter, setSelectedFilter] = useLocalStorage(STORAGE_KEYS.SELECTED_FILTER, DEFAULT_FILTER);

  const { photos, addPhoto, clearPhotos, canAddMore } = usePhotoCapture(selectedLayout.photoCount);
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop p-8 max-w-md text-center">
          <div className="text-coral font-display text-2xl mb-2">Oops!</div>
          <div className="text-ink mb-6">{error.message}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-ink text-cream font-semibold px-6 py-3 rounded-xl border-2 border-ink hover:bg-coral hover:border-ink transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const progress = (photos.length / selectedLayout.photoCount) * 100;

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-6 sm:mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-coral border-4 border-ink rounded-2xl flex items-center justify-center shadow-pop-sm rotate-[-4deg]">
                <Aperture className="w-7 h-7 sm:w-8 sm:h-8 text-cream" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-5xl text-ink leading-none tracking-tight">
                  Photo<span className="text-coral">Booth</span>
                </h1>
                <p className="text-charcoal/70 text-xs sm:text-sm font-medium mt-1 hidden sm:block">
                  Strike a pose. Print the memories.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-mustard border-2 border-ink px-3 py-1.5 rounded-full shadow-pop-sm">
                <Sparkles className="w-4 h-4 text-ink" strokeWidth={2.5} />
                <span className="text-ink font-semibold text-sm capitalize">
                  {selectedFilter.name}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 bg-ink text-cream px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-coral rounded-full animate-pulse"></div>
                  <span className="font-semibold text-sm tabular-nums">
                    {photos.length}/{selectedLayout.photoCount}
                  </span>
                </div>
                <div className="w-24 h-1.5 bg-ink/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coral transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Loading State */}
          {(isLoading || isProcessing) && (
            <LoadingState
              message={isProcessing ? "Processing photos..." : "Loading..."}
            />
          )}

          {/* Main Content */}
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
                  <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop p-5 space-y-3">
                    <h3 className="font-display text-xl text-ink">Actions</h3>
                    <button
                      onClick={handleRetake}
                      className="w-full flex items-center justify-center gap-2 bg-cream hover:bg-mustard border-2 border-ink text-ink font-semibold px-4 py-3 rounded-xl shadow-pop-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                    >
                      <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
                      <span>Retake Photos</span>
                    </button>
                    <DownloadButton
                      onClick={handleDownload}
                      disabled={isLoading || isProcessing}
                      isLoading={isLoading}
                    />
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
