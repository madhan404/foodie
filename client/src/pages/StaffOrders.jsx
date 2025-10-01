import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { staffAPI } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function StaffOrders() {
  const { logout, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await staffAPI.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await staffAPI.updateOrderStatus(orderId, status);
      alert('Order status updated successfully!');
      loadOrders();
      if (selectedOrder?._id === orderId) {
        const { data } = await staffAPI.getOrderDetails(orderId);
        setSelectedOrder(data);
      }
    } catch (error) {
      alert('Error updating order status: ' + error.response?.data?.message);
    }
  };

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-purple-100 text-purple-700',
      out_for_delivery: 'bg-orange-100 text-orange-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-orange-500">Staff Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
          <Button onClick={logout} className="bg-red-500 hover:bg-red-600">
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">My Assigned Orders ({orders.length})</h2>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      No orders assigned to you yet.
                    </CardContent>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <Card
                      key={order._id}
                      className={`cursor-pointer transition-all ${
                        selectedOrder?._id === order._id ? 'ring-2 ring-orange-500' : ''
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold">Order #{order._id.slice(-6)}</p>
                            <p className="text-sm text-gray-600">{order.customer?.name}</p>
                            <p className="text-sm text-gray-600">{order.restaurant?.name}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold">Total: ${order.totalAmount}</p>
                          <p className="text-gray-600">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <div>
              {selectedOrder ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">Order Details</h2>
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-lg mb-2">Order #{selectedOrder._id.slice(-6)}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Customer Information</h4>
                        <p className="text-sm">{selectedOrder.customer?.name}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.customer?.email}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.customer?.phone}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Delivery Address</h4>
                        <p className="text-sm">{selectedOrder.deliveryAddress?.street}</p>
                        <p className="text-sm">{selectedOrder.deliveryAddress?.city}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Restaurant</h4>
                        <p className="text-sm">{selectedOrder.restaurant?.name}</p>
                        {selectedOrder.restaurant?.phone && (
                          <p className="text-sm text-gray-600">{selectedOrder.restaurant.phone}</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Order Items</h4>
                        <div className="space-y-2">
                          {selectedOrder.items?.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm border-b pb-2">
                              <div>
                                <p className="font-medium">{item.menuItem?.name}</p>
                                <p className="text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total Amount:</span>
                          <span className="text-orange-500">${selectedOrder.totalAmount}</span>
                        </div>
                      </div>

                      {selectedOrder.notes && (
                        <div>
                          <h4 className="font-semibold mb-2">Special Notes</h4>
                          <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2">Update Order Status</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {statusOptions.map((option) => (
                            <Button
                              key={option.value}
                              onClick={() => handleStatusUpdate(selectedOrder._id, option.value)}
                              disabled={selectedOrder.status === option.value}
                              className={`${
                                selectedOrder.status === option.value
                                  ? 'bg-gray-300 cursor-not-allowed'
                                  : 'bg-orange-500 hover:bg-orange-600'
                              }`}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        <p>Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        <p>Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center text-gray-500">
                    Select an order to view details
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
