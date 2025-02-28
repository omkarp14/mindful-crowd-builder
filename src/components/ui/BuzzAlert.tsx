import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/styles/theme';

interface BuzzAlertProps {
  message: string;
  type?: 'donation' | 'milestone' | 'match';
  amount?: number;
  isVisible: boolean;
  onClose: () => void;
}

const alertIcons = {
  donation: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
  ),
  milestone: (
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM19 8c0 1.3-.84 2.4-2 2.82V7h2v1z" />
  ),
  match: (
    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
  )
};

const alertColors = {
  donation: theme.colors.honeyGold,
  milestone: theme.colors.forestGreen,
  match: theme.colors.deepNavy
};

export const BuzzAlert: React.FC<BuzzAlertProps> = ({
  message,
  type = 'donation',
  amount,
  isVisible,
  onClose
}) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed bottom-4 right-4 flex items-center space-x-2 bg-white rounded-lg shadow-lg p-4 pr-12 max-w-sm"
          style={{ zIndex: 50 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: alertColors[type] }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: 1
            }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {alertIcons[type]}
            </svg>
          </motion.div>

          <div className="flex-1">
            <h4 className="font-primary font-medium text-deepNavy">
              {type === 'donation' && 'New Donation!'}
              {type === 'milestone' && 'Milestone Reached!'}
              {type === 'match' && 'New Match Alert!'}
            </h4>
            <p className="text-sm text-charcoal">
              {amount && (
                <span className="font-bold">${amount.toLocaleString()} - </span>
              )}
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-charcoal hover:text-deepNavy"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 