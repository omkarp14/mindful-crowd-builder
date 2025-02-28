
<<<<<<< HEAD:src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
>>>>>>> main:frontend/src/pages/Dashboard.tsx
import { 
  BarChart, 
  Heart, 
  PlusCircle, 
  Wallet, 
  Clock, 
  User, 
  Settings,
  LogOut,
  ChevronRight,
  DollarSign,
  Calendar,
<<<<<<< HEAD:src/pages/Dashboard.tsx
  CreditCard,
  AlertCircle,
  Home,
  MapPin,
  Globe,
  Phone,
  Mail,
  Lock,
  Bell
=======
>>>>>>> main:frontend/src/pages/Dashboard.tsx
} from 'lucide-react';
import { ProgressCircle } from "@/components/ui/progress-circle";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
<<<<<<< HEAD:src/pages/Dashboard.tsx
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // State variables
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Form state for profile editing
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    address: '',
    postCode: '',
    country: ''
  });
  
  // Form state for adding a new payment method
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardType: 'visa',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });
  
  // Set default tab based on URL query param
  const query = new URLSearchParams(location.search);
  const tabParam = query.get('tab');
  const defaultTab = tabParam || 'overview';
  
  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login', { state: { from: '/dashboard' } });
        return;
      }
      
      setUser(session.user);
      
      // Fetch user profile data
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
          
          // Set profile form data
          setProfileForm({
            fullName: profileData.full_name || '',
            email: session.user.email || '',
            address: profileData.address || '',
            postCode: profileData.post_code || '',
            country: profileData.country || ''
          });
        }
        
        // Fetch user campaigns
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (campaignError) {
          console.error('Error fetching campaigns:', campaignError);
        } else {
          setCampaigns(campaignData || []);
        }
        
        // Fetch user donations
        const { data: donationData, error: donationError } = await supabase
          .from('donations')
          .select(`
            *,
            campaigns (
              id,
              title,
              image_url
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (donationError) {
          console.error('Error fetching donations:', donationError);
        } else {
          setDonations(donationData || []);
        }
        
        // Fetch payment methods
        const { data: paymentData, error: paymentError } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (paymentError) {
          console.error('Error fetching payment methods:', paymentError);
        } else {
          setPaymentMethods(paymentData || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account."
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred while signing out.",
        variant: "destructive"
      });
    }
  };
  
  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profileForm.fullName,
          address: profileForm.address,
          post_code: profileForm.postCode,
          country: profileForm.country
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update email if changed
      if (profileForm.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileForm.email
        });
        
        if (emailError) throw emailError;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      
      // Refresh profile data
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleAddPaymentMethod = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    
    try {
      // Simple validation
      if (
        newPaymentMethod.cardNumber.length < 13 ||
        !newPaymentMethod.expiryMonth ||
        !newPaymentMethod.expiryYear ||
        newPaymentMethod.cvv.length < 3
      ) {
        throw new Error("Please enter valid card details");
      }
      
      // In a real app, you would use a payment processor like Stripe here
      // This is just a mock implementation for demonstration purposes
      const last4 = newPaymentMethod.cardNumber.slice(-4);
      
      // If this is the first card or set as default, update existing cards
      if (newPaymentMethod.isDefault) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }
      
      // Insert new payment method
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          card_type: newPaymentMethod.cardType,
          last_four: last4,
          expiry_month: parseInt(newPaymentMethod.expiryMonth),
          expiry_year: parseInt(newPaymentMethod.expiryYear),
          is_default: newPaymentMethod.isDefault || paymentMethods.length === 0 // First card is automatically default
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Payment method added",
        description: "Your new payment method has been added successfully."
      });
      
      // Reset form
      setNewPaymentMethod({
        cardType: 'visa',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
      });
      
      // Add to state
      setPaymentMethods([...(data || []), ...paymentMethods]);
    } catch (error: any) {
      toast({
        title: "Failed to add payment method",
        description: error.message || "An error occurred while adding your payment method.",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleRemovePaymentMethod = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Payment method removed",
        description: "Your payment method has been removed successfully."
      });
      
      // Update state
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    } catch (error: any) {
      toast({
        title: "Failed to remove payment method",
        description: error.message || "An error occurred while removing your payment method.",
        variant: "destructive"
      });
    }
  };
  
  const handleSetDefaultPaymentMethod = async (id: string) => {
    if (!user) return;
    
    try {
      // Set all to false first
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);
      
      // Set the selected one to true
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been updated successfully."
      });
      
      // Update state
      setPaymentMethods(paymentMethods.map(pm => ({
        ...pm,
        is_default: pm.id === id
      })));
    } catch (error: any) {
      toast({
        title: "Failed to update default payment method",
        description: error.message || "An error occurred while updating your default payment method.",
        variant: "destructive"
      });
    }
  };
  
  // If still checking auth or loading data
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Calculate totals
  const totalDonated = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
  const totalRaised = campaigns.reduce((sum, campaign) => sum + (campaign.current_amount || 0), 0);
  const activeCampaigns = campaigns.filter(c => c.is_active).length;
=======
import { getUserData, getAllCampaigns } from '@/data/mockData';
import { Campaign, Donation } from '@/types';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  
  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  }, [isLoggedIn, navigate]);
  
  if (!isLoggedIn) {
    return null; // Don't render anything while redirecting
  }
  
  // Get user data and campaigns
  const userData = getUserData();
  const allCampaigns = getAllCampaigns();
  
  // Get user campaigns (in a real app, these would be filtered by user id)
  const userCampaigns = allCampaigns.slice(0, 3);
  
  // Get user donations (in a real app, these would be filtered by user id)
  const userDonations = userCampaigns.flatMap(campaign => 
    Array(Math.floor(Math.random() * 3) + 1).fill(0).map((_, index) => ({
      id: `donation-${campaign.id}-${index}`,
      campaignId: campaign.id,
      amount: Math.floor(Math.random() * 100) + 10,
      donorName: userData?.name || "Anonymous",
      donorEmail: userData?.email || "user@example.com",
      message: index === 0 ? "Keep up the great work!" : undefined,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      isAnonymous: false
    }))
  );
  
  // Calculate totals
  const totalDonated = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalRaised = userCampaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0);
  
  const handleLogout = () => {
    // Remove logged in state
    localStorage.removeItem('isLoggedIn');
    // Navigate to home page
    navigate('/');
  };
>>>>>>> main:frontend/src/pages/Dashboard.tsx
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your campaigns and track your donations.
            </p>
          </div>
          
          {/* Dashboard Tabs */}
<<<<<<< HEAD:src/pages/Dashboard.tsx
          <Tabs defaultValue={defaultTab} className="space-y-4">
=======
          <Tabs defaultValue="overview" className="space-y-4">
>>>>>>> main:frontend/src/pages/Dashboard.tsx
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
              <TabsTrigger value="donations">My Donations</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Donated
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalDonated}</div>
                    <p className="text-xs text-muted-foreground">
<<<<<<< HEAD:src/pages/Dashboard.tsx
                      Across {donations.length} donations
=======
                      Across {userDonations.length} donations
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Raised
                    </CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalRaised}</div>
                    <p className="text-xs text-muted-foreground">
<<<<<<< HEAD:src/pages/Dashboard.tsx
                      Across {campaigns.length} campaigns
=======
                      Across {userCampaigns.length} campaigns
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Campaigns
                    </CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
<<<<<<< HEAD:src/pages/Dashboard.tsx
                      {activeCampaigns}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Out of {campaigns.length} total campaigns
=======
                      {userCampaigns.filter(c => c.isActive).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Out of {userCampaigns.length} total campaigns
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest campaign and donation activity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
<<<<<<< HEAD:src/pages/Dashboard.tsx
                    {donations.slice(0, 5).map((donation, index) => (
                      <div key={donation.id} className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            You donated to{' '}
                            <span className="font-semibold">{donation.campaigns?.title || 'a campaign'}</span>
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>{format(new Date(donation.created_at), 'MMM d, yyyy')}</span>
                            <span className="mx-2">•</span>
                            <DollarSign className="mr-1 h-3 w-3" />
                            <span>${donation.amount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {donations.length === 0 && (
                      <div className="text-center py-6">
                        <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No donation activity yet</p>
                      </div>
                    )}
=======
                    {userDonations.slice(0, 5).map((donation, index) => {
                      const campaign = allCampaigns.find(c => c.id === donation.campaignId);
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {index % 2 === 0 ? 'You donated to' : 'Someone donated to'}{' '}
                              <span className="font-semibold">{campaign?.title}</span>
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>{format(new Date(donation.createdAt), 'MMM d, yyyy')}</span>
                              <span className="mx-2">•</span>
                              <DollarSign className="mr-1 h-3 w-3" />
                              <span>${donation.amount}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button 
                      variant="outline" 
                      className="justify-between" 
                      onClick={() => navigate('/create')}
                    >
                      <div className="flex items-center">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Create New Campaign</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-between"
                      onClick={() => navigate('/explore')}
                    >
                      <div className="flex items-center">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Explore Campaigns</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-between"
<<<<<<< HEAD:src/pages/Dashboard.tsx
                      onClick={() => navigate('/dashboard?tab=settings')}
=======
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                    >
                      <div className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Manage Payment Methods</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
<<<<<<< HEAD:src/pages/Dashboard.tsx
                          <div className="font-medium">{profile?.full_name || user?.email}</div>
                          <div className="text-sm text-muted-foreground">{user?.email}</div>
=======
                          <div className="font-medium">{userData?.name || "John Doe"}</div>
                          <div className="text-sm text-muted-foreground">{userData?.email || "john.doe@example.com"}</div>
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-2">
<<<<<<< HEAD:src/pages/Dashboard.tsx
                          Member since {format(new Date(profile?.created_at || user?.created_at || Date.now()), 'MMMM yyyy')}
=======
                          Member since {format(new Date(userData?.createdAt || Date.now()), 'MMMM yyyy')}
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between"
                          onClick={() => navigate('/dashboard?tab=settings')}
                        >
                          <div className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Manage Account</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* My Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Campaigns</h2>
                <Button onClick={() => navigate('/create')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Campaign
                </Button>
              </div>
              
<<<<<<< HEAD:src/pages/Dashboard.tsx
              {campaigns.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {campaigns.map((campaign) => {
                    const percentFunded = Math.min(Math.round((campaign.current_amount / campaign.goal) * 100), 100);
=======
              {userCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {userCampaigns.map((campaign: Campaign) => {
                    const percentFunded = Math.min(Math.round((campaign.currentAmount / campaign.goal) * 100), 100);
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                    const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                    
                    return (
                      <Card key={campaign.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/4 aspect-video md:aspect-square relative">
                            <img 
<<<<<<< HEAD:src/pages/Dashboard.tsx
                              src={campaign.image_url || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=300&h=300&q=80"}
=======
                              src={campaign.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=300&h=300&q=80"}
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                              alt={campaign.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 flex-1 flex flex-col md:flex-row">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {campaign.description}
                              </p>
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <Calendar className="mr-2 h-4 w-4" />
<<<<<<< HEAD:src/pages/Dashboard.tsx
                                <span>Created on {format(new Date(campaign.created_at), 'MMM d, yyyy')}</span>
=======
                                <span>Created on {format(new Date(campaign.createdAt), 'MMM d, yyyy')}</span>
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>{daysLeft} days left</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center justify-center">
                              <ProgressCircle 
<<<<<<< HEAD:src/pages/Dashboard.tsx
                                value={campaign.current_amount} 
=======
                                value={campaign.currentAmount} 
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                                max={campaign.goal} 
                                size={80}
                                showLabel={true}
                              />
                              <div className="mt-2 text-center">
<<<<<<< HEAD:src/pages/Dashboard.tsx
                                <div className="text-sm font-medium">${campaign.current_amount} raised</div>
=======
                                <div className="text-sm font-medium">${campaign.currentAmount} raised</div>
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                                <div className="text-xs text-muted-foreground">of ${campaign.goal} goal</div>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 flex flex-row md:flex-col justify-between items-center md:items-stretch gap-2 border-t md:border-t-0 md:border-l">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => navigate(`/campaign/${campaign.id}`)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/campaign/${campaign.id}/edit`)}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <div className="mb-4">
                    <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first campaign to raise funds for a cause you care about.
                  </p>
                  <Button onClick={() => navigate('/create')}>
                    Create Campaign
                  </Button>
                </Card>
              )}
            </TabsContent>
            
            {/* My Donations Tab */}
            <TabsContent value="donations" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">My Donations</h2>
              
