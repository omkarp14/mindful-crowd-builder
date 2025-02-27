
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    setAuthMethod("google");
    // Simulate Google authentication
    setTimeout(() => {
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
      setIsUserInfoOpen(true);
    }, 1000);
  };

  const handleUserInfoSubmit = (values: UserInfoFormValues) => {
    console.log("User info submitted:", values);
    // Simulate saving user information
    setTimeout(() => {
      setIsUserInfoOpen(false);
      
      // Set logged in state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      toast.success("Sign up complete!", {
        description: "Your account has been created successfully.",
      });
      
      // Redirect to the original destination
      navigate(from);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to CrowdBuilder</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Continue with Email</Button>
              </form>
            </Form>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              By continuing, you agree to CrowdBuilder's <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
            </p>
          </CardContent>
        </Card>
      </main>
      
      {/* User Information Sheet */}
      <Sheet open={isUserInfoOpen} onOpenChange={setIsUserInfoOpen}>
        <SheetContent size="sm" onInteractOutside={(e) => e.preventDefault()}>
          <SheetHeader className="mb-6">
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
                  <FormItem>
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
                  <FormItem>
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
                  <FormItem>
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
                  <FormItem>
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
      
      <Footer />
    </div>
  );
};

export default Login;
