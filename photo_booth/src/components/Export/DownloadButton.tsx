// src/components/Export/DownloadButton.tsx
import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-cream font-semibold px-6 py-3 rounded-xl border-2 border-ink shadow-pop-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-pop-sm transition-all"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" strokeWidth={2.5} />
          <span>Download Photo</span>
        </>
      )}
    </button>
  );
};

export default DownloadButton;
