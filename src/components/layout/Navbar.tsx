import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  Heart,
  BarChart,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          setUser(null);
          localStorage.setItem('isLoggedIn', 'false');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        localStorage.setItem('isLoggedIn', 'false');
      } finally {
        setLoading(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user' || e.key === 'isLoggedIn') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.setItem('isLoggedIn', 'false');
      setUser(null);
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getUserInitials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      }
      return user.full_name.charAt(0).toUpperCase();
    }
    
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "U";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "How It Works", path: "/how-it-works" },
  ];

  const renderNavLinksMobile = () => {
    return (
      <>
        {navLinks.map((link) => (
          <Link
            to={link.path}
            key={link.path}
            className="block py-2 px-2 rounded hover:bg-secondary"
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {!user ? (
          <>
            <Link
              to="/login"
              className="block py-2 px-2 rounded hover:bg-secondary mt-4"
              onClick={() => setIsOpen(false)}
            >
              Log In
            </Link>
            <Button
              className="w-full mt-2"
              onClick={() => {
                setIsOpen(false);
                navigate("/create");
              }}
            >
              Start a Campaign
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className="block py-2 px-2 rounded hover:bg-secondary mt-4"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Button
              className="w-full mt-2"
              onClick={() => {
                setIsOpen(false);
                navigate("/create");
              }}
            >
              Start a Campaign
            </Button>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => {
                handleSignOut();
                setIsOpen(false);
              }}
            >
              Sign Out
            </Button>
          </>
        )}
      </>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== "/"
          ? "bg-background shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl md:text-2xl">CrowdBuilder</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.path}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      onClick={() => navigate(link.path)}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                {user && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Desktop Buttons/User Menu */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              {loading ? null : !user ? (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Log In
                  </Button>
                  <Button onClick={() => navigate("/create")}>
                    Start a Campaign
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate("/create")}
                    className="flex items-center"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Start a Campaign
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
                        <Avatar>
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium text-foreground">{user?.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex items-center">
                          <BarChart className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard?tab=campaigns" className="flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          My Campaigns
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard?tab=settings" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Trigger */}
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4">{renderNavLinksMobile()}</div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
