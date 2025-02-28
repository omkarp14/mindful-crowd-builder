
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
            <div>
              <div className="inline-block bg-primary/10 rounded-full px-3 py-1 text-sm font-medium text-primary mb-4">
                Empowering Change
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight">
                Fund the future, <br />
                <span className="text-primary">one vision at a time</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                CrowdBuilder connects visionaries with supporters. Create meaningful campaigns, engage with donors, and make your ideas a reality.
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
            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80" 
                alt="People collaborating" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="glass p-4 rounded-xl shadow-soft max-w-md">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80" 
                        alt="User avatar" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Sarah's Clean Water Initiative</h3>
                      <p className="text-xs text-muted-foreground">Just reached 75% of goal</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-secondary/70 rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>$37,500 raised</span>
                    <span>75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
