import React, { useState, useEffect } from "react";
import { Order, Restaurant } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Phone,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    loadRestaurants();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await Order.list("-created_date");
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
    setIsLoading(false);
  };

  const loadRestaurants = async () => {
    try {
      const data = await Restaurant.list();
      setRestaurants(data);
    } catch (error) {
      console.error("Error loading restaurants:", error);
    }
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant ? restaurant.name : "Unknown Restaurant";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      preparing: "bg-orange-100 text-orange-800 border-orange-200",
      on_the_way: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: Package,
      on_the_way: MapPin,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4 mr-1" />;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        <div className="space-y-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-8">
              When you place your first order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Order from {getRestaurantName(order.restaurant_id)}
                        </CardTitle>
                        {/* <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(order.created_date), "PPP 'at' p")}
                        </p> */}
                        {order.created_date ? (
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(order.created_date), "PPP 'at' p")}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">
                            Date not available
                          </p>
                        )}
                      </div>
                      {/* <Badge
                        className={`border ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.replace(/_/g, " ").toUpperCase()}
                      </Badge> */}
                      <Badge
                        className={`border ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {(order.status
                          ? order.status.replace(/_/g, " ")
                          : "UNKNOWN"
                        ).toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold mb-3">Items Ordered</h4>
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            // <div
                            //   key={idx}
                            //   className="flex justify-between text-sm"
                            // >
                            <div key={`${item.name}-${item.quantity}`} className="flex justify-between text-sm">
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span className="font-medium">
                                ${item.total?.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${order.subtotal?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Delivery Fee</span>
                            <span>${order.delivery_fee?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold mt-2">
                            <span>Total</span>
                            <span className="text-orange-500">
                              ${order.total_amount?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div>
                        <h4 className="font-semibold mb-3">
                          Delivery Information
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-medium">
                                {order.customer_name}
                              </p>
                              <p className="text-gray-600">
                                {order.customer_address}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{order.customer_phone}</span>
                          </div>

                          <div>
                            <p className="font-medium">Payment Method</p>
                            <p className="text-gray-600 capitalize">
                              {order.payment_method?.replace(/_/g, " ")}
                            </p>
                          </div>

                          {order.special_instructions && (
                            <div>
                              <p className="font-medium">
                                Special Instructions
                              </p>
                              <p className="text-gray-600">
                                {order.special_instructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {order.status === "delivered" && (
                      <div className="mt-6 pt-6 border-t">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                          Reorder
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
