
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const campaignSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(50, "Description must be at least 50 characters").max(5000, "Description must be less than 5000 characters"),
  category: z.string().min(1, "Please select a category"),
  goal: z.string().min(1, "Goal amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 
    "Goal must be a positive number"
  ),
  deadline: z.date({
    required_error: "Please select a deadline",
  }).refine((date) => date > new Date(), {
    message: "Deadline must be in the future",
  }),
});

const CampaignCreationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      goal: "",
    },
  });

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

  const onSubmit = async (values: z.infer<typeof campaignSchema>) => {
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

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Campaign Details</h2>
                  <p className="text-muted-foreground">
                    Provide the essential information about your campaign.
                  </p>
                </div>
                
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
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your campaign in detail. What is it for? Why is it important? How will the funds be used?"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific and compelling. Tell your story and explain why people should support your cause.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Environment">Environment</SelectItem>
                            <SelectItem value="Health">Health</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Arts">Arts</SelectItem>
                            <SelectItem value="Community">Community</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Wildlife">Wildlife</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the category that best fits your campaign.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Goal ($)</FormLabel>
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
                          Set a realistic, achievable goal for your campaign.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
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
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Campaign...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CampaignCreationForm;
