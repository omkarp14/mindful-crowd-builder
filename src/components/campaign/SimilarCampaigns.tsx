import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from '@/types';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SimilarCampaignsProps {
  currentCampaign: Campaign;
}

const SimilarCampaigns: React.FC<SimilarCampaignsProps> = ({ currentCampaign }) => {
  // Get all campaigns from localStorage
  const allCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]') as Campaign[];
  
  // Filter out the current campaign and find similar ones based on tags and category
  const similarCampaigns = allCampaigns
    .filter(campaign => campaign.id !== currentCampaign.id)
    .map(campaign => {
      // Calculate similarity score based on matching tags and category
      const matchingTags = currentCampaign.tags.filter(tag => 
        campaign.tags.includes(tag)
      ).length;
      
      const categoryMatch = campaign.category === currentCampaign.category ? 1 : 0;
      
      // Calculate similarity score (tags have more weight than category)
      const similarityScore = (matchingTags * 2) + categoryMatch;
      
      return {
        ...campaign,
        similarityScore
      };
    })
    .filter(campaign => campaign.similarityScore > 0) // Only show campaigns with some similarity
    .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by similarity score
    .slice(0, 3); // Show top 3 similar campaigns

  if (similarCampaigns.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          Similar Campaigns
        </CardTitle>
        <CardDescription>
          Discover related campaigns that might interest you
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {similarCampaigns.map((campaign) => (
            <Link 
              key={campaign.id} 
              to={`/campaign/${campaign.id}`}
              className="block group"
            >
              <div className="flex gap-4 p-4 rounded-lg border hover:border-primary transition-colors">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={campaign.image_url || "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"}
                    alt={campaign.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg truncate group-hover:text-primary transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {campaign.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-primary font-medium">
                      ${campaign.current_amount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      raised of ${campaign.goal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarCampaigns; 