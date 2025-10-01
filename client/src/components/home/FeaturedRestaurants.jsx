import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Truck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function FeaturedRestaurants({ restaurants, isLoading }) {
  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Restaurants</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse h-32">
              <div className="flex h-full">
                <div className="w-32 bg-gray-200" />
                <div className="flex-1 p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (restaurants.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">Featured Restaurants</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {restaurants.slice(0, 4).map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={createPageUrl(`Restaurant?id=${restaurant.id}`)}>
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="flex h-32">
                  <div className="w-32 relative overflow-hidden">
                    <img
                      src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200"}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                  </div>
                  
                  <CardContent className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-orange-500 transition-colors">
                          {restaurant.name}
                        </h3>
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          {restaurant.rating || "4.5"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {restaurant.description || "Delicious food awaits you!"}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{restaurant.delivery_time || "30-45 min"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4 text-orange-500" />
                        <span>${restaurant.delivery_fee || "2.99"}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}