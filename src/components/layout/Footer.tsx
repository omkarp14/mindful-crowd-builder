
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">HiveFund</h3>
            <p className="text-muted-foreground text-sm">
              Empowering change-makers through innovative crowdfunding solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Browse Campaigns
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Start a Campaign
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-muted text-center">
          <p className="text-muted-foreground text-sm flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-destructive" /> by HiveFund Team &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
