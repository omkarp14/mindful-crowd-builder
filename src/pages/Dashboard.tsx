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
import { Campaign } from '@/types';
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
  CreditCard,
  AlertCircle,
  Home,
  MapPin,
  Globe,
  Phone,
  Mail,
  Lock,
  Bell,
  Filter
} from 'lucide-react';
import { ProgressCircle } from "@/components/ui/progress-circle";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { format } from 'date-fns';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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
  
  // Add campaigns state
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([]);
  
  // Add new state variables after other state declarations
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('campaign');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState('all');
  
  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          navigate('/login', { state: { from: '/dashboard' } });
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Set profile form data
        setProfileForm({
          fullName: parsedUser.full_name || '',
          email: parsedUser.email || '',
          address: parsedUser.address || '',
          postCode: parsedUser.post_code || '',
          country: parsedUser.country || ''
        });

        // Add dummy default payment method if none exist
        const storedPaymentMethods = parsedUser.payment_methods || [];
        if (storedPaymentMethods.length === 0) {
          const dummyPaymentMethod = {
            id: 'default-card',
            card_type: 'visa',
            last_four: '4242',
            expiry_month: 12,
            expiry_year: new Date().getFullYear() + 2,
            is_default: true
          };
          parsedUser.payment_methods = [dummyPaymentMethod];
          localStorage.setItem('user', JSON.stringify(parsedUser));
          setPaymentMethods([dummyPaymentMethod]);
        } else {
          setPaymentMethods(storedPaymentMethods);
        }

        // Fetch all campaigns from localStorage
        const allCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        
        // Filter campaigns created by the current user
        const userCampaigns = allCampaigns.filter((campaign: Campaign) => 
          campaign.created_by === parsedUser.id || campaign.created_by === parsedUser.email
        );
        
        setUserCampaigns(userCampaigns);

        // Fetch user donations from localStorage
        const storedDonations = localStorage.getItem('userDonations');
        if (storedDonations) {
          setDonations(JSON.parse(storedDonations));
        }

      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/login', { state: { from: '/dashboard' } });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user' || e.key === 'isLoggedIn') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);
  
  // Add this function after other useEffect hooks
  useEffect(() => {
    const fetchPaymentData = () => {
      try {
        // Get all campaigns from localStorage
        const allCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        const userCampaigns = allCampaigns.filter((campaign: Campaign) => 
          campaign.created_by === user?.id || campaign.created_by === user?.email
        );

        // Get all donations from localStorage
        const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
        
        // Filter donations for user's campaigns
        const campaignDonations = allDonations.filter((donation: any) => 
          userCampaigns.some((campaign: Campaign) => campaign.id === donation.campaign_id)
        );

        // If no real data, use dummy data for visualization
        let processedData;
        if (campaignDonations.length === 0) {
          // Create dummy data
          const dummyCampaigns = [
            { title: "Save the Oceans", amount: 15000 },
            { title: "Education for All", amount: 25000 },
            { title: "Green Energy Project", amount: 18000 },
            { title: "Community Garden", amount: 8000 },
            { title: "Youth Sports Program", amount: 12000 }
          ];

          const dummyMonthlyData = [
            { month: 'Jan', amount: 5000 },
            { month: 'Feb', amount: 7500 },
            { month: 'Mar', amount: 10000 },
            { month: 'Apr', amount: 8000 },
            { month: 'May', amount: 12000 },
            { month: 'Jun', amount: 15000 },
            { month: 'Jul', amount: 13000 },
            { month: 'Aug', amount: 16000 },
            { month: 'Sep', amount: 18000 },
            { month: 'Oct', amount: 20000 },
            { month: 'Nov', amount: 22000 },
            { month: 'Dec', amount: 25000 }
          ];

          const dummyYearlyData = [
            { year: '2020', amount: 85000 },
            { year: '2021', amount: 120000 },
            { year: '2022', amount: 150000 },
            { year: '2023', amount: 180000 },
            { year: '2024', amount: 171500 }
          ];

          const currentDate = new Date();
          processedData = dummyCampaigns.map(campaign => ({
            campaign: campaign.title,
            amount: campaign.amount,
            date: currentDate,
            month: format(currentDate, 'MMM'),
            year: currentDate.getFullYear().toString()
          }));

          // Apply dummy data based on sort option
          let groupedData;
          if (sortBy === 'campaign') {
            groupedData = dummyCampaigns.reduce((acc, curr) => {
              acc[curr.title] = curr.amount;
              return acc;
            }, {});
          } else if (sortBy === 'month') {
            groupedData = dummyMonthlyData.reduce((acc, curr) => {
              acc[curr.month] = curr.amount;
              return acc;
            }, {});
          } else if (sortBy === 'year') {
            groupedData = dummyYearlyData.reduce((acc, curr) => {
              acc[curr.year] = curr.amount;
              return acc;
            }, {});
          }

          // Convert to chart data format
          const chartData = Object.entries(groupedData || {}).map(([name, value]) => ({
            name,
            amount: value
          }));

          setPaymentData(chartData);
          return;
        }

        // Process real data if available
        processedData = campaignDonations.map((donation: any) => ({
          ...donation,
          campaign: userCampaigns.find((c: Campaign) => c.id === donation.campaign_id)?.title || 'Unknown Campaign',
          date: new Date(donation.created_at),
          month: format(new Date(donation.created_at), 'MMM'),
          year: new Date(donation.created_at).getFullYear().toString()
        }));

        // Apply time filter
        if (timeFilter === 'year') {
          processedData = processedData.filter(d => d.year === selectedYear);
        } else if (timeFilter === 'month') {
          processedData = processedData.filter(
            d => d.year === selectedYear && d.month === selectedMonth
          );
        }

        // Group and aggregate data based on sort option
        let groupedData;
        if (sortBy === 'campaign') {
          groupedData = processedData.reduce((acc: any, curr: any) => {
            const key = curr.campaign;
            if (!acc[key]) acc[key] = 0;
            acc[key] += curr.amount;
            return acc;
          }, {});
        } else if (sortBy === 'month') {
          groupedData = processedData.reduce((acc: any, curr: any) => {
            const key = curr.month;
            if (!acc[key]) acc[key] = 0;
            acc[key] += curr.amount;
            return acc;
          }, {});
        } else if (sortBy === 'year') {
          groupedData = processedData.reduce((acc: any, curr: any) => {
            const key = curr.year;
            if (!acc[key]) acc[key] = 0;
            acc[key] += curr.amount;
            return acc;
          }, {});
        }

        // Convert to chart data format
        const chartData = Object.entries(groupedData || {}).map(([name, value]) => ({
          name,
          amount: value
        }));

        setPaymentData(chartData);
      } catch (error) {
        console.error('Error processing payment data:', error);
      }
    };

    if (user) {
      fetchPaymentData();
    }
  }, [user, sortBy, timeFilter, selectedYear, selectedMonth]);
  
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
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
      localStorage.setItem('user', JSON.stringify({
        ...user,
        full_name: profileForm.fullName,
        address: profileForm.address,
        post_code: profileForm.postCode,
        country: profileForm.country
      }));
      
      // Update email if changed
      if (profileForm.email !== user.email) {
        localStorage.setItem('user', JSON.stringify({
          ...user,
          email: profileForm.email
        }));
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      
      // Refresh profile data
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(updatedUser);
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
        localStorage.setItem('user', JSON.stringify({
          ...user,
          payment_methods: user.payment_methods.map((pm: any) => ({
            ...pm,
            is_default: false
          }))
        }));
      }
      
      // Insert new payment method
      const updatedUser = {
        ...user,
        payment_methods: [
          ...user.payment_methods,
          {
            card_type: newPaymentMethod.cardType,
            last_four: last4,
            expiry_month: parseInt(newPaymentMethod.expiryMonth),
            expiry_year: parseInt(newPaymentMethod.expiryYear),
            is_default: newPaymentMethod.isDefault || user.payment_methods.length === 0 // First card is automatically default
          }
        ]
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
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
      
      // Update state
      setUser(updatedUser);
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
      const updatedUser = {
        ...user,
        payment_methods: user.payment_methods.filter((pm: any) => pm.id !== id)
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Payment method removed",
        description: "Your payment method has been removed successfully."
      });
      
      // Update state
      setUser(updatedUser);
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
      const updatedUser = {
        ...user,
        payment_methods: user.payment_methods.map((pm: any) => ({
          ...pm,
          is_default: false
        }))
      };
      
      // Set the selected one to true
      const selectedPaymentMethod = updatedUser.payment_methods.find((pm: any) => pm.id === id);
      if (selectedPaymentMethod) {
        selectedPaymentMethod.is_default = true;
      }
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been updated successfully."
      });
      
      // Update state
      setUser(updatedUser);
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
          <Tabs defaultValue={defaultTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
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
                      Across {donations.length} donations
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
                      Across {campaigns.length} campaigns
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
                      {activeCampaigns}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Out of {campaigns.length} total campaigns
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
                      onClick={() => navigate('/dashboard?tab=settings')}
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
                          <div className="font-medium">{profile?.full_name || user?.email}</div>
                          <div className="text-sm text-muted-foreground">{user?.email}</div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Member since {format(new Date(profile?.created_at || user?.created_at || Date.now()), 'MMMM yyyy')}
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
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">My Campaigns</h2>
                  <p className="text-muted-foreground">
                    Manage and track all your created campaigns
                  </p>
                </div>
                <Button onClick={() => navigate('/create-campaign')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>

              <div className="grid gap-4">
                {userCampaigns.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className="text-center space-y-3">
                        <h3 className="text-lg font-medium">No campaigns yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Start your first campaign and make a difference!
                        </p>
                        <Button onClick={() => navigate('/create-campaign')}>
                          Create Your First Campaign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  userCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4">
                          <div className="w-48 h-32">
                            <img
                              src={campaign.image_url || "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"}
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{campaign.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {campaign.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-primary font-medium">
                                    ${campaign.current_amount.toLocaleString()}
                                  </span>
                                  <span className="text-muted-foreground">
                                    raised of ${campaign.goal.toLocaleString()}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {campaign.donor_count} donors
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/campaign/${campaign.id}/edit`)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => navigate(`/campaign/${campaign.id}`)}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            {/* My Donations Tab */}
            <TabsContent value="donations" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">My Donations</h2>
              
              {donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => {
                    return (
                      <Card key={donation.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="font-medium mb-1">
                                Donated to{' '}
                                <span className="font-semibold">{donation.campaigns?.title || 'a campaign'}</span>
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>{format(new Date(donation.created_at), 'MMMM d, yyyy')}</span>
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
                                onClick={() => navigate(`/campaign/${donation.campaign_id}`)}
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
            
            {/* Add Payments tab content */}
            <TabsContent value="payments" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Campaign Payments</h2>
                  <p className="text-muted-foreground">
                    Track and analyze payments received for your campaigns
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Analytics</CardTitle>
                  <CardDescription>
                    Visualize payment data across your campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="space-y-2">
                        <Label>Sort By</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select sort option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="campaign">Campaign</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="year">Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Time Period</Label>
                        <Select value={timeFilter} onValueChange={setTimeFilter}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="year">Specific Year</SelectItem>
                            <SelectItem value="month">Specific Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {timeFilter !== 'all' && (
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {timeFilter === 'month' && (
                        <div className="space-y-2">
                          <Label>Month</Label>
                          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <div className="h-[400px] mt-6">
                      {paymentData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={paymentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={70}
                              interval={0}
                            />
                            <YAxis />
                            <Tooltip 
                              formatter={(value: any) => [`$${value}`, 'Amount']}
                            />
                            <Legend />
                            <Bar 
                              dataKey="amount" 
                              fill="#2563eb" 
                              name="Payment Amount" 
                            />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No payment data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Keep existing payment methods section */}
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
            </TabsContent>
            
            {/* Account Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
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
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
