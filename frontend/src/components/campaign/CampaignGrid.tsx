import React from 'react';
import  CampaignCard  from './CampaignCard';
import { motion } from 'framer-motion';
import { Campaign } from '@/types';

interface CampaignGridProps {
  campaigns: Campaign[];
}

export const CampaignGrid: React.FC<CampaignGridProps> = ({ campaigns }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign, index) => (
        <motion.div
          key={campaign.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CampaignCard campaign={campaign} />
        </motion.div>
      ))}
    </div>
  );
};
