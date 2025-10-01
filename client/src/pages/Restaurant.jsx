import React, { useState, useEffect } from "react";
import { Restaurant, MenuItem } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Truck, MapPin, Phone, ArrowLeft, Plus, Minus, Leaf, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function RestaurantPage() {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadRestaurantData();
    loadCart();
  }, []);

  const loadRestaurantData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');
    
    if (!restaurantId) return;

    try {
      const restaurants = await Restaurant.list();
      const foundRestaurant = restaurants.find(r => r.id === restaurantId);
      
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        
        const items = await MenuItem.list();
        const restaurantItems = items.filter(item => item.restaurant_id === restaurantId);
        setMenuItems(restaurantItems);
      }
    } catch (error) {
      console.error("Error loading restaurant:", error);
    }
    setIsLoading(false);
  };

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('foodie_cart') || '[]');
    setCart(savedCart);
  };

  const addToCart = (item) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...item, quantity: 1 });
    }
    
    setCart(updatedCart);
    localStorage.setItem('foodie_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(0, item.quantity - 1) };
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    setCart(updatedCart);
    localStorage.setItem('foodie_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const categories = [...new Set(menuItems.map(item => item.category))].filter(Boolean);
  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900">Restaurant not found</h2>
        <Link to={createPageUrl("Home")}>
          <Button className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link to={createPageUrl("Home")}>
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg mb-4 opacity-90">
              {restaurant.description || "Delicious food awaits you!"}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{restaurant.rating || "4.5"} Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.delivery_time || "30-45 min"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                <span>${restaurant.delivery_fee || "2.99"} Delivery</span>
              </div>
              {restaurant.min_order && (
                <div className="flex items-center gap-1">
                  <span>Min order: ${restaurant.min_order}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Contact Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurant.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Menu Categories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" 
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "hover:bg-orange-50 hover:text-orange-600"
                }
              >
                All Items
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "hover:bg-orange-50 hover:text-orange-600"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
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
                  
                  {item.ingredients && item.ingredients.length > 0 && (
                    <p className="text-xs text-gray-500 mb-3">
                      {item.ingredients.slice(0, 3).join(", ")}
                      {item.ingredients.length > 3 && "..."}
                    </p>
                  )}
                  
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
                    
                    {getItemQuantity(item.id) > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-semibold min-w-[20px] text-center">
                          {getItemQuantity(item.id)}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(item)}
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}