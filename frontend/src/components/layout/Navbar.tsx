import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Search, User, PlusSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { theme } from '@/styles/theme';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white" style={{ fontFamily: theme.fonts.primary }}>
      <div 
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${theme.colors.honeyGold}, ${theme.colors.forestGreen})` }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/src/assets/images/hivefund-logo.svg"
                alt="HiveFund Logo" 
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              {['Home', 'Explore', 'How It Works', 'Dashboard'].map((item) => (
                <Link 
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[${theme.colors.honeyGold}]`}
                  style={{ color: theme.colors.deepNavy }}
                >
                  {item}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className={`hidden md:flex items-center rounded-full px-4 py-2 transition-all duration-200 hover:text-[${theme.colors.honeyGold}]`}
              style={{ color: theme.colors.deepNavy }}
            >
              <Link to="/search" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="sm"
              className={`hidden md:flex items-center rounded-full px-4 py-2 transition-all duration-200 hover:bg-[${theme.colors.forestGreen}] hover:text-white`}
              style={{
                borderColor: theme.colors.forestGreen,
                color: theme.colors.forestGreen
              }}
            >
              <Link to="/login" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button 
              asChild 
              size="sm"
              className={`flex items-center rounded-full px-4 py-2 transition-all duration-200 hover:scale-105 hover:bg-[${theme.buttons.primary.hover}]`}
              style={{
                backgroundColor: theme.colors.forestGreen,
                color: theme.colors.white
              }}
            >
              <Link to="/create" className="flex items-center">
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
                className="rounded-full transition-all duration-200"
                style={{ color: theme.colors.deepNavy }}
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
        <div 
          className="md:hidden border-t shadow-lg animate-in slide-in-from-top duration-300"
          style={{ backgroundColor: theme.colors.white }}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {[
              { name: 'Home', icon: Home },
              { name: 'Explore', icon: Search },
              { name: 'How It Works', icon: PlusSquare },
              { name: 'Dashboard', icon: User },
              { name: 'Login', icon: User }
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.name === 'Home' ? '/' : `/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`block px-3 py-3 rounded-lg transition-all duration-200 hover:bg-[${theme.colors.softCream}]`}
                style={{ color: theme.colors.deepNavy }}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 