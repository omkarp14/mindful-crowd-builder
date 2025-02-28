import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  Upload,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SuggestionGenerator from '@/components/ai/SuggestionGenerator';

interface FormData {
  title: string;
  description: string;
  category: string;
  goal: string;
  deadline: Date | null;
  beneficiaryType: string;
  customBeneficiary: string;
  tags: string[];
  newTag: string;
  image: File | null;
  imageUrl: string;
  termsAccepted: boolean;
}

const CampaignCreationWizard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    goal: '',
    deadline: null,
    beneficiaryType: 'myself',
    customBeneficiary: '',
    tags: [],
    newTag: '',
    image: null,
    imageUrl: '',
    termsAccepted: false,
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        navigate('/login', { state: { from: '/create' } });
        return;
      }
      setUser(JSON.parse(userData));
    };
    
    checkUser();
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() !== '' && !formData.tags.includes(formData.newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: '',
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imageUrl: '',
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      deadline: date || null,
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title.length > 0 && 
               formData.description.length > 0 && 
               formData.category.length > 0;
      case 2:
        return formData.goal.length > 0 && 
               formData.deadline !== null && 
               formData.beneficiaryType.length > 0 &&
               (formData.beneficiaryType !== 'other' || formData.customBeneficiary.length > 0);
      case 3:
        // Step 3 is optional (tags and image)
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    
    if (!formData.termsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to create your campaign.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a campaign.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: '/create' } });
      return;
    }
    
    setLoading(true);
    
    try {
      const now = new Date();
      // Prepare data in the exact format needed by the API
      const campaignData = {
        id: `campaign_${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.toLowerCase(),
        goal: parseInt(formData.goal) || 0,
        deadline: formData.deadline ? formData.deadline.toISOString() : now.toISOString(),
        beneficiary_type: formData.beneficiaryType,
        image_url: formData.image ? formData.image.name : "",
        tags: formData.tags || [],
        created_by: user.email,
        created_at: now.toISOString(),
        status: "draft",
        current_amount: 0,
        donor_count: 0
      };

      // Log the exact JSON being sent to the API
      console.log('Exact JSON being sent to API:', JSON.stringify(campaignData, null, 2));

      // Send to API
      const response = await fetch('http://127.0.0.1:8000/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.detail || 'Failed to create campaign');
      }

      const data = await response.json();
      console.log('API Success Response:', data);
      
      // Store campaign data in localStorage with the campaign data itself
      const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      const newCampaign = {
        ...campaignData,
        id: campaignData.id // Use the generated ID since we're creating it
      };
      storedCampaigns.push(newCampaign);
      localStorage.setItem('campaigns', JSON.stringify(storedCampaigns));
      
      toast({
        title: "Campaign created!",
        description: "Your campaign has been created successfully.",
      });
      
      // Navigate to the campaign page using the campaign ID we generated
      navigate(`/campaign/${campaignData.id}`);
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Failed to create campaign",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Medical",
    "Education",
    "Emergency",
    "Environment",
    "Community",
    "Business",
    "Creative",
    "Animals",
    "Family",
    "Sports",
    "Technology",
    "Other"
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Campaign Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your campaign a clear, attention-grabbing title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">
                Campaign Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your campaign and why people should support it"
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goal">
                Funding Goal ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="goal"
                name="goal"
                type="number"
                min="1"
                step="1"
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="How much do you need to raise?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>
                Campaign End Date <span className="text-red-500">*</span>
              </Label>
              <div className="grid gap-2">
                <DatePicker
                  selected={formData.deadline}
                  onSelect={handleDateChange}
                  minDate={new Date()}
                  maxDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)} // Max 1 year from now
                  placeholder="Select campaign end date"
                  className="w-full"
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <p>Most successful campaigns run for 30-60 days</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>
                Who is this campaign for? <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.beneficiaryType}
                onValueChange={(value) => handleRadioChange('beneficiaryType', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="myself" id="myself" />
                  <Label htmlFor="myself">Myself</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="someone-else" id="someone-else" />
                  <Label htmlFor="someone-else">Someone else</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="charity" id="charity" />
                  <Label htmlFor="charity">A charity or nonprofit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
              
              {formData.beneficiaryType === 'other' && (
                <div className="mt-2">
                  <Input
                    id="customBeneficiary"
                    name="customBeneficiary"
                    value={formData.customBeneficiary}
                    onChange={handleInputChange}
                    placeholder="Please specify"
                    required
                  />
                </div>
              )}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="newTag"
                  name="newTag"
                  value={formData.newTag}
                  onChange={handleInputChange}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Campaign Image (Optional)</Label>
              {!formData.image ? (
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload a compelling image for your campaign
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="mt-4"
                  >
                    Select Image
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative border rounded-md overflow-hidden">
                  <img 
                    src={formData.imageUrl} 
                    alt="Campaign preview" 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="absolute top-2 right-2">
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms" 
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => 
                    setFormData((prev) => ({ 
                      ...prev, 
                      termsAccepted: checked === true 
                    }))
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the <Button variant="link" className="h-auto p-0">Terms and Conditions</Button> and <Button variant="link" className="h-auto p-0">Privacy Policy</Button>. I confirm that I am raising funds for a lawful purpose and acknowledge that all donations are subject to a 5% platform fee.
                </Label>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!user) {
    return null; // Don't render anything while checking auth status
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of 3
              </span>
              <span className="text-sm text-muted-foreground">
                {currentStep === 1 ? 'Basic Info' : currentStep === 2 ? 'Funding Details' : 'Final Touches'}
              </span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Create Your Campaign</CardTitle>
              <CardDescription>
                Fill in the details to set up your crowdfunding campaign
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form id="campaign-form" onSubmit={handleSubmit}>
                {renderStep()}
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  form="campaign-form"
                  disabled={loading || !formData.termsAccepted}
                >
                  {loading ? 'Creating...' : 'Create Campaign'}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {currentStep === 1 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-base">Need inspiration?</CardTitle>
              </CardHeader>
              <CardContent>
                <SuggestionGenerator formData={formData} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CampaignCreationWizard;
