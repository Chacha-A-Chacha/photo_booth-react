// src/components/Layout/FrameOverlay.tsx
import React from 'react';
import type { FrameConfig } from '../../types/layout';

interface FrameOverlayProps {
  frame: FrameConfig;
  width: number;
  height: number;
}

const FrameOverlay: React.FC<FrameOverlayProps> = ({ frame, width, height }) => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        border: `${frame.width}px ${frame.style} ${frame.color}`,
        borderRadius: frame.cornerRadius || 0
      }}
    />
  );
};

export { FrameOverlay };
