
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CampaignGrid from '@/components/campaign/CampaignGrid';
import { getAllCampaigns } from '@/data/mockData';

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [fundingRange, setFundingRange] = useState([0, 100]);
  
  // Get all campaigns
  const allCampaigns = getAllCampaigns();
  
  // Filter campaigns based on search term and filters
  const filteredCampaigns = allCampaigns.filter(campaign => {
    // Filter by search term
    const matchesSearch = 
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = category === 'all' || campaign.category === category;
    
    // Filter by funding percentage
    const fundingPercentage = (campaign.currentAmount / campaign.goal) * 100;
    const matchesFunding = 
      fundingPercentage >= fundingRange[0] && 
      fundingPercentage <= fundingRange[1];
    
    return matchesSearch && matchesCategory && matchesFunding;
  });
  
  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most-funded':
        return b.currentAmount - a.currentAmount;
      case 'least-funded':
        return a.currentAmount - b.currentAmount;
      case 'ending-soon':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default:
        return 0;
    }
  });
  
  // Get unique categories from all campaigns and ensure they're strings
  const categories = ['all', ...new Set(allCampaigns.map(campaign => campaign.category))] as string[];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          <div className="py-8 md:py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Campaigns</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover and support campaigns that matter to you. From environmental causes to medical needs,
              find something that resonates with your values.
            </p>
          </div>
          
          {/* Search and filter section */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="most-funded">Most Funded</SelectItem>
                    <SelectItem value="least-funded">Least Funded</SelectItem>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Funding Progress (%)</label>
                <Slider
                  defaultValue={[0, 100]}
                  min={0}
                  max={100}
                  step={1}
                  value={fundingRange}
                  onValueChange={setFundingRange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{fundingRange[0]}%</span>
                  <span>{fundingRange[1]}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {category !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Category: {category}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setCategory('all')}
                  >
                    ✕
                  </Button>
                </Badge>
              )}
              
              {searchTerm && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </Button>
                </Badge>
              )}
              
              {(fundingRange[0] > 0 || fundingRange[1] < 100) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Funding: {fundingRange[0]}% - {fundingRange[1]}%
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setFundingRange([0, 100])}
                  >
                    ✕
                  </Button>
                </Badge>
              )}
              
              {(category !== 'all' || searchTerm || fundingRange[0] > 0 || fundingRange[1] < 100) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    setCategory('all');
                    setSearchTerm('');
                    setFundingRange([0, 100]);
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Results count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{sortedCampaigns.length}</span> campaigns
            </p>
          </div>
          
          {/* Campaign grid */}
          {sortedCampaigns.length > 0 ? (
            <CampaignGrid campaigns={sortedCampaigns} />
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button 
                onClick={() => {
                  setCategory('all');
                  setSearchTerm('');
                  setFundingRange([0, 100]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
