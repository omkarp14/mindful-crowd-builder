import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import Leaderboard from './Leaderboard';
import BeeGame from './BeeGame';

interface DonationGameProps {
  donation: {
    amount: number;
    donorName: string;
    donorId: string;
  };
  onGameComplete: (score: number) => void;
}

const DonationGame: React.FC<DonationGameProps> = ({ donation, onGameComplete }) => {
  const [showGame, setShowGame] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleGameComplete = (score: number) => {
    setGameCompleted(true);
    setShowGame(false);
    onGameComplete(score);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-8">
        {showGame ? (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-amber-800 mb-4">
              Thanks for Your Donation, {donation.donorName}! 🐝
            </h2>
            <p className="text-lg text-amber-700 mb-8">
              Play the Honey Collection Game to earn your place on the Hive Heroes leaderboard!
            </p>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <BeeGame />
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-amber-800 mb-4">
              {gameCompleted ? "Great Job! 🎉" : "Hive Heroes Leaderboard"}
            </h2>
            {gameCompleted && (
              <p className="text-lg text-amber-700 mb-8">
                Check out your position on the leaderboard!
              </p>
            )}
            <Leaderboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationGame; 