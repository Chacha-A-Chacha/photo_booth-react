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

  const getCountdownStyle = () => {
    const percentage = (count / duration) * 100;
    const scale = 1 + (duration - count) * 0.2;
    return {
      transform: `scale(${scale})`,
      opacity: percentage / 100,
      color: count <= 1 ? '#ef4444' : '#ffffff'
    };
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className="text-8xl md:text-9xl font-bold animate-pulse transition-all duration-300"
        style={getCountdownStyle()}
      >
        {count}
      </div>
    </div>
  );
};

export default CountdownTimer;
