// src/components/UI/Toast.tsx
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 2500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const palette = {
    success: 'bg-mint',
    error: 'bg-coral text-cream',
    info: 'bg-mustard'
  } as const;

  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const Icon = icons[type];

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 ${palette[type]} text-ink border-4 border-ink rounded-2xl shadow-pop pl-3 pr-2 py-2 max-w-sm animate-pop-in`}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" strokeWidth={2.5} />
        <p className="font-semibold text-sm">{message}</p>
        <button
          onClick={onClose}
          className="ml-1 p-1 rounded-full hover:bg-ink/10"
          aria-label="Close"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export { Toast };
