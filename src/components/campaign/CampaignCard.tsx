
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from 'lucide-react';
import { Campaign } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const percentFunded = Math.min(Math.round((campaign.currentAmount / campaign.goal) * 100), 100);
  const timeLeft = formatDistanceToNow(new Date(campaign.deadline), { addSuffix: true });
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <Link to={`/campaign/${campaign.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
            alt={campaign.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="shadow-soft">
              {campaign.category}
            </Badge>
          </div>
        </div>
      </Link>
      
      <CardContent className="pt-4 pb-2">
        <h3 className="text-lg font-semibold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          <Link to={`/campaign/${campaign.id}`}>
            {campaign.title}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {campaign.description}
        </p>
        
        <div className="mt-4 space-y-3">
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentFunded}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-semibold">${campaign.currentAmount.toLocaleString()}</span>
              <span className="text-muted-foreground"> raised of ${campaign.goal.toLocaleString()}</span>
            </div>
            <div className="text-sm font-medium">
              {percentFunded}%
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 pb-3 flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{timeLeft}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span>{(campaign.currentAmount / 50).toFixed(0)} donors</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
