import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Search, User, PlusSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/assets/Logo.png';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="HiveFund" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-sm font-medium hover:text-primary transition-colors underline-animation"
              >
                Home
              </Link>
              <Link 
                to="/explore" 
                className="text-sm font-medium hover:text-primary transition-colors underline-animation"
              >
                Explore
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-sm font-medium hover:text-primary transition-colors underline-animation"
              >
                How It Works
              </Link>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium hover:text-primary transition-colors underline-animation"
              >
                Dashboard
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="hidden md:flex"
            >
              <Link to="/search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="sm"
              className="hidden md:flex"
            >
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button 
              asChild 
              size="sm"
            >
              <Link to="/create">
                <PlusSquare className="h-4 w-4 mr-2" />
                Start Campaign
              </Link>
            </Button>

            {/* Mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden glass-dark animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-3 rounded-md text-base font-medium hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-3" />
                Home
              </div>
            </Link>
            <Link 
              to="/explore" 
              className="block px-3 py-3 rounded-md text-base font-medium hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Search className="h-5 w-5 mr-3" />
                Explore
              </div>
            </Link>
            <Link 
              to="/how-it-works" 
              className="block px-3 py-3 rounded-md text-base font-medium hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <PlusSquare className="h-5 w-5 mr-3" />
                How It Works
              </div>
            </Link>
            <Link 
              to="/dashboard" 
              className="block px-3 py-3 rounded-md text-base font-medium hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3" />
                Dashboard
              </div>
            </Link>
            <Link
              to="/login"
              className="block px-3 py-3 rounded-md text-base font-medium hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3" />
                Login
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
