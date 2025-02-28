
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "HiveFund helped me raise 150% of my goal in just 3 weeks. The AI suggestions were incredibly helpful for optimizing my campaign strategy.",
    author: "Alex Rivera",
    title: "Tech for Education Campaign",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    quote: "The social sharing tools made it easy to spread the word about my environmental campaign. We ended up with supporters from across the globe!",
    author: "Jamie Chen",
    title: "Clean Ocean Initiative",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
  },
  {
    quote: "As a small business owner, I was able to fund my new product launch without taking on debt. The platform is intuitive and the support team is fantastic.",
    author: "Marcus Johnson",
    title: "Sustainable Products Startup",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
];

const TestimonialSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Success Stories</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Hear from people who have achieved their goals using HiveFund's platform.
          </p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card border-none shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-2 h-48 md:h-auto">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:col-span-3 p-8 flex flex-col justify-center relative">
                          <Quote className="absolute top-6 left-6 h-10 w-10 text-primary/10" />
                          <blockquote className="text-lg font-medium mt-4 mb-6 relative z-10">
                            "{testimonial.quote}"
                          </blockquote>
                          <div>
                            <p className="font-semibold">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation controls */}
          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-primary' : 'bg-primary/20'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
