import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Home, Store, ShoppingCart, User as UserIcon, Search, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = React.useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for cart changes
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('foodie_cart') || '[]');
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    };
    window.addEventListener('storage', updateCart);
    updateCart(); // Initial call
    return () => window.removeEventListener('storage', updateCart);
  }, []);

  useEffect(() => {
    // Authentication check
    const checkAuth = async () => {
      try {
        await User.me();
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && currentPageName === 'Landing') {
        navigate(createPageUrl('Home'));
      }
      if (!isAuthenticated && currentPageName !== 'Landing') {
        navigate(createPageUrl('Landing'));
      }
    }
  }, [isLoading, isAuthenticated, currentPageName, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="flex flex-col items-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68d8b4db77c9dd8916f2f03e/366649411_foodieLogo.png" 
            alt="Foodie" 
            className="h-24 w-24 animate-bounce"
          />
          <p className="text-orange-500 font-semibold mt-4">Loading your delicious experience...</p>
        </div>
      </div>
    );
  }

  if (currentPageName === 'Landing') {
    return children;
  }
  
  // Render full layout only for authenticated users on non-landing pages
  if (!isAuthenticated) return null;

  const navigationItems = [
    { name: "Home", url: createPageUrl("Home"), icon: Home },
    { name: "Orders", url: createPageUrl("Orders"), icon: Store },
    { name: "Cart", url: createPageUrl("Cart"), icon: ShoppingCart, badge: cartCount },
    { name: "Profile", url: createPageUrl("Profile"), icon: UserIcon },
  ];

  return (
    <>
      <style>
        {`
          :root {
            --foodie-primary: #FF6B35;
            --foodie-secondary: #FF8C42;
            --foodie-accent: #FFA726;
            --foodie-dark: #BF360C;
            --foodie-light: #FFE0B2;
          }
          
          .foodie-gradient {
            background: linear-gradient(135deg, var(--foodie-primary), var(--foodie-secondary));
          }
          
          .foodie-text-gradient {
            background: linear-gradient(135deg, var(--foodie-primary), var(--foodie-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-bounce-slow {
            animation: bounce 4s ease-in-out infinite;
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
        `}
      </style>
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        {/* Header */}
        <header className="bg-white shadow-lg border-b-2 border-orange-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68d8b4db77c9dd8916f2f03e/366649411_foodieLogo.png" 
                  alt="Foodie" 
                  className="h-12 w-12 animate-bounce-slow"
                />
                <span className="text-2xl font-bold foodie-text-gradient">Foodie</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Deliver to Current Location</span>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Search className="w-4 h-4 mr-2" />
                  Search restaurants...
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-lg md:hidden z-50">
          <div className="flex justify-around items-center h-16">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-orange-500 bg-orange-50"
                      : "text-gray-500 hover:text-orange-500"
                  }`}
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5" />
                    {item.badge > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Desktop Navigation - Floating Sidebar */}
        <div className="hidden md:block fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-4 space-y-4">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                  title={item.name}
                >
                  <item.icon className="w-6 h-6" />
                  {item.badge > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-[20px] flex items-center justify-center p-0">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}