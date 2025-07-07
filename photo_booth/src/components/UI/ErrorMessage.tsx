// src/components/UI/ErrorMessage.tsx
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss, 
  variant = 'error' 
}) => {
  const colors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[variant]}`}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export  { ErrorMessage };