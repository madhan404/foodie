import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Leaf, Flame, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function PopularDishes({ items, isLoading }) {
  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('foodie_cart') || '[]');
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('foodie_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Dishes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">Popular Dishes</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.is_vegetarian && (
                    <Badge className="bg-green-500 text-white">
                      <Leaf className="w-3 h-3 mr-1" />
                      Veg
                    </Badge>
                  )}
                  {item.is_spicy && (
                    <Badge className="bg-red-500 text-white">
                      <Flame className="w-3 h-3 mr-1" />
                      Spicy
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description || "Delicious and fresh!"}
                </p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold text-orange-500">
                      ${item.price?.toFixed(2)}
                    </span>
                    {item.prep_time && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.prep_time}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => addToCart(item)}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}