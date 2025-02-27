
import React from 'react';
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressCircle({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  className,
  showLabel = true,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value / max;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="text-muted"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          className="text-primary transition-all duration-500 ease-out"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-lg font-medium">{Math.round(progress * 100)}%</span>
          <span className="text-xs text-muted-foreground">{value}/{max}</span>
        </div>
      )}
    </div>
  );
}
