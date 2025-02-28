
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SuggestionGeneratorProps {
  campaign?: any; // Make campaign prop optional
}

const SuggestionGenerator: React.FC<SuggestionGeneratorProps> = ({ campaign }) => {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSuggestion = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate suggestions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSuggestion('');

    try {
      // For now, we'll use a mock API response
      // In a real application, this would call an AI service like OpenAI
      setTimeout(() => {
        const suggestions = [
          "Consider adding compelling images that show the impact of your campaign.",
          "Share a personal story that connects emotionally with potential donors.",
          "Include specific goals and timelines to build trust with your audience.",
          "Explain exactly how the funds will be used to achieve your objectives.",
          "Add social proof like testimonials or endorsements to increase credibility.",
        ];
        
        // Select a random suggestion from the array
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        setSuggestion(randomSuggestion);
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Failed to generate suggestion",
        description: "An error occurred while generating your suggestion.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Input 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt for campaign suggestions"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && generateSuggestion()}
          />
        </div>
        <Button 
          onClick={generateSuggestion}
          disabled={loading}
          className="flex items-center"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Generate
        </Button>
      </div>
      
      {suggestion && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm">{suggestion}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuggestionGenerator;
