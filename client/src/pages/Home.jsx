import React, { useState, useEffect } from "react";
import { Restaurant, Category, MenuItem } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Star, Clock, Truck, Filter, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import HeroSection from "../components/home/HeroSection";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedRestaurants from "../components/home/FeaturedRestaurants";
import PopularDishes from "../components/home/PopularDishes";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [restaurantData, categoryData, menuData] = await Promise.all([
        Restaurant.list(),
        Category.list(),
        MenuItem.list()
      ]);
      
      setRestaurants(restaurantData);
      setCategories(categoryData);
      setFeaturedItems(menuData.slice(0, 8));
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || restaurant.category_id === selectedCategory;
    return matchesSearch && matchesCategory && restaurant.is_active;
  });

  return (
    <div className="pb-20 md:pb-8">
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <CategoryGrid 
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isLoading={isLoading}
        />

        <FeaturedRestaurants 
          restaurants={restaurants.filter(r => r.is_featured)}
          isLoading={isLoading}
        />

        <PopularDishes 
          items={featuredItems}
          isLoading={isLoading}
        />

        {/* All Restaurants */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Restaurants</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredRestaurants.length} restaurants found
              </span>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={createPageUrl(`Restaurant?id=${restaurant.id}`)}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-orange-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            {restaurant.rating || "4.5"}
                          </Badge>
                        </div>
                        {restaurant.is_featured && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-yellow-500 text-white">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {restaurant.description || "Delicious food awaits you!"}
                        </p>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>{restaurant.delivery_time || "30-45 min"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck className="w-4 h-4 text-orange-500" />
                            <span>${restaurant.delivery_fee || "2.99"}</span>
                          </div>
                        </div>
                        
                        {restaurant.min_order && (
                          <div className="mt-2 text-xs text-gray-500">
                            Min order: ${restaurant.min_order}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredRestaurants.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}