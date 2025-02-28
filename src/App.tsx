import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import CampaignCreationWizard from "./pages/CampaignCreationWizard";
import CampaignDetails from "./pages/CampaignDetails";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import HowItWorks from "./pages/HowItWorks";
import Search from "./pages/Search";

const queryClient = new QueryClient();

const App = () => {
  const [isReady, setIsReady] = useState(false);

  // Check auth state on load
  useEffect(() => {
    const initialize = () => {
      try {
        // Check for existing token and user data
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        // Store authentication status in localStorage
        localStorage.setItem('isLoggedIn', token && userData ? 'true' : 'false');
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsReady(true);
      }
    };

    initialize();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        localStorage.setItem('isLoggedIn', token && userData ? 'true' : 'false');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CampaignCreationWizard />} />
            <Route path="/campaign/:id" element={<CampaignDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/search" element={<Search />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
