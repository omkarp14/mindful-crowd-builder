import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { X, Mail } from "lucide-react";

// Define schemas for our forms
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

const userInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Please enter your full address"),
  postCode: z.string().min(1, "Please enter your post code"),
  country: z.string().min(2, "Please enter your country")
});

type EmailFormValues = z.infer<typeof emailSchema>;
type UserInfoFormValues = z.infer<typeof userInfoSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(true);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [authMethod, setAuthMethod] = useState<"google" | "email" | null>(null);
  
  // Get the return path from state or default to dashboard
  const from = location.state?.from?.pathname || "/";
  
  // Form for email login
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  });
  
  // Form for user information
  const userInfoForm = useForm<UserInfoFormValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      fullName: "",
      address: "",
      postCode: "",
      country: ""
    }
  });
  
  const handleClose = () => {
    setIsAuthOpen(false);
    // Redirect back to the origin page
    navigate(-1);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    setAuthMethod("google");
    // Simulate Google authentication
    setTimeout(() => {
      setIsAuthOpen(false);
      setIsUserInfoOpen(true);
    }, 1000);
  };

  const handleEmailSubmit = (values: EmailFormValues) => {
    console.log("Email login submitted:", values);
    setAuthMethod("email");
    // Simulate email authentication
    toast.success("Verification email sent", {
      description: `We've sent a verification link to ${values.email}`,
    });
    setTimeout(() => {
      setIsAuthOpen(false);
      setIsUserInfoOpen(true);
    }, 1000);
  };

  const handleUserInfoSubmit = (values: UserInfoFormValues) => {
    console.log("User info submitted:", values);
    // Simulate saving user information
    setTimeout(() => {
      setIsUserInfoOpen(false);
      
      toast.success("Sign up complete!", {
        description: "Your account has been created successfully.",
      });
      
      // Redirect to the original destination
      navigate(from);
    }, 1000);
  };

  return (
    <>
      {/* Initial Auth Dialog */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="absolute right-4 top-4">
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <DialogTitle className="text-center text-2xl font-medium">Welcome</DialogTitle>
            <DialogDescription className="text-center text-base">
              Log in to CrowdBuilder to continue.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <img src="/lovable-uploads/511bd267-4eb8-42dd-9194-051ce0d2cb37.png" alt="Google Icon" className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>
            
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Email Address" 
                          type="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-destructive" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Continue</Button>
              </form>
            </Form>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="underline">Privacy Policy</a> and{" "}
              <a href="#" className="underline">Terms of Service</a> apply.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* User Information Sheet */}
      <Sheet open={isUserInfoOpen} onOpenChange={setIsUserInfoOpen}>
        <SheetContent className="flex justify-center items-center" onInteractOutside={(e) => e.preventDefault()}>
          <SheetHeader className="mb-6 text-center">
            <SheetTitle>Complete your profile</SheetTitle>
            <SheetDescription>
              Please provide a few more details to complete your account setup.
            </SheetDescription>
          </SheetHeader>
          
          <Form {...userInfoForm}>
            <form onSubmit={userInfoForm.handleSubmit(handleUserInfoSubmit)} className="space-y-6">
              <FormField
                control={userInfoForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userInfoForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Apt 4B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userInfoForm.control}
                name="postCode"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel>Post Code</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userInfoForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Complete Sign Up
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Login;