// src/components/Export/SharePanel.tsx
import React from 'react';
import { Share2, Copy } from 'lucide-react';
import { shareCanvas, copyCanvasToClipboard } from '../../utils/downloadUtils';

interface SharePanelProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  filename?: string;
}

const SharePanel: React.FC<SharePanelProps> = ({ canvasRef, filename = 'photo-booth.png' }) => {
  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      await shareCanvas(canvasRef.current, filename);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      await copyCanvasToClipboard(canvasRef.current);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const canShare = 'share' in navigator;
  const canCopy = 'clipboard' in navigator;
  if (!canShare && !canCopy) return null;

  return (
    <div className="bg-paper border-4 border-ink rounded-3xl shadow-pop p-5 space-y-3">
      <h3 className="font-display text-xl text-ink">Share It</h3>
      {canShare && (
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-lilac hover:bg-mustard text-ink font-semibold px-4 py-3 rounded-xl border-2 border-ink shadow-pop-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          <Share2 className="w-4 h-4" strokeWidth={2.5} />
          <span>Share</span>
        </button>
      )}
      {canCopy && (
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-cream hover:bg-mustard text-ink font-semibold px-4 py-3 rounded-xl border-2 border-ink shadow-pop-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          <Copy className="w-4 h-4" strokeWidth={2.5} />
          <span>Copy to Clipboard</span>
        </button>
      )}
    </div>
  );
};

export default SharePanel;
