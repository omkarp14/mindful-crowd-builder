
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCampaigns from '@/components/home/FeaturedCampaigns';
import HowItWorks from '@/components/home/HowItWorks';
import TestimonialSection from '@/components/home/TestimonialSection';
import CTASection from '@/components/home/CTASection';
import DonorLeaderboard from '@/components/home/DonorLeaderboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Heart, PawPrint } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [dogCampaigns, setDogCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Fetch regular campaigns
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (campaignError) throw campaignError;
        
        setCampaigns(campaignData || []);
        
        // Check if dog campaigns exist
        const { data: existingDogCampaigns, error: dogError } = await supabase
          .from('campaigns')
          .select('*')
          .ilike('title', '%dog%')
          .limit(3);
        
        if (dogError) throw dogError;
        
        // If no dog campaigns found, create some
        if (!existingDogCampaigns || existingDogCampaigns.length === 0) {
          await createDogCampaigns();
        } else {
          setDogCampaigns(existingDogCampaigns);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);

  const createDogCampaigns = async () => {
    // Sample dog campaigns
    const dogCampaignData = [
      {
        title: "Help Buddy Get Surgery",
        description: "Buddy is a 5-year-old golden retriever who needs emergency surgery. He's been a therapy dog for children with special needs, and now he needs our help.",
        category: "animals",
        goal: 3500,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days from now
        beneficiary_type: "animal shelter",
        image_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop",
        user_id: "system", // You'll need to replace this with a valid user_id
        is_active: true,
        current_amount: 1200
      },
      {
        title: "Max Needs a Wheelchair",
        description: "Max is a brave dachshund who suffers from degenerative disc disease. He needs a custom wheelchair to help him move around and enjoy life again.",
        category: "animals",
        goal: 2000,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days from now
        beneficiary_type: "animal rescue",
        image_url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop",
        user_id: "system", // You'll need to replace this with a valid user_id
        is_active: true,
        current_amount: 850
      },
      {
        title: "Luna's Cancer Treatment Fund",
        description: "Luna is a sweet 8-year-old husky diagnosed with cancer. She's been a loyal companion and now needs specialized treatment to fight this disease.",
        category: "animals",
        goal: 5000,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days from now
        beneficiary_type: "pet owner",
        image_url: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=1000&auto=format&fit=crop",
        user_id: "system", // You'll need to replace this with a valid user_id
        is_active: true,
        current_amount: 2300
      }
    ];
    
    try {
      // Get a valid user ID
      const { data: session } = await supabase.auth.getSession();
      let userId = session?.user?.id;
      
      if (!userId) {
        // If no logged in user, get first user from the database
        const { data: users } = await supabase.from('users').select('id').limit(1);
        userId = users && users.length > 0 ? users[0].id : null;
      }
      
      if (!userId) return; // Can't create campaigns without a valid user ID
      
      // Create the campaigns
      const dogCampaigns = dogCampaignData.map(campaign => ({
        ...campaign,
        user_id: userId
      }));
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert(dogCampaigns)
        .select();
      
      if (error) throw error;
      
      setDogCampaigns(data || []);
    } catch (error) {
      console.error('Error creating dog campaigns:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-16">
        <Hero />
        <FeaturedCampaigns campaigns={campaigns} />
        
        {/* Dog Campaigns Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Cute Dogs Need Your Help</h2>
                <p className="text-muted-foreground">Support these adorable companions</p>
              </div>
              <PawPrint className="h-12 w-12 text-amber-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dogCampaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={campaign.image_url || "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop"}
                      alt={campaign.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-amber-500">
                      Dog Campaign
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{campaign.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-semibold">${campaign.current_amount}</span>
                        <span className="text-xs text-muted-foreground"> raised of ${campaign.goal}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-xs">{Math.floor(Math.random() * 50) + 10} supporters</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => navigate(`/campaign/${campaign.id}`)}
                    >
                      Support this dog
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <HowItWorks />
        
        {/* Donor Leaderboard Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Donor Leaderboard</h2>
              <p className="text-muted-foreground">Celebrating our most generous supporters</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <DonorLeaderboard />
            </div>
          </div>
        </section>
        
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
