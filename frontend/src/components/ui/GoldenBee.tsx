import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';

interface GoldenBeeProps {
  rank: number;
  donorName: string;
  amount: number;
  donationCount: number;
  showAnimation?: boolean;
}

const rankColors = {
  1: theme.colors.honeyGold,
  2: '#C0C0C0', // Silver
  3: '#CD7F32', // Bronze
  default: theme.colors.charcoal
};

const getRankColor = (rank: number) => rankColors[rank] || rankColors.default;

const beeWingPath = "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z";

export const GoldenBee: React.FC<GoldenBeeProps> = ({
  rank,
  donorName,
  amount,
  donationCount,
  showAnimation = true
}) => {
  return (
    <div className="relative flex items-center space-x-4 bg-white rounded-lg p-4 shadow-md">
      <motion.div
        className="relative"
        animate={showAnimation ? {
          y: [0, -5, 0],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Rank Circle */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: getRankColor(rank) }}
        >
          #{rank}
        </div>

        {/* Animated Wings */}
        {showAnimation && (
          <>
            <motion.div
              className="absolute -right-2 top-1/2 transform -translate-y-1/2"
              animate={{
                rotate: [0, 15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg
                className="w-4 h-4"
                fill={getRankColor(rank)}
                viewBox="0 0 24 24"
              >
                <path d={beeWingPath} />
              </svg>
            </motion.div>
            <motion.div
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 scale-x-[-1]"
              animate={{
                rotate: [0, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg
                className="w-4 h-4"
                fill={getRankColor(rank)}
                viewBox="0 0 24 24"
              >
                <path d={beeWingPath} />
              </svg>
            </motion.div>
          </>
        )}
      </motion.div>

      <div className="flex-1">
        <h3 className="font-primary font-medium text-deepNavy">
          {donorName}
        </h3>
        <div className="flex items-center space-x-2 text-sm text-charcoal">
          <span className="font-bold">${amount.toLocaleString()}</span>
          <span>•</span>
          <span>{donationCount} donations</span>
        </div>
      </div>

      {rank === 1 && (
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg
            className="w-8 h-8 text-honeyGold"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}; 