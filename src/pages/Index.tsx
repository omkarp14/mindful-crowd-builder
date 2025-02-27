
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCampaigns from '@/components/home/FeaturedCampaigns';
import HowItWorks from '@/components/home/HowItWorks';
import TestimonialSection from '@/components/home/TestimonialSection';
import CTASection from '@/components/home/CTASection';
import { mockCampaigns } from '@/data/mockData';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-16">
        <Hero />
        <FeaturedCampaigns campaigns={mockCampaigns} />
        <HowItWorks />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
