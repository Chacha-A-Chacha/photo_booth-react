// src/components/Camera/CountdownTimer.tsx
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  duration?: number;
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration = 3,
  onComplete
}) => {
  const [count, setCount] = useState(duration);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  const isFinal = count <= 1;

  return (
    <div className="flex items-center justify-center">
      <div
        key={count}
        className={`
          font-display text-[10rem] sm:text-[14rem] leading-none
          ${isFinal ? 'text-coral' : 'text-cream'}
          drop-shadow-[6px_6px_0_rgba(26,26,46,0.9)]
          animate-pop-in
        `}
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        {count > 0 ? count : '✨'}
      </div>
    </div>
  );
};

export default CountdownTimer;
