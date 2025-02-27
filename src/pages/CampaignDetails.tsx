
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getCampaignById, getDonationsByCampaignId } from '@/data/mockData';
import { Campaign, Donation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressCircle } from '@/components/ui/progress-circle';
import DonationForm from '@/components/campaign/DonationForm';
import SuggestionGenerator from '@/components/ai/SuggestionGenerator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, Clock, Facebook, Heart, Share2, ThumbsUp, Twitter } from 'lucide-react';
import { format } from 'date-fns';

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchedCampaign = getCampaignById(id);
      if (fetchedCampaign) {
        setCampaign(fetchedCampaign);
        setDonations(getDonationsByCampaignId(id));
      } else {
        toast.error("Campaign not found", {
          description: "The campaign you are looking for doesn't exist or has been removed.",
        });
      }
      setLoading(false);
    }
  }, [id]);

  const handleShare = (platform: string) => {
    // In a real app, this would use the Web Share API or open share dialogs
    toast.success(`Shared on ${platform}`, {
      description: "Thank you for sharing this campaign!",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse space-y-8 max-w-4xl w-full px-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
            <p className="text-muted-foreground mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/explore">Browse Campaigns</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const percentFunded = Math.min(Math.round((campaign.currentAmount / campaign.goal) * 100), 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button and category */}
          <div className="flex justify-between items-center mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/explore">← Back to campaigns</Link>
            </Button>
            <div className="text-sm font-medium text-muted-foreground">
              {campaign.category}
            </div>
          </div>
          
          {/* Campaign Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{campaign.title}</h1>
          
          <div className="grid grid-cols-1 