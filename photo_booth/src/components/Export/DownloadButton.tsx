// src/components/Export/DownloadButton.tsx
import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  filename?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  onClick, 
  disabled = false, 
  isLoading = false,
  filename = 'photo-booth.png'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors font-medium"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download Photo</span>
        </>
      )}
    </button>
  );
};

export default DownloadButton;
