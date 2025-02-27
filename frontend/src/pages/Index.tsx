import { NextPage } from 'next';
import { CampaignGrid } from '@/components/campaign/CampaignGrid';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCampaigns from '@/components/home/FeaturedCampaigns';
import HowItWorks from '@/components/home/HowItWorks';
import TestimonialSection from '@/components/home/TestimonialSection';
import CTASection from '@/components/home/CTASection';
import React from 'react';

const HomePage: NextPage = () => {
  // Sample data - replace with API call
  const campaigns = [
    {
       id: '1',
      title: 'Save Local Bee Sanctuary',
      description: 'Help us protect our local bee population and maintain their natural habitat.',
      goal: 50000,
      currentAmount: 32500,
      image: '/images/bee-sanctuary.jpg',
      imageUrl: '/images/bee-sanctuary.jpg',
      location: 'Portland, OR',
      category: 'Environment',
      createdAt: '2024-03-01T00:00:00Z',
      deadline: '2024-04-15T00:00:00Z',
      createdBy: 'Jane Smith',
      isActive: true
    },
    // Add more sample campaigns...
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto pt-16 px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-secondary mb-4">
            Fund Together. Thrive Together.
          </h1>
          <p className="text-lg text-charcoal/80">
            Join the Hive and help causes thrive in your community.
          </p>
        </div>
        <Hero />

        <CampaignGrid campaigns={campaigns} />
        <HowItWorks />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
      </div>
  );
};

export default HomePage;
