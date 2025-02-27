
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Campaign Image and Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  alt={campaign.title}
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="outline" className="gap-2" onClick={() => handleShare('facebook')}>
                  <Facebook className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => handleShare('twitter')}>
                  <Twitter className="h-4 w-4" />
                  Tweet
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => {}}>
                  <Heart className="h-4 w-4" />
                  Follow
                </Button>
              </div>
              
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="donors">Donors</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6 py-4">
                  <div className="prose max-w-none">
                    <p>{campaign.description}</p>
                    <p>
                      This campaign aims to make a significant impact by addressing crucial needs in our
                      community. With your support, we can achieve our goals and create lasting change.
                    </p>
                    <h3>Why This Matters</h3>
                    <p>
                      The funds raised will directly support initiatives that improve lives and build
                      stronger communities. Every contribution, no matter the size, brings us closer to
                      our vision of a better future.
                    </p>
                    <h3>How You Can Help</h3>
                    <ul>
                      <li>Donate to the campaign</li>
                      <li>Share with your network</li>
                      <li>Follow our updates</li>
                      <li>Volunteer your time</li>
                    </ul>
                  </div>
                  
                  {/* AI Suggestions section for campaign owner */}
                  <div className="mt-8">
                    <SuggestionGenerator campaign={campaign} />
                  </div>
                </TabsContent>
                
                <TabsContent value="updates" className="py-4">
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">We're halfway there!</h3>
                            <span className="text-sm text-muted-foreground">2 days ago</span>
                          </div>
                          <p>
                            Thanks to your incredible support, we've reached 50% of our funding goal! This is a
                            major milestone, and we couldn't have done it without you.
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>24</span>
                            </button>
                            <span>・</span>
                            <button>Comment</button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">Campaign launched!</h3>
                            <span className="text-sm text-muted-foreground">10 days ago</span>
                          </div>
                          <p>
                            We're excited to announce the launch of our campaign! We've been working hard to
                            prepare everything, and we're ready to make a difference with your help.
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>42</span>
                            </button>
                            <span>・</span>
                            <button>Comment</button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="donors" className="py-4">
                  <div className="space-y-4">
                    {donations.length > 0 ? (
                      donations.map((donation) => (
                        <Card key={donation.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">
                                  {donation.isAnonymous ? "Anonymous" : donation.donorName}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Donated ${donation.amount}
                                </p>
                                {donation.message && (
                                  <p className="mt-2 text-sm italic">"{donation.message}"</p>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(donation.createdAt), "MMM d, yyyy")}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No donations yet. Be the first to donate!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Donation Sidebar */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <ProgressCircle 
                        value={campaign.currentAmount} 
                        max={campaign.goal} 
                        size={140}
                        showLabel={true}
                      />
                    </div>
                    
                    <div className="space-y-2 text-center">
                      <div>
                        <span className="text-2xl font-bold">${campaign.currentAmount.toLocaleString()}</span>
                        <span className="text-muted-foreground"> raised of ${campaign.goal.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-center gap-8 text-sm">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{donations.length}</span>
                          <span className="text-muted-foreground">Donors</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="font-medium">{daysLeft}</span>
                          </div>
                          <span className="text-muted-foreground">Days Left</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button size="lg" className="w-full">Donate Now</Button>
                      <Button variant="outline" size="lg" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground pt-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Campaign ends on {format(new Date(campaign.deadline), "MMMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <DonationForm 
                campaign={campaign} 
                onDonationSuccess={() => {
                  // In a real app, this would refresh the donation list
                  console.log("Donation success callback");
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignDetails;
