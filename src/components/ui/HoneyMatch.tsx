import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { theme } from '@/styles/theme';
import { Button } from './button';

interface HoneyMatchProps {
  matchAmount: number;
  matchDeadline: Date;
  currentAmount: number;
  onJoinMatch?: () => void;
  isMatched?: boolean;
}

export const HoneyMatch: React.FC<HoneyMatchProps> = ({
  matchAmount,
  matchDeadline,
  currentAmount,
  onJoinMatch,
  isMatched = false
}) => {
  const progress = Math.min((currentAmount / matchAmount) * 100, 100);
  const remainingAmount = Math.max(matchAmount - currentAmount, 0);
  const isExpired = new Date() > matchDeadline;

  return (
    <div className="bg-gradient-to-r from-softCream to-honeyLight rounded-lg p-6 shadow-md">
      <div className="flex items-center space-x-4 mb-4">
        <motion.div
          className="w-12 h-12 bg-honeyGold rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l6 4.5v9H6v-9l6-4.5z" />
          </svg>
        </motion.div>
        <div>
          <h3 className="text-lg font-secondary font-bold text-deepNavy">
            HoneyMatch Challenge
          </h3>
          <p className="text-sm text-charcoal">
            Double your impact with matched donations!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative h-4 bg-softCream rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-honeyGold"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-charcoal">
            ${currentAmount.toLocaleString()} raised
          </span>
          <span className="text-charcoal">
            ${matchAmount.toLocaleString()} goal
          </span>
        </div>

        <div className="bg-white bg-opacity-50 rounded-md p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-deepNavy font-medium">
              Remaining to be matched:
            </span>
            <span className="text-lg font-bold text-forestGreen">
              ${remainingAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-deepNavy font-medium">
              Match ends in:
            </span>
            <span className="text-sm font-medium text-charcoal">
              {format(matchDeadline, 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        {!isExpired && !isMatched && onJoinMatch && (
          <Button
            onClick={onJoinMatch}
            className="w-full bg-forestGreen hover:bg-forestGreen/90 text-white"
          >
            Join the Match
          </Button>
        )}

        {isMatched && (
          <div className="text-center text-sm text-forestGreen font-medium">
            You've joined this match! 🎉
          </div>
        )}

        {isExpired && (
          <div className="text-center text-sm text-charcoal font-medium">
            This match has ended
          </div>
        )}
      </div>
    </div>
  );
}; 