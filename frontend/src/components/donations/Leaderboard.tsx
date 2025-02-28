import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { fetchLeaderboard } from '../../store/slices/donationSlice';
import { GoldenBee } from '../ui/GoldenBee';

interface TimeframeOption {
  value: string;
  label: string;
}

export const Leaderboard = () => {
  const dispatch = useAppDispatch();
  const { leaderboard, isLoading, error } = useAppSelector((state) => state.donations);
  const [timeframe, setTimeframe] = useState<string>('all-time');

  const timeframeOptions: TimeframeOption[] = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'all-time', label: 'All Time' },
  ];

  useEffect(() => {
    dispatch(fetchLeaderboard({ timeframe }));
  }, [dispatch, timeframe]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-honeyGold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-secondary font-bold text-deepNavy">
          Top Donors
        </h2>
        <div className="flex space-x-2">
          {timeframeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
                timeframe === option.value
                  ? 'bg-honeyGold text-white'
                  : 'bg-softCream text-deepNavy hover:bg-honeyLight'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {leaderboard.map((entry, index) => (
          <GoldenBee
            key={`${entry.donorName}-${index}`}
            rank={index + 1}
            donorName={entry.donorName}
            amount={entry.totalDonated}
            donationCount={entry.donationCount}
            showAnimation={index < 3} // Only animate top 3
          />
        ))}

        {leaderboard.length === 0 && (
          <div className="text-center text-charcoal py-8">
            No donations found for this timeframe.
          </div>
        )}
      </div>
    </div>
  );
}; 