import React, { useState, useEffect } from "react";
import { Restaurant, Order } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, ShoppingCart, CreditCard, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    special_instructions: "",
    payment_method: "cash"
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    loadCart();
    loadRestaurants();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('foodie_cart') || '[]');
    setCart(savedCart);
  };

  const loadRestaurants = async () => {
    try {
      const data = await Restaurant.list();
      setRestaurants(data);
    } catch (error) {
      console.error("Error loading restaurants:", error);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('foodie_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('foodie_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('foodie_cart');
    window.dispatchEvent(new Event('storage'));
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : "Unknown Restaurant";
  };

  const getDeliveryFee = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.delivery_fee || 2.99 : 2.99;
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? getDeliveryFee(cart[0]?.restaurant_id) : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!orderDetails.customer_name || !orderDetails.customer_phone || !orderDetails.customer_address) {
      alert("Please fill in all required fields");
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      const orderItems = cart.map(item => ({
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));

      await Order.create({
        restaurant_id: cart[0]?.restaurant_id,
        customer_name: orderDetails.customer_name,
        customer_phone: orderDetails.customer_phone,
        customer_address: orderDetails.customer_address,
        items: orderItems,
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total_amount: total,
        payment_method: orderDetails.payment_method,
        special_instructions: orderDetails.special_instructions
      });

      clearCart();
      alert("Order placed successfully!");
      setIsCheckout(false);
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
    
    setIsPlacingOrder(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some delicious items to get started!</p>
          <Link to={createPageUrl("Home")}>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Browse Restaurants
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isCheckout) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <Button
              variant="outline"
              onClick={() => setIsCheckout(false)}
            >
              Back to Cart
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Typography htmlFor="name">Full Name *</Typography>
                  <Input
                    id="name"
                    value={orderDetails.customer_name}
                    onChange={(e) => setOrderDetails({...orderDetails, customer_name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Typography htmlFor="phone">Phone Number *</Typography>
                  <Input
                    id="phone"
                    type="tel"
                    value={orderDetails.customer_phone}
                    onChange={(e) => setOrderDetails({...orderDetails, customer_phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <Typography htmlFor="address">Delivery Address *</Typography>
                  <TextField
                    id="address"
                    value={orderDetails.customer_address}
                    onChange={(e) => setOrderDetails({...orderDetails, customer_address: e.target.value})}
                    placeholder="Enter your complete address"
                  />
                </div>
                
                <div>
                  <Typography htmlFor="instructions">Special Instructions</Typography>
                  <TextField
                    id="instructions"
                    value={orderDetails.special_instructions}
                    onChange={(e) => setOrderDetails({...orderDetails, special_instructions: e.target.value})}
                    placeholder="Any special instructions for the restaurant or delivery"
                  />
                </div>

                <div>
                  <Typography>Payment Method</Typography>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["cash", "card", "digital_wallet"].map(method => (
                      <Button
                        key={method}
                        variant={orderDetails.payment_method === method ? "default" : "outline"}
                        onClick={() => setOrderDetails({...orderDetails, payment_method: method})}
                        className={orderDetails.payment_method === method 
                          ? "bg-orange-500 hover:bg-orange-600" 
                          : ""
                        }
                      >
                        {method === "cash" ? "Cash" : method === "card" ? "Card" : "Wallet"}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <hr />
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-6"
                  >
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-500 border-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="flex">
                      <div className="w-24 h-24 relative overflow-hidden">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              {getRestaurantName(item.restaurant_id)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="rounded-full w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-semibold min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="rounded-full w-8 h-8 p-0 border-orange-500 text-orange-500 hover:bg-orange-50"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-orange-500">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items ({cart.reduce((total, item) => total + item.quantity, 0)})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    onClick={() => setIsCheckout(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Link to={createPageUrl("Home")}>
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}