import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from 'lucide-react';
import { Campaign } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Hexagon } from '../ui/Hexagon';
import { motion } from 'framer-motion';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const percentFunded = Math.min(Math.round((campaign.currentAmount / campaign.goal) * 100), 100);
  const timeLeft = formatDistanceToNow(new Date(campaign.deadline), { addSuffix: true });
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
        <CardContent className="p-0">
          <Link to={`/campaign/${campaign.id}`}>
            <div className="relative h-48 overflow-hidden">
              <img 
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Campaign Info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-secondary">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-charcoal/60 flex items-center gap-1">
                    <span>📍</span> {campaign.location}
                  </p>
                </div>
                <Hexagon className="w-16" progress={percentFunded}>
                  <span className="text-xs font-bold">
                    {Math.round(percentFunded)}%
                  </span>
                </Hexagon>
              </div>

              <p className="mt-2 text-sm text-charcoal/80 line-clamp-2">
                {campaign.description}
              </p>

              {/* Progress and Stats */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">${campaign.currentAmount.toLocaleString()}</span>
                  <span className="text-charcoal/60">of ${campaign.goal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-charcoal/60">
                  <span>{timeLeft}</span>
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full">
                    {campaign.category}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CampaignCard;
