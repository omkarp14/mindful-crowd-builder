import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-background/10 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="flex flex-col items-start space-y-4">
              <img 
                src="/src/assets/images/hivefund-logo.svg" 
                alt="HiveFund Logo" 
                className="h-16 w-16 mb-4"
              />
              <div className="inline-block bg-primary/10 rounded-full px-3 py-1 text-sm font-medium text-primary">
                Empowering Change
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight">
                Fund the future, <br />
                <span className="text-primary">one vision at a time</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                HiveFund connects visionaries with supporters. Create meaningful campaigns, engage with donors, and make your ideas a reality.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/create">
                  Start a Campaign
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/explore">
                  Explore Campaigns
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">$25M+</span>
                <span className="text-sm text-muted-foreground">Funds Raised</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">5K+</span>
                <span className="text-sm text-muted-foreground">Campaigns</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">150K+</span>
                <span className="text-sm text-muted-foreground">Supporters</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[500px] animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/src/assets/images/hivefund-logo.svg" 
                alt="HiveFund Large Logo" 
                className="w-64 h-64 animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 