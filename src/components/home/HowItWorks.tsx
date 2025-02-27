
import React from 'react';
import { CheckCircle2, Lightbulb, TrendingUp, Users } from 'lucide-react';

const steps = [
  {
    title: 'Create a Campaign',
    description: 'Set your funding goal, tell your story, and add compelling images or videos.',
    icon: Lightbulb,
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Share with Your Network',
    description: 'Spread the word using our built-in social tools and reach potential supporters.',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Get AI-Powered Insights',
    description: 'Receive smart suggestions to optimize your campaign performance.',
    icon: TrendingUp,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Achieve Your Goals',
    description: 'Track your progress, engage with donors, and bring your vision to life.',
    icon: CheckCircle2,
    color: 'bg-green-50 text-green-600',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight">How CrowdBuilder Works</h2>
          <p className="text-muted-foreground mt-4">
            Our intuitive platform makes it easy to create, share, and manage successful crowdfunding campaigns.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all duration-300 hover:shadow-lg"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${step.color} mb-5`}>
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-0.5 bg-border">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-45 w-2 h-2 border-t border-r border-border"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
