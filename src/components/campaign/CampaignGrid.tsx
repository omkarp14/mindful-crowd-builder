
import React from 'react';
import CampaignCard from './CampaignCard';
import { Campaign } from '@/types';

interface CampaignGridProps {
  campaigns: Campaign[];
  title?: string;
  description?: string;
}

const CampaignGrid: React.FC<CampaignGridProps> = ({
  campaigns,
  title,
  description,
}) => {
  return (
    <div className="space-y-8">
      {(title || description) && (
        <div className="space-y-2 text-center max-w-3xl mx-auto">
          {title && <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

export default CampaignGrid;
