
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CampaignSuggestion } from '@/types';
import { ArrowRight } from 'lucide-react';

interface SuggestionCardProps {
  suggestion: CampaignSuggestion;
  onApply?: (suggestionId: string) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onApply }) => {
  // Function to get badge color based on suggestion type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'content':
        return "default";
      case 'promotion':
        return "secondary";
      case 'audience':
        return "outline";
      default:
        return "default";
    }
  };
  
  // Function to get human-readable type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'content':
        return "Content Suggestion";
      case 'promotion':
        return "Promotion Strategy";
      case 'audience':
        return "Audience Targeting";
      default:
        return type;
    }
  };
  
  const handleApply = () => {
    if (onApply) {
      onApply(suggestion.id);
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4" 
      style={{ borderLeftColor: 'var(--primary)' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={getBadgeVariant(suggestion.type)}>
            {getTypeLabel(suggestion.type)}
          </Badge>
        </div>
        <CardTitle className="mt-2">{suggestion.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="text-sm text-foreground/90 whitespace-pre-line">
          {suggestion.description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:text-primary/80 p-0 hover:bg-transparent"
          onClick={handleApply}
        >
          Apply suggestion
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestionCard;
