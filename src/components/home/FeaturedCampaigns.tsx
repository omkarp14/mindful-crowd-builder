
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import CampaignGrid from '../campaign/CampaignGrid';
import { Campaign } from '@/types';
import { ArrowRight } from 'lucide-react';

interface FeaturedCampaignsProps {
  campaigns: Campaign[];
}

const FeaturedCampaigns: React.FC<FeaturedCampaignsProps> = ({ campaigns }) => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Campaigns</h2>
            <p className="text-muted-foreground mt-2">Discover impactful campaigns making a difference right now</p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/explore" className="flex items-center">
              View All Campaigns
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <CampaignGrid campaigns={campaigns} />
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
