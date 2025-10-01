import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection({ searchTerm, setSearchTerm }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 foodie-gradient opacity-90" />
      
      {/* Floating Food Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 animate-float">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            🍕
          </div>
        </div>
        <div className="absolute top-20 right-20 animate-bounce-slow">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            🍔
          </div>
        </div>
        <div className="absolute bottom-20 left-20 animate-float" style={{animationDelay: '1s'}}>
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            🍟
          </div>
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce-slow" style={{animationDelay: '2s'}}>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            🥗
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Fastest Delivery in Town</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Hungry?
            <br />
            <span className="text-yellow-300">Order Now!</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover the best restaurants in your area and get your favorite food delivered in minutes
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl shadow-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for restaurants, dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 bg-gray-50 h-12 text-lg"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 rounded-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex justify-center"
          >
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Delivering to your current location</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}