<<<<<<< HEAD:src/pages/Dashboard.tsx
              {donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => {
=======
              {userDonations.length > 0 ? (
                <div className="space-y-4">
                  {userDonations.map((donation: Donation) => {
                    const campaign = allCampaigns.find(c => c.id === donation.campaignId);
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                    return (
                      <Card key={donation.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="font-medium mb-1">
                                Donated to{' '}
<<<<<<< HEAD:src/pages/Dashboard.tsx
                                <span className="font-semibold">{donation.campaigns?.title || 'a campaign'}</span>
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>{format(new Date(donation.created_at), 'MMMM d, yyyy')}</span>
=======
                                <span className="font-semibold">{campaign?.title}</span>
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>{format(new Date(donation.createdAt), 'MMMM d, yyyy')}</span>
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                              </div>
                              {donation.message && (
                                <div className="mt-3 text-sm italic">
                                  "{donation.message}"
                                </div>
                              )}
                            </div>
                            <div className="mt-4 sm:mt-0 text-right">
                              <div className="font-bold text-xl">${donation.amount}</div>
                              <Button 
                                variant="link" 
                                className="p-0 h-auto text-sm"
<<<<<<< HEAD:src/pages/Dashboard.tsx
                                onClick={() => navigate(`/campaign/${donation.campaign_id}`)}
=======
                                onClick={() => navigate(`/campaign/${donation.campaignId}`)}
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                              >
                                View Campaign
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <div className="mb-4">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No donations yet</h3>
                  <p className="text-muted-foreground mb-4">
                    When you donate to campaigns, they'll show up here.
                  </p>
                  <Button onClick={() => navigate('/explore')}>
                    Explore Campaigns
                  </Button>
                </Card>
              )}
            </TabsContent>
            
            {/* Account Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
<<<<<<< HEAD:src/pages/Dashboard.tsx
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={profileForm.fullName} 
                        onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileForm.email} 
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={profileForm.address} 
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postCode">Postal/Zip Code</Label>
                      <Input 
                        id="postCode" 
                        value={profileForm.postCode} 
                        onChange={(e) => setProfileForm({...profileForm, postCode: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        value={profileForm.country} 
                        onChange={(e) => setProfileForm({...profileForm, country: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleProfileUpdate}
                      disabled={saveLoading}
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
=======
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your profile and account preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <div className="border rounded-md p-3 mt-1">{userData?.name || "John Doe"}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        <div className="border rounded-md p-3 mt-1">{userData?.email || "john.doe@example.com"}</div>
                      </div>
                    </div>
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground">
                      Add or manage your payment methods for donations and withdrawals.
                    </p>
                    <Button variant="outline">Manage Payment Methods</Button>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Notification Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Control which notifications you receive from HiveFund.
                    </p>
                    <Button variant="outline">Manage Notifications</Button>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your password and security settings.
                    </p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <Button 
                      variant="destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
>>>>>>> main:frontend/src/pages/Dashboard.tsx
                    </Button>
                  </div>
                </CardContent>
              </Card>
<<<<<<< HEAD:src/pages/Dashboard.tsx
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods for donations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Existing payment methods */}
                  {paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {method.card_type.charAt(0).toUpperCase() + method.card_type.slice(1)} •••• {method.last_four}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Expires {method.expiry_month}/{method.expiry_year}
                                {method.is_default && <span className="ml-2 text-green-500 font-medium">Default</span>}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!method.is_default && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSetDefaultPaymentMethod(method.id)}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemovePaymentMethod(method.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <h3 className="text-lg font-medium mb-1">No payment methods yet</h3>
                      <p className="text-muted-foreground">
                        Add a payment method to make donations easier
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {/* Add new payment method form */}
                  <div>
                    <h3 className="font-medium text-lg mb-4">Add New Payment Method</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardType">Card Type</Label>
                        <Select 
                          value={newPaymentMethod.cardType} 
                          onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, cardType: value})}
                        >
                          <SelectTrigger id="cardType">
                            <SelectValue placeholder="Select card type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visa">Visa</SelectItem>
                            <SelectItem value="mastercard">Mastercard</SelectItem>
                            <SelectItem value="amex">American Express</SelectItem>
                            <SelectItem value="discover">Discover</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber" 
                          value={newPaymentMethod.cardNumber} 
                          onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16)})}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryMonth">Expiry Month</Label>
                          <Select 
                            value={newPaymentMethod.expiryMonth} 
                            onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, expiryMonth: value})}
                          >
                            <SelectTrigger id="expiryMonth">
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = (i + 1).toString().padStart(2, '0');
                                return (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="expiryYear">Expiry Year</Label>
                          <Select 
                            value={newPaymentMethod.expiryYear} 
                            onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, expiryYear: value})}
                          >
                            <SelectTrigger id="expiryYear">
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = (new Date().getFullYear() + i).toString();
                                return (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv" 
                            value={newPaymentMethod.cvv} 
                            onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                            placeholder="123"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox 
                          id="isDefault" 
                          checked={newPaymentMethod.isDefault}
                          onCheckedChange={(checked) => setNewPaymentMethod({
                            ...newPaymentMethod, 
                            isDefault: checked === true
                          })}
                        />
                        <Label htmlFor="isDefault">Set as default payment method</Label>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          onClick={handleAddPaymentMethod}
                          disabled={saveLoading}
                        >
                          {saveLoading ? "Adding..." : "Add Payment Method"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Change Password</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Update your password to keep your account secure
                      </p>
                      <Button variant="outline">
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-1">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">
                        <Lock className="mr-2 h-4 w-4" />
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control which notifications you receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Campaign Updates</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified about updates to campaigns you've donated to
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Donation Receipts</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive receipts when you make a donation
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">New Campaign Recommendations</h3>
                        <p className="text-sm text-muted-foreground">
                          Get recommendations for campaigns you might be interested in
                        </p>
                      </div>
                      <Switch checked={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </CardContent>
              </Card>
=======
>>>>>>> main:frontend/src/pages/Dashboard.tsx
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

<<<<<<< HEAD:src/pages/Dashboard.tsx
export default Dashboard;
=======
export default Dashboard;
>>>>>>> main:frontend/src/pages/Dashboard.tsx
