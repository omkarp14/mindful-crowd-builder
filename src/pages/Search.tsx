
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CampaignGrid from '@/components/campaign/CampaignGrid';
import { getAllCampaigns } from '@/data/mockData';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Get all campaigns
  const allCampaigns = getAllCampaigns();
  
  // Popular search terms
  const popularSearches = [
    "Medical", "Animals", "Education", "Environment", 
    "Community", "Children", "Emergency", "Wildlife"
  ];
  
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Filter campaigns based on search term
    const results = allCampaigns.filter(campaign => {
      const matchesTitle = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDescription = campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = campaign.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTitle || matchesDescription || matchesCategory;
    });
    
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
  };
  
  const handlePopularSearch = (term: string) => {
    setSearchTerm(term);
    // Use setTimeout to ensure the state update happens before the search
    setTimeout(() => handleSearch(), 0);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Hero */}
          <div className="py-8 md:py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Campaigns</h1>
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search campaigns..."
                  className="pl-10 pr-10 py-6 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={handleClearSearch}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
                <Button type="submit" className="hidden">Search</Button>
              </form>
            </div>
          </div>
          
          {hasSearched ? (
            /* Search Results */
            <div className="py-4">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  Search Results for "{searchTerm}"
                </h2>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Found {searchResults.length} matching campaigns
                  </p>
                  <Button variant="link" onClick={handleClearSearch}>
                    Clear Search
                  </Button>
                </div>
              </div>
              
              {searchResults.length > 0 ? (
                <CampaignGrid campaigns={searchResults} />
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-6">
                      We couldn't find any campaigns matching "{searchTerm}".
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <Button onClick={handleClearSearch}>Try Another Search</Button>
                      <Button variant="outline" onClick={() => navigate('/explore')}>
                        Browse All Campaigns
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Default Search Page Content */
            <div className="py-8">
              <Tabs defaultValue="popular">
                <div className="flex justify-center mb-6">
                  <TabsList>
                    <TabsTrigger value="popular">Popular Searches</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="popular">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {popularSearches.map((term) => (
                      <Card 
                        key={term} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handlePopularSearch(term)}
                      >
                        <CardContent className="p-6 text-center">
                          <h3 className="font-medium">{term}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="categories">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[
                      "Animals & Pets", "Medical & Health", "Education", 
                      "Environment", "Community", "Emergency Relief", 
                      "Nonprofit", "Memorial", "Sports & Teams", "Creative & Arts"
                    ].map((category) => (
                      <Card 
                        key={category} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handlePopularSearch(category.split(' ')[0])}
                      >
                        <CardContent className="p-6 text-center">
                          <h3 className="font-medium">{category}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="trending">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {allCampaigns.slice(0, 6).map((campaign) => (
                      <Card 
                        key={campaign.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigate(`/campaign/${campaign.id}`)}
                      >
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={campaign.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=300&h=200&q=80"}
                            alt={campaign.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium truncate">{campaign.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {campaign.description.substring(0, 100)}...
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
