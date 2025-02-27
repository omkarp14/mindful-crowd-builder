import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Sparkles, UploadCloud, Wand2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Popular Campaign Categories
const campaignCategories = [
  { value: "animals", label: "Animals & Pets" },
  { value: "medical", label: "Medical & Health" },
  { value: "education", label: "Education" },
  { value: "environment", label: "Environment" },
  { value: "community", label: "Community & Neighbors" },
  { value: "emergency", label: "Emergency Relief" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "memorial", label: "Memorial & Funeral" },
  { value: "sports", label: "Sports & Teams" },
  { value: "creative", label: "Creative & Arts" },
];

// Campaign Beneficiary Types
const beneficiaryTypes = [
  { value: "self", label: "Myself" },
  { value: "someone_else", label: "Someone else" },
  { value: "charity", label: "A charity or organization" },
];

// Define the campaign schema
const campaignSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  goal: z.string().min(1, "Goal amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 
    "Goal must be a positive number"
  ),
  beneficiaryType: z.string().min(1, "Please select who you're raising funds for"),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000, "Description must be less than 5000 characters"),
  deadline: z.date({
    required_error: "Please select a deadline",
  }).refine((date) => date > new Date(), {
    message: "Deadline must be in the future",
  }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const StartCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    // Simulate auth check - in a real app, you would check your auth state here
    const checkAuth = () => {
      const isAuth = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(isAuth);
      
      if (!isAuth && currentStep > 1) {
        setIsLoginOpen(true);
      }
    };
    
    checkAuth();
  }, [currentStep]);
  
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      category: "",
      goal: "",
      beneficiaryType: "",
      description: ""
    },
  });
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    localStorage.setItem('isLoggedIn', 'true');
  };
  
  const nextStep = () => {
    if (currentStep === 1) {
      form.trigger(['goal', 'category']);
      
      if (form.formState.errors.goal || form.formState.errors.category) {
        return;
      }
      
      if (!isLoggedIn) {
        setIsLoginOpen(true);
        return;
      }
    } else if (currentStep === 2) {
      form.trigger(['beneficiaryType', 'title', 'description']);
      
      if (form.formState.errors.beneficiaryType || 
          form.formState.errors.title || 
          form.formState.errors.description) {
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const enhanceWithAI = async () => {
    const description = form.getValues('description');
    
    if (!description || description.length < 20) {
      toast.error("Please enter a longer description first", {
        description: "Your description should be at least 20 characters to enhance."
      });
      return;
    }
    
    setIsEnhancing(true);
    
    try {
      // Simulate AI enhancement delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const enhancedDescription = `${description}\n\nEvery contribution to this campaign makes a real, tangible difference. Your support helps us achieve our goals faster and creates a positive impact that benefits everyone involved. Join us in making this vision a reality - together, we can accomplish amazing things!`;
      
      form.setValue('description', enhancedDescription);
      
      toast.success("Description enhanced!", {
        description: "Your campaign description has been enhanced with AI."
      });
    } catch (error) {
      toast.error("Enhancement failed", {
        description: "There was an error enhancing your description. Please try again."
      });
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const onSubmit = async (values: CampaignFormValues) => {
    if (currentStep < totalSteps) {
      nextStep();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Campaign values:", { ...values, image: imagePreview });
      
      // Show success message
      toast.success("Campaign created successfully!", {
        description: "Your campaign has been created and is now live.",
      });
      
      // Redirect to campaign page (mock ID for demonstration)
      navigate("/campaign/new-campaign-123");
      
    } catch (error) {
      console.error("Campaign creation error:", error);
      toast.error("Campaign creation failed", {
        description: "There was an error creating your campaign. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Let's start with the basics</h2>
              <p className="text-muted-foreground">
                Set your funding goal and select a category for your campaign.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How much do you want to raise?</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <Input 
                        placeholder="5000"
                        className="pl-7"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set a realistic goal. You can always raise more!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are you raising funds for?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {campaignCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best describes your campaign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Campaign Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Choose when your campaign will end. Campaigns typically run for 30-60 days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Tell us about your campaign</h2>
              <p className="text-muted-foreground">
                Provide details about your campaign and who it's for.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="beneficiaryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who are you raising funds for?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select who you're raising for" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {beneficiaryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a clear, attention-grabbing title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the first thing people will see. Make it catchy and memorable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Description</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your campaign in detail. What is it for? Why is it important? How will the funds be used?"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      size="sm"
                      className="absolute right-3 bottom-3"
                      onClick={enhanceWithAI}
                      disabled={isEnhancing}
                    >
                      {isEnhancing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Enhance with AI
                        </>
                      )}
                    </Button>
                  </div>
                  <FormDescription>
                    Be specific and compelling. Tell your story and explain why people should support your cause.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Add a campaign image</h2>
              <p className="text-muted-foreground">
                Campaigns with images raise up to 2x more than those without.
              </p>
            </div>
            
            <div>
              <FormLabel htmlFor="campaign-image">Campaign Image</FormLabel>
              <div className="mt-2">
                <div className="border-2 border-dashed border-input rounded-lg p-6 flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="space-y-4 w-full">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <img 
                          src={imagePreview} 
                          alt="Campaign preview" 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setImagePreview(null)}
                      >
                        Remove image
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                      <UploadCloud className="h-10 w-10 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Drag and drop an image, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          High-quality images increase campaign success by 35%
                        </p>
                      </div>
                      <Input
                        id="campaign-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("campaign-image")?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <FormDescription>
                  Upload a high-quality image that represents your campaign. Landscape orientation (16:9) works best.
                </FormDescription>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-medium mb-2">Review your campaign</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal:</span>
                  <span className="font-medium">${form.getValues('goal')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">
                    {campaignCategories.find(c => c.value === form.getValues('category'))?.label || form.getValues('category')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Beneficiary:</span>
                  <span className="font-medium">
                    {beneficiaryTypes.find(b => b.value === form.getValues('beneficiaryType'))?.label || form.getValues('beneficiaryType')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium truncate max-w-[60%]">{form.getValues('title')}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Login Dialog */}
      {isLoginOpen && (
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Sign in required</DialogTitle>
              <DialogDescription className="text-center">
                You need to be logged in to create a campaign.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <Button onClick={() => navigate('/login', { state: { from: '/create' } })}>
                Go to login
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                size="sm"
              >
                Cancel
              </Button>
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                <div
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {renderStepContent()}
                  
                  <div className="flex justify-between pt-4">
                    {currentStep > 1 ? (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={prevStep}
                      >
                        Back
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {currentStep === totalSteps ? "Creating..." : "Saving..."}
                        </>
                      ) : (
                        currentStep === totalSteps ? "Launch Campaign" : "Continue"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartCampaignPage; 