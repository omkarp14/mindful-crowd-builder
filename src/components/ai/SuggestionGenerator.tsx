
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import SuggestionCard from '../campaign/SuggestionCard';
import { Campaign, CampaignSuggestion } from '@/types';
import { getSuggestionsByCampaignId } from '@/data/mockData';
import { ChevronDown, ChevronUp, Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SuggestionGeneratorProps {
  campaign: Campaign;
}

const mockPrompts = [
  "How can I improve my campaign title to attract more donors?",
  "What type of content would help me reach my fundraising goal faster?",
  "How can I better engage with my current donors?",
  "What are the best social media platforms to promote my campaign?",
  "How can I create more compelling updates for my supporters?",
];

const SuggestionGenerator: React.FC<SuggestionGeneratorProps> = ({ campaign }) => {
  const [suggestions, setSuggestions] = useState<CampaignSuggestion[]>(
    getSuggestionsByCampaignId(campaign.id) || []
  );
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleApplySuggestion = (suggestionId: string) => {
    toast.success("Suggestion applied", {
      description: "The suggestion has been applied to your campaign.",
      duration: 3000,
    });
    
    // In a real app, this would update the campaign with the suggestion
    console.log("Applied suggestion:", suggestionId);
  };
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Create a new mock suggestion
      const newSuggestion: CampaignSuggestion = {
        id: `s${suggestions.length + 1}`,
        campaignId: campaign.id,
        title: "Leverage Personal Stories",
        description: "Add testimonials from people who have benefited from your work. Personal stories create emotional connections with potential donors and can increase conversion rates by up to 30%.",
        type: 'content',
        createdAt: new Date().toISOString(),
      };
      
      // Add the new suggestion
      setSuggestions(prev => [newSuggestion, ...prev]);
      
      toast.success("New suggestion generated", {
        description: "Check out the new AI-generated suggestion for your campaign.",
      });
      
      // Clear the custom prompt
      setCustomPrompt('');
      
    } catch (error) {
      console.error("Error generating suggestion:", error);
      toast.error("Generation failed", {
        description: "There was an error generating your suggestion. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            AI-Powered Suggestions
          </CardTitle>
          <CardDescription>
            Get personalized suggestions to improve your campaign
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <Tabs defaultValue="suggestions">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="generate">Generate New</TabsTrigger>
            </TabsList>
            
            <TabsContent value="suggestions" className="space-y-4">
              {suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onApply={handleApplySuggestion}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No suggestions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate your first AI-powered suggestion to improve your campaign.
                  </p>
                  <Button 
                    onClick={() => document.querySelector('[data-value="generate"]')?.click()}
                  >
                    Generate Suggestions
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="generate">
              <div className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Ask anything about improving your campaign..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[100px] mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific to get more targeted suggestions for your campaign.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Try these prompts:</p>
                  <div className="flex flex-wrap gap-2">
                    {mockPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomPrompt(prompt)}
                        className="text-xs"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !customPrompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Suggestion
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default SuggestionGenerator;
