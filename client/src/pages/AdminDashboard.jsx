import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminAPI, customerAPI } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [staff, setStaff] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    description: '',
    image: '',
    cuisine: '',
    rating: 4.0,
    deliveryTime: '30-40 min',
    phone: ''
  });

  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    restaurant: '',
    isVegetarian: false
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const { data } = await adminAPI.getAllOrders();
        setOrders(data);
        const staffData = await adminAPI.getStaffList();
        setStaff(staffData.data);
      } else if (activeTab === 'users') {
        const { data } = await adminAPI.getAllUsers();
        setUsers(data);
      } else if (activeTab === 'restaurants') {
        const { data } = await customerAPI.getRestaurants();
        setRestaurants(data);
      } else if (activeTab === 'menu') {
        const [restaurantsData, categoriesData] = await Promise.all([
          customerAPI.getRestaurants(),
          customerAPI.getCategories()
        ]);
        setRestaurants(restaurantsData.data);
        setCategories(categoriesData.data);
      } else if (activeTab === 'categories') {
        const { data } = await customerAPI.getCategories();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createRestaurant(restaurantForm);
      alert('Restaurant created successfully!');
      setRestaurantForm({
        name: '',
        description: '',
        image: '',
        cuisine: '',
        rating: 4.0,
        deliveryTime: '30-40 min',
        phone: ''
      });
      loadData();
    } catch (error) {
      alert('Error creating restaurant: ' + error.response?.data?.message);
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createMenuItem({
        ...menuItemForm,
        price: parseFloat(menuItemForm.price)
      });
      alert('Menu item created successfully!');
      setMenuItemForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        restaurant: '',
        isVegetarian: false
      });
    } catch (error) {
      alert('Error creating menu item: ' + error.response?.data?.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCategory(categoryForm);
      alert('Category created successfully!');
      setCategoryForm({ name: '', icon: '', description: '' });
      loadData();
    } catch (error) {
      alert('Error creating category: ' + error.response?.data?.message);
    }
  };

  const handleAssignOrder = async (orderId, staffId) => {
    try {
      await adminAPI.assignOrderToStaff(orderId, staffId);
      alert('Order assigned successfully!');
      loadData();
    } catch (error) {
      alert('Error assigning order: ' + error.response?.data?.message);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      loadData();
    } catch (error) {
      alert('Error updating user status: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">Admin Dashboard</h1>
          <Button onClick={logout} className="bg-red-500 hover:bg-red-600">
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {['orders', 'users', 'restaurants', 'menu', 'categories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">All Orders</h2>
                {orders.map((order) => (
                  <Card key={order._id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                          <p className="text-sm text-gray-600">
                            Customer: {order.customer?.name} ({order.customer?.email})
                          </p>
                          <p className="text-sm text-gray-600">
                            Restaurant: {order.restaurant?.name}
                          </p>
                          <p className="text-sm font-semibold mt-2">Total: ${order.totalAmount}</p>
                          <p className="text-sm">
                            Status: <span className="font-semibold text-orange-500">{order.status}</span>
                          </p>
                          {order.assignedStaff && (
                            <p className="text-sm text-gray-600">
                              Assigned to: {order.assignedStaff.name}
                            </p>
                          )}
                        </div>
                        {order.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <select
                              onChange={(e) => handleAssignOrder(order._id, e.target.value)}
                              className="border rounded px-3 py-2"
                              defaultValue=""
                            >
                              <option value="" disabled>Assign to staff</option>
                              {staff.map((s) => (
                                <option key={s._id} value={s._id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold mb-4">All Users</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-600">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              onClick={() => handleToggleUserStatus(user._id)}
                              size="sm"
                              className="bg-gray-500 hover:bg-gray-600"
                            >
                              Toggle Status
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'restaurants' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Create Restaurant</h2>
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <form onSubmit={handleCreateRestaurant} className="space-y-4">
                      <Input
                        placeholder="Restaurant Name"
                        value={restaurantForm.name}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Description"
                        value={restaurantForm.description}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Image URL"
                        value={restaurantForm.image}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, image: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Cuisine Type"
                        value={restaurantForm.cuisine}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Phone"
                        value={restaurantForm.phone}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
                      />
                      <Input
                        placeholder="Delivery Time (e.g., 30-40 min)"
                        value={restaurantForm.deliveryTime}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, deliveryTime: e.target.value })}
                      />
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                        Create Restaurant
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <h2 className="text-xl font-bold mb-4">All Restaurants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurants.map((restaurant) => (
                    <Card key={restaurant._id}>
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                        <p className="text-sm text-gray-600">{restaurant.deliveryTime}</p>
                        <p className="text-sm">Rating: {restaurant.rating}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Create Menu Item</h2>
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <form onSubmit={handleCreateMenuItem} className="space-y-4">
                      <Input
                        placeholder="Item Name"
                        value={menuItemForm.name}
                        onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Description"
                        value={menuItemForm.description}
                        onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                        required
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={menuItemForm.price}
                        onChange={(e) => setMenuItemForm({ ...menuItemForm, price: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Image URL"
                        value={menuItemForm.image}
                        onChange={(e) => setMenuItemForm({ ...menuItemForm, image: e.target.value })}
                        required
                      />
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={menuItemForm.restaurant}
                        onChange={(e) => setMenuItemForm({ ...menuItemForm, restaurant: e.target.value })}
                        required
                      >
                        <option value="">Select Restaurant</option>
                        {restaurants.map((r) => (
                          <option key={r._id} value={r._id}>{r.name}</option>
                        ))}
                      </select>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={menuItemForm.category}
                        onChange={(e) => setMenuItemForm({ ...menuItemForm, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={menuItemForm.isVegetarian}
                          onChange={(e) => setMenuItemForm({ ...menuItemForm, isVegetarian: e.target.checked })}
                        />
                        <span>Vegetarian</span>
                      </label>
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                        Create Menu Item
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Create Category</h2>
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <form onSubmit={handleCreateCategory} className="space-y-4">
                      <Input
                        placeholder="Category Name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Icon (emoji)"
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Description"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      />
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                        Create Category
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <h2 className="text-xl font-bold mb-4">All Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Card key={category._id}>
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">{category.icon}</div>
                        <h3 className="font-semibold">{category.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
