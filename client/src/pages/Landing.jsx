import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      if (response.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (response.data.role === 'staff') {
        navigate('/staff/orders');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Pacifico&display=swap');
        .font-brand { font-family: 'Pacifico', cursive; }
        .font-body { font-family: 'Poppins', sans-serif; }
      `}</style>

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

      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12 relative">
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
          className="w-full max-w-sm z-10 font-body"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {isLogin ? 'Welcome Back!' : 'Join Foodie'}
            </h2>
            <p className="text-gray-500">
              {isLogin ? 'Sign in to continue your culinary adventure.' : 'Create an account to get started.'}
            </p>
          </div>

          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-white text-orange-500 shadow-md'
                  : 'text-gray-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-white text-orange-500 shadow-md'
                  : 'text-gray-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            )}

            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {!isLogin && (
              <div>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            )}

            <div>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="h-12 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-lg shadow-orange-200 transition-all duration-300"
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </motion.div>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>By continuing, you agree to our</p>
            <a href="#" className="text-orange-500 hover:underline">Terms of Service</a> & <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
