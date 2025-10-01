import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/entities/User';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const FoodIcon = ({ children, className }) => (
  <motion.div
    className={`absolute text-4xl md:text-5xl opacity-80 ${className}`}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 100, delay: Math.random() * 2 }}
    whileHover={{ scale: 1.2, rotate: 15 }}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await User.loginWithRedirect(window.location.origin + createPageUrl('Home'));
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Pacifico&display=swap');
        .font-brand { font-family: 'Pacifico', cursive; }
        .font-body { font-family: 'Poppins', sans-serif; }
      `}</style>
      
      {/* Left Side - Brand */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-8 md:p-12 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68d8b4db77c9dd8916f2f03e/366649411_foodieLogo.png"
            alt="Foodie Logo"
            className="max-w-[350px] w-full mx-auto drop-shadow-2xl animate-float"
          />
          <h1 className="font-brand text-5xl md:text-6xl mt-8 foodie-text-gradient">
            Foodie
          </h1>
          <p className="font-body text-lg text-gray-600 mt-4 max-w-sm mx-auto">
            Your next favorite meal is just a click away.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Login */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12 relative">
        {/* Floating food icons */}
        <FoodIcon className="top-10 left-10">🍔</FoodIcon>
        <FoodIcon className="top-1/4 right-16">🍕</FoodIcon>
        <FoodIcon className="bottom-1/3 left-16">🍟</FoodIcon>
        <FoodIcon className="bottom-12 right-10">🍣</FoodIcon>
        <FoodIcon className="top-1/2 left-1/4 rotate-12">🍩</FoodIcon>
        <FoodIcon className="bottom-1/4 right-1/3 -rotate-12">🌮</FoodIcon>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="w-full max-w-sm z-10 text-center font-body"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
          <p className="text-gray-500 mb-12">Sign in to continue your culinary adventure.</p>
          
          <div className="space-y-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogin}
                className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-200 transition-all duration-300"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.417 9.562C34.331 5.923 29.475 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                  <path fill="#FF3D00" d="M6.306 14.691c-1.339 2.65-2.064 5.6-2.064 8.709c0 3.109.725 6.059 2.064 8.709L12.7 26.69c-.495-1.56-.769-3.23-.769-5s.274-3.44.769-5L6.306 14.691z"></path>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0 1 24 36c-4.418 0-8-3.582-8-8s3.582-8 8-8c1.849 0 3.554.629 4.907 1.688L33.591 15.1C30.5 12.015 26.49 10 24 10c-11.045 0-20 8.955-20 20s8.955 20 20 20z"></path>
                  <path fill="#1976D2" d="M43.611 20.083H24v8h19.611c0 0-0.009-0.038-0.01-0.083C43.91 25.13 44 24.571 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                </svg>
                Sign In with Google
              </Button>
            </motion.div>
            
            <div className="text-center text-sm text-gray-500">
              <p>By signing in, you agree to our</p>
              <a href="#" className="text-orange-500 hover:underline">Terms of Service</a> & <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}