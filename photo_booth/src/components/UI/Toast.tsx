// src/components/UI/Toast.tsx
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${styles[type]} max-w-sm`}>
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3" />
        <p className="flex-1 text-sm">{message}</p>
        <button onClick={onClose} className="ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export { Toast };
