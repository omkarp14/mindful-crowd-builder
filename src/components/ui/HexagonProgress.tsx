import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';

interface HexagonProgressProps {
  progress: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const sizeMap = {
  sm: { size: 100, stroke: 4 },
  md: { size: 150, stroke: 6 },
  lg: { size: 200, stroke: 8 }
};

export const HexagonProgress: React.FC<HexagonProgressProps> = ({
  progress,
  size = 'md',
  showLabel = true,
  animated = true
}) => {
  const { size: hexSize, stroke } = sizeMap[size];
  const radius = hexSize / 2;
  const center = hexSize / 2;
  
  // Create hexagon points
  const points = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * 60 - 30) * Math.PI / 180;
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  }).join(' ');

  return (
    <div className="relative inline-block">
      <svg
        width={hexSize}
        height={hexSize}
        viewBox={`0 0 ${hexSize} ${hexSize}`}
        className="transform rotate-90"
      >
        {/* Background hexagon */}
        <polygon
          points={points}
          fill="none"
          stroke={theme.colors.honeyLight}
          strokeWidth={stroke}
          opacity={0.3}
        />
        
        {/* Progress hexagon */}
        <motion.polygon
          points={points}
          fill="none"
          stroke={theme.colors.honeyGold}
          strokeWidth={stroke}
          strokeDasharray={`${progress} 100`}
          initial={animated ? { strokeDasharray: '0 100' } : undefined}
          animate={{ strokeDasharray: `${progress} 100` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        {/* Honey drip effect */}
        {progress > 0 && (
          <motion.circle
            cx={center}
            cy={stroke}
            r={stroke / 2}
            fill={theme.colors.honeyGold}
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-primary text-deepNavy font-bold text-lg">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}; 