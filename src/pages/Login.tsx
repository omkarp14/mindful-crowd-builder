
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const from = location.state?.from || '/dashboard';
        navigate(from, { replace: true });
      }
    };
    
    checkSession();
    
    // Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          const from = location.state?.from || '/dashboard';
          navigate(from, { replace: true });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      
      // Store the JWT token
      localStorage.setItem('token', data.access_token);
      
      toast({
        title: "Logged in successfully!",
        description: "Welcome back to CrowdBuilder.",
      });
      
      // Redirect to the proper route
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting to register user...');
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          address: '',  // Default empty values as required by the backend
          post_code: '',
          country: '',
        }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      toast({
        title: "Sign up successful!",
        description: "Please log in with your new account.",
      });
      
      // Automatically log the user in after successful registration
      await handleSignIn(e);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-12 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <Card className="border-0 shadow-lg">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                  <CardDescription className="text-center">
                    Sign in to your account to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="signin-password">Password</Label>
                        <Button 
                          type="button" 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto"
                          onClick={() => navigate('/forgot-password')}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                        onClick={handleGoogleSignIn}
                      >
                        <FcGoogle className="mr-2 h-5 w-5" />
                        Google
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
                  <CardDescription className="text-center">
                    Sign up to start funding or creating campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Signing up..." : "Sign Up"}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                        onClick={handleGoogleSignIn}
                      >
                        <FcGoogle className="mr-2 h-5 w-5" />
                        Google
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
            <CardFooter className="flex justify-center">
              <p className="text-center text-sm text-muted-foreground px-6 pb-2">
                By continuing, you agree to our{" "}
                <Button 
                  variant="link" 
                  className="h-auto p-0" 
                  onClick={() => navigate('/terms')}
                >
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button 
                  variant="link" 
                  className="h-auto p-0" 
                  onClick={() => navigate('/privacy')}
                >
                  Privacy Policy
                </Button>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
