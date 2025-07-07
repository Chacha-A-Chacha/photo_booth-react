// src/components/Export/SharePanel.tsx
import React from 'react';
import { Share2, Copy, Download } from 'lucide-react';
import { useCanvas } from '../../hooks/useCanvas';
import { shareCanvas, copyCanvasToClipboard } from '../../utils/downloadUtils';

interface SharePanelProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  filename?: string;
}

const SharePanel: React.FC<SharePanelProps> = ({ canvasRef, filename = 'photo-booth.png' }) => {
  const { downloadImage } = useCanvas();

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

  const handleDownload = () => {
    downloadImage(filename);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Share & Export</h3>
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        
        {navigator.share && (
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        )}
        
        {navigator.clipboard && (
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy to Clipboard</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SharePanel;
