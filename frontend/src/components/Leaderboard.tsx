import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types';

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // TODO: Fetch leaderboard data from backend
    const mockData: LeaderboardEntry[] = [
      {
        id: '1',
        userId: '1',
        userName: 'Sarah Smith',
        donationAmount: 1000,
        gameScore: 850,
        rank: 1,
        title: 'Queen Bee 👑',
        createdAt: new Date().toISOString(),
      },
      // Add more mock data as needed
    ];
    setLeaderboardData(mockData);
  }, []);

  return (
    <div className="bg-amber-50 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-amber-800">Hive Heroes 🐝</h2>
      <div className="space-y-4">
        {leaderboardData.map((entry) => (
          <div
            key={entry.id}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:bg-amber-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-amber-600">#{entry.rank}</span>
              <div>
                <h3 className="font-semibold text-lg">{entry.userName}</h3>
                <span className="text-amber-700 text-sm">{entry.title}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-amber-900">${entry.donationAmount}</div>
              <div className="text-sm text-amber-600">Score: {entry.gameScore}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard; 