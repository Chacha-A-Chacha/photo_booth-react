// src/components/Camera/CameraError.tsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface CameraErrorProps {
  error: string;
  onRetry: () => void;
  onDismiss?: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ error, onRetry, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-red-800">Camera Error</h4>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={onRetry}
              className="flex items-center text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm text-red-600 hover:text-red-800 px-3 py-1"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraError;
