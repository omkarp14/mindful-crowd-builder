
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ProgressCircle } from '@/components/ui/progress-circle';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SuggestionGenerator from '@/components/ai/SuggestionGenerator';
import {
  Calendar,
  Clock,
  Facebook,
  Heart,
  Share2,
  ThumbsUp,
  Twitter,
  Edit,
  Sparkles,
  CreditCard,
  AlertCircle,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [enhanceAIOpen, setEnhanceAIOpen] = useState(false);
  const [enhancedDescription, setEnhancedDescription] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Donation form state
  const [donationForm, setDonationForm] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    message: '',
    isAnonymous: false,
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    nameOnCard: '',
  });
  
  const [donationStep, setDonationStep] = useState(1);
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCampaign = async () => {
        try {
          // Fetch campaign details
          const { data: campaignData, error: campaignError } = await supabase
            .from('campaigns')
            .select('*')
            .eq('id', id)
            .single();
          
          if (campaignError) throw campaignError;
          
          setCampaign(campaignData);
          
          // Fetch donations for this campaign
          const { data: donationsData, error: donationsError } = await supabase
            .from('donations')
            .select('*')
            .eq('campaign_id', id)
            .order('created_at', { ascending: false });
          
          if (donationsError) throw donationsError;
          
          setDonations(donationsData || []);
        } catch (error) {
          console.error("Error fetching campaign:", error);
          toast({
            title: "Campaign not found",
            description: "The campaign you are looking for doesn't exist or has been removed.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        }
      };
      
      fetchCampaign();
      checkSession();
    }
  }, [id]);

  const handleShare = (platform: string) => {
    // In a real app, this would use the Web Share API or open share dialogs
    toast({
      title: `Shared on ${platform}`,
      description: "Thank you for sharing this campaign!",
    });
  };
  
  const handleDonationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDonationForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDonationCheckboxChange = (name: string, checked: boolean) => {
    setDonationForm(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleDonationSubmit = async () => {
    if (donationStep === 1) {
      // Validate first step
      if (!donationForm.amount || parseFloat(donationForm.amount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid donation amount.",
          variant: "destructive",
        });
        return;
      }
      
      setDonationStep(2);
      return;
    }
    
    // Process payment and submit donation
    setIsSubmittingDonation(true);
    
    try {
      // Validate payment details
      if (
        !donationForm.cardNumber.trim() ||
        !donationForm.cardExpiry.trim() ||
        !donationForm.cardCvc.trim() ||
        !donationForm.nameOnCard.trim()
      ) {
        throw new Error("Please fill in all payment details");
      }
      
      // In a real app, you would process payment through a payment gateway
      
      // Add donation to database
      const { error } = await supabase.from('donations').insert({
        campaign_id: id,
        user_id: user?.id, // Will be null for non-logged-in users
        amount: parseFloat(donationForm.amount),
        donor_name: donationForm.isAnonymous ? null : donationForm.donorName,
        donor_email: donationForm.donorEmail,
        message: donationForm.message,
        is_anonymous: donationForm.isAnonymous,
      });
      
      if (error) throw error;
      
      // Update campaign's current amount
      if (campaign) {
        const newAmount = campaign.current_amount + parseFloat(donationForm.amount);
        const { error: updateError } = await supabase
          .from('campaigns')
          .update({ current_amount: newAmount })
          .eq('id', id);
        
        if (updateError) throw updateError;
        
        setCampaign({ ...campaign, current_amount: newAmount });
      }
      
      // Show success message
      setDonationSuccess(true);
      
      // Refresh donations list
      const { data: newDonations } = await supabase
        .from('donations')
        .select('*')
        .eq('campaign_id', id)
        .order('created_at', { ascending: false });
      
      if (newDonations) {
        setDonations(newDonations);
      }
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsDonationDialogOpen(false);
        setDonationSuccess(false);
        setDonationStep(1);
        setDonationForm({
          amount: '',
          donorName: '',
          donorEmail: '',
          message: '',
          isAnonymous: false,
          cardNumber: '',
          cardExpiry: '',
          cardCvc: '',
          nameOnCard: '',
        });
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Donation failed",
        description: error.message || "There was a problem processing your donation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingDonation(false);
    }
  };
  
  const enhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      // Simulate AI enhancement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (campaign?.description) {
        // This would be a real API call in production
        const enhanced = `${campaign.description}\n\n${campaign.title} isn't just a campaign; it's a movement towards positive change. Every donation, regardless of size, contributes to our collective goal of making a tangible impact. Your support doesn't just fund a project—it empowers a community, ignites hope, and creates lasting change. Join us today in this meaningful journey, and together, we can transform lives for the better.`;
        
        setEnhancedDescription(enhanced);
      }
    } catch (error) {
      toast({
        title: "AI enhancement failed",
        description: "We couldn't enhance your description at this time.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const applyEnhancedDescription = async () => {
    if (!enhancedDescription || !campaign) return;
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ description: enhancedDescription })
        .eq('id', id);
      
      if (error) throw error;
      
      setCampaign({ ...campaign, description: enhancedDescription });
      setEnhanceAIOpen(false);
      setEnhancedDescription('');
      
      toast({
        title: "Description updated",
        description: "Your campaign description has been enhanced with AI.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update campaign description.",
        variant: "destructive",
      });
    }
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

  const percentFunded = Math.min(Math.round((campaign.current_amount / campaign.goal) * 100), 100);
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
                  src={campaign.image_url || "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"}
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
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">Campaign Description</h3>
                      {user && campaign.user_id === user.id && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => setEnhanceAIOpen(true)}
                        >
                          <Sparkles className="h-4 w-4" />
                          Enhance with AI
                        </Button>
                      )}
                    </div>
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
                  {user && campaign.user_id === user.id && (
                    <div className="mt-8">
                      <SuggestionGenerator />
                    </div>
                  )}
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
                                  {donation.is_anonymous ? "Anonymous" : donation.donor_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Donated ${donation.amount}
                                </p>
                                {donation.message && (
                                  <p className="mt-2 text-sm italic">"{donation.message}"</p>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(donation.created_at), "MMM d, yyyy")}
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
                        value={campaign.current_amount} 
                        max={campaign.goal} 
                        size={140}
                        showLabel={true}
                      />
                    </div>
                    
                    <div className="space-y-2 text-center">
                      <div>
                        <span className="text-2xl font-bold">${campaign.current_amount.toLocaleString()}</span>
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
                      <Button 
                        size="lg" 
                        className="w-full"
                        onClick={() => setIsDonationDialogOpen(true)}
                      >
                        Donate Now
                      </Button>
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
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">About the organizer</h3>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {campaign.user_id?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="font-medium">Campaign Organizer</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.beneficiary_type === 'myself' ? 'Self-funded campaign' : `Beneficiary: ${campaign.beneficiary_type}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p>Campaign created on {format(new Date(campaign.created_at), "MMMM d, yyyy")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Donation Dialog */}
      <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {donationSuccess ? "Thank You!" : (donationStep === 1 ? "Donate to " + campaign.title : "Payment Details")}
            </DialogTitle>
            <DialogDescription>
              {donationSuccess 
                ? "Your donation has been processed successfully." 
                : (donationStep === 1 ? "Your support makes a difference." : "Your donation is secure and encrypted.")}
            </DialogDescription>
          </DialogHeader>
          
          {donationSuccess ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p className="text-center text-muted-foreground mb-4">
                Your donation of ${donationForm.amount} has been successfully processed.
              </p>
              <Button variant="default" onClick={() => setIsDonationDialogOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <>
              {donationStep === 1 ? (
                // Step 1: Donation amount and details
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Donation Amount ($)</Label>
                    <Input 
                      id="amount" 
                      name="amount" 
                      type="number" 
                      placeholder="50" 
                      value={donationForm.amount}
                      onChange={handleDonationChange}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="donorName">Your Name</Label>
                    <Input 
                      id="donorName" 
                      name="donorName" 
                      placeholder="John Doe" 
                      value={donationForm.donorName}
                      onChange={handleDonationChange}
                      disabled={donationForm.isAnonymous}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="donorEmail">Email Address</Label>
                    <Input 
                      id="donorEmail" 
                      name="donorEmail" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={donationForm.donorEmail}
                      onChange={handleDonationChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Leave a Message (Optional)</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Your words of encouragement..." 
                      value={donationForm.message}
                      onChange={handleDonationChange}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isAnonymous" 
                      checked={donationForm.isAnonymous}
                      onCheckedChange={(checked) => handleDonationCheckboxChange('isAnonymous', checked === true)}
                    />
                    <Label htmlFor="isAnonymous">Make my donation anonymous</Label>
                  </div>
                </div>
              ) : (
                // Step 2: Payment details
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-3 rounded-md border p-3 mb-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm font-medium">
                      Donation amount: <span className="font-bold">${donationForm.amount}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input 
                      id="nameOnCard" 
                      name="nameOnCard" 
                      placeholder="John Doe" 
                      value={donationForm.nameOnCard}
                      onChange={handleDonationChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      name="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={donationForm.cardNumber}
                      onChange={handleDonationChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiration (MM/YY)</Label>
                      <Input 
                        id="cardExpiry" 
                        name="cardExpiry" 
                        placeholder="MM/YY" 
                        value={donationForm.cardExpiry}
                        onChange={handleDonationChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input 
                        id="cardCvc" 
                        name="cardCvc" 
                        placeholder="123" 
                        value={donationForm.cardCvc}
                        onChange={handleDonationChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Your payment information is processed securely.</span>
                  </div>
                </div>
              )}
              
              <DialogFooter className="sm:justify-between">
                {donationStep === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDonationStep(1)}
                    disabled={isSubmittingDonation}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleDonationSubmit}
                  disabled={isSubmittingDonation}
                >
                  {isSubmittingDonation 
                    ? "Processing..." 
                    : (donationStep === 1 ? "Continue" : "Complete Donation")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* AI Description Enhancement Dialog */}
      <Dialog open={enhanceAIOpen} onOpenChange={setEnhanceAIOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Enhance Description with AI</DialogTitle>
            <DialogDescription>
              Let AI help you improve your campaign description to engage more donors.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Original Description</Label>
              <div className="border rounded-md p-3 bg-muted/50 text-sm">
                {campaign.description}
              </div>
            </div>
            
            {!enhancedDescription && !isEnhancing ? (
              <Button
                className="w-full flex items-center justify-center"
                onClick={enhanceWithAI}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Enhanced Description
              </Button>
            ) : isEnhancing ? (
              <div className="w-full p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Enhanced Description</Label>
                <div className="border rounded-md p-3 text-sm">
                  {enhancedDescription}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEnhanceAIOpen(false);
                setEnhancedDescription('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={applyEnhancedDescription}
              disabled={!enhancedDescription || isEnhancing}
            >
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default CampaignDetails;
