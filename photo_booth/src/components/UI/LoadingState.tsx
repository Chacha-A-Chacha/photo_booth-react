// src/components/UI/LoadingState.tsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Processing...',
  submessage
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {message}
        </h3>
        {submessage && (
          <p className="text-gray-600 text-sm">
            {submessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
