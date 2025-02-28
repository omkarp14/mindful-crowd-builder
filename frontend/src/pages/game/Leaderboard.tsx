import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../../types';
import BeehiveProgress from './BeehiveProgress';

const TARGET_DONATIONS = 10000; // $10,000 goal

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
      {
        id: '2',
        userId: '2',
        userName: 'John Doe',
        donationAmount: 750,
        gameScore: 720,
        rank: 2,
        title: 'Master Collector 🍯',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        userId: '3',
        userName: 'Emily Chen',
        donationAmount: 500,
        gameScore: 680,
        rank: 3,
        title: 'Honey Hero 🌟',
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        userId: '4',
        userName: 'Michael Brown',
        donationAmount: 400,
        gameScore: 590,
        rank: 4,
        title: 'Busy Bee 🐝',
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        userId: '5',
        userName: 'Lisa Wong',
        donationAmount: 350,
        gameScore: 520,
        rank: 5,
        title: 'Worker Bee 🌺',
        createdAt: new Date().toISOString(),
      }
    ];
    setLeaderboardData(mockData);
  }, []);

  const handleDonateClick = () => {
    // Scroll to the donation form if it's on the same page
    const donationForm = document.querySelector('#donation-form');
    if (donationForm) {
      donationForm.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If the donation form is not on the same page, you can redirect to the donation page
      window.location.href = '/donate';
    }
  };

  const totalDonations = leaderboardData.reduce((sum, entry) => sum + entry.donationAmount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Beehive Progress Section */}
        <div className="lg:col-span-1">
          <BeehiveProgress
            totalDonations={totalDonations}
            totalPlayers={leaderboardData.length}
            targetDonations={TARGET_DONATIONS}
          />
        </div>

        {/* Leaderboard Section */}
        <div className="lg:col-span-2">
          <div className="bg-amber-50 p-6 rounded-lg shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-amber-800 mb-2">Hive Heroes 🐝</h2>
              <p className="text-amber-700 mb-6">Join our community of donors and play the bee game!</p>
              <button
                onClick={handleDonateClick}
                className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition-colors mb-6"
              >
                Donate Now & Join the Hive! 🍯
              </button>
            </div>
            
            <div className="space-y-4">
              {leaderboardData.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
                      <span className="text-xl font-bold text-amber-600">#{entry.rank}</span>
                    </div>
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
            
            <div className="mt-8 text-center text-amber-700 text-sm">
              <p>Make a donation to play the bee game and earn your spot on the leaderboard!</p>
              <p className="mt-2">Top donors get special titles and badges 🏆</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 