
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Search, 
  Users, 
  Heart, 
  Lightbulb, 
  RefreshCw, 
  Shield, 
  Clock, 
  Check, 
  BarChart 
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How CrowdBuilder Works</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              CrowdBuilder makes it easy to raise money for the causes that matter to you. 
              Whether you're fundraising for yourself, a loved one, or a charitable organization,
              we're here to help you succeed.
            </p>
          </div>
        </section>
        
        {/* Steps Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Three Simple Steps</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Start Your Campaign</h3>
                <p className="text-muted-foreground">
                  Create your campaign in minutes. Set a funding goal, deadline, and share your story.
                  Our AI tools can help you craft the perfect campaign description.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Share With Everyone</h3>
                <p className="text-muted-foreground">
                  Share your campaign with friends, family, and your community through social media, 
                  email, and text messages. The more people who see your campaign, the better.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Receive Donations</h3>
                <p className="text-muted-foreground">
                  Watch donations come in and thank your supporters. Funds are transferred directly 
                  to your account, making it easy to access the money you raise.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose CrowdBuilder?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Benefit 1 */}
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fast and Easy Setup</h3>
                <p className="text-muted-foreground">
                  Create your campaign in minutes with our intuitive platform. No technical skills required.
                </p>
              </div>
              
              {/* Benefit 2 */}
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure Transactions</h3>
                <p className="text-muted-foreground">
                  All donations are processed securely, and your data is protected with enterprise-grade security.
                </p>
              </div>
              
              {/* Benefit 3 */}
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <RefreshCw className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
                <p className="text-muted-foreground">
                  Keep your supporters engaged with real-time campaign updates and progress tracking.
                </p>
              </div>
              
              {/* Benefit 4 */}
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <BarChart className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Powerful Analytics</h3>
                <p className="text-muted-foreground">
                  Track your campaign's performance with detailed analytics and donor insights.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">How much does it cost to use CrowdBuilder?</h3>
                <p className="text-muted-foreground">
                  CrowdBuilder charges a small platform fee of 2.9% + $0.30 per donation. This covers payment processing,
                  platform maintenance, and customer support. There are no hidden fees or monthly charges.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">How long does it take to receive funds?</h3>
                <p className="text-muted-foreground">
                  Funds are typically transferred to your account within 2-5 business days after a donation is made.
                  You can set up automatic transfers or manually withdraw funds at any time.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Can I create a campaign for someone else?</h3>
                <p className="text-muted-foreground">
                  Yes, you can create campaigns for yourself, someone else, or a charitable organization.
                  Just make sure you have permission when fundraising on behalf of others.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">What if I don't reach my goal?</h3>
                <p className="text-muted-foreground">
                  No problem! CrowdBuilder uses a "keep what you raise" model, which means you keep all donations
                  even if you don't reach your goal. You can also extend your campaign deadline if needed.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">How do I withdraw my funds?</h3>
                <p className="text-muted-foreground">
                  You can withdraw your funds directly to your bank account at any time from your dashboard.
                  Just add your banking information, and you're good to go.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Campaign?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join thousands of successful fundraisers who have used CrowdBuilder to raise millions of dollars
              for causes they care about.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/create">Start a Campaign</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/explore">Explore Campaigns</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
