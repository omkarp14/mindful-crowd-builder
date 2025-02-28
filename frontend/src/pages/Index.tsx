import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCampaigns from '@/components/home/FeaturedCampaigns';
import HowItWorks from '@/components/home/HowItWorks';
import TestimonialSection from '@/components/home/TestimonialSection';
import CTASection from '@/components/home/CTASection';
import { mockCampaigns } from '@/data/mockData';
import BeeGame from './game/BeeGame';
import Leaderboard from './game/Leaderboard';
import DonationGame from './game/DonationGame';

const Index = () => {
  const [showDonationGame, setShowDonationGame] = useState(false);
  const [currentDonation, setCurrentDonation] = useState({
    amount: 0,
    donorName: '',
    donorId: '',
  });

  const handleGameComplete = (score: number) => {
    console.log(`Game completed with score: ${score}`);
    // TODO: Handle game completion, maybe show a celebration modal
    setShowDonationGame(false);
  };

  const handleGameExit = () => {
    setShowDonationGame(false);
  };

  // Add this function to simulate a donation
  const handleTestGame = () => {
    setCurrentDonation({
      amount: 100,
      donorName: 'Test Donor',
      donorId: '123',
    });
    setShowDonationGame(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-16">
        <Hero />
        <FeaturedCampaigns campaigns={mockCampaigns} />
        <HowItWorks />
        <TestimonialSection />
        <CTASection />
        
        {/* Game Section */}
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-amber-800 mb-8">
              Hive Heroes Leaderboard 🐝
            </h2>
            {/* Add test button */}
            <div className="text-center mb-8">
              <button
                onClick={handleTestGame}
                className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition-colors"
              >
                Try the Bee Game! 🐝
              </button>
            </div>
            <Leaderboard />
          </div>
        </section>

        {/* Donation Game Modal */}
        {showDonationGame && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50">
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <DonationGame
                  donation={currentDonation}
                  onGameComplete={handleGameComplete}
                  onExit={handleGameExit}
                />
                <button
                  onClick={handleGameExit}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
