import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from 'lucide-react';
import { ProgressCircle } from "@/components/ui/progress-circle";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getUserData, getAllCampaigns } from '@/data/mockData';
import { Campaign, Donation } from '@/types';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
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
          <Tabs defaultValue="overview" className="space-y-4">
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
                      Across {userDonations.length} donations
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
                      Across {userCampaigns.length} campaigns
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
                      {userCampaigns.filter(c => c.isActive).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Out of {userCampaigns.length} total campaigns
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
                          <div className="font-medium">{userData?.name || "John Doe"}</div>
                          <div className="text-sm text-muted-foreground">{userData?.email || "john.doe@example.com"}</div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Member since {format(new Date(userData?.createdAt || Date.now()), 'MMMM yyyy')}
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
              
              {userCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {userCampaigns.map((campaign: Campaign) => {
                    const percentFunded = Math.min(Math.round((campaign.currentAmount / campaign.goal) * 100), 100);
                    const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                    
                    return (
                      <Card key={campaign.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/4 aspect-video md:aspect-square relative">
                            <img 
                              src={campaign.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=300&h=300&q=80"}
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
                                <span>Created on {format(new Date(campaign.createdAt), 'MMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>{daysLeft} days left</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center justify-center">
                              <ProgressCircle 
                                value={campaign.currentAmount} 
                                max={campaign.goal} 
                                size={80}
                                showLabel={true}
                              />
                              <div className="mt-2 text-center">
                                <div className="text-sm font-medium">${campaign.currentAmount} raised</div>
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
              
              {userDonations.length > 0 ? (
                <div className="space-y-4">
                  {userDonations.map((donation: Donation) => {
                    const campaign = allCampaigns.find(c => c.id === donation.campaignId);
                    return (
                      <Card key={donation.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="font-medium mb-1">
                                Donated to{' '}
                                <span className="font-semibold">{campaign?.title}</span>
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>{format(new Date(donation.createdAt), 'MMMM d, yyyy')}</span>
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
                                onClick={() => navigate(`/campaign/${donation.campaignId}`)}
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
                    </Button>
                  </div>
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