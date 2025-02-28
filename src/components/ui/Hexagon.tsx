import React from 'react';
import { motion } from 'framer-motion';

interface HexagonProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  animate?: boolean;
  progress?: number;
}

export const Hexagon: React.FC<HexagonProps> = ({
  className = '',
  children,
  onClick,
  animate = false,
  progress = 0,
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={animate ? { scale: 1.05 } : undefined}
      whileTap={animate ? { scale: 0.95 } : undefined}
      onClick={onClick}
    >
      <div className="hexagon-shape relative w-full pt-[115.47%]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Background hexagon */}
          <div className="absolute inset-0 bg-primary-100" />
          
          {/* Progress fill */}
          {progress > 0 && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-primary-500 transition-all duration-1000"
              style={{ height: `${progress}%` }}
            />
          )}
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 