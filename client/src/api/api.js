import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_URL || 'http://localhost:3000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => axios.post(`${API_BASE_URL}/auth/login`, credentials),
  register: (userData) => axios.post(`${API_BASE_URL}/auth/register`, userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const customerAPI = {
  getRestaurants: () => api.get('/restaurants'),
  getRestaurantById: (id) => api.get(`/restaurants/${id}`),
  getRestaurantMenu: (id) => api.get(`/restaurants/${id}/menu`),
  getCategories: () => api.get('/categories'),
  getMenuItemsByCategory: (categoryId) => api.get(`/categories/${categoryId}/items`),
  searchMenuItems: (query) => api.get(`/menu-items/search?q=${query}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
};

export const adminAPI = {
  createRestaurant: (data) => api.post('/admin/restaurants', data),
  updateRestaurant: (id, data) => api.put(`/admin/restaurants/${id}`, data),
  deleteRestaurant: (id) => api.delete(`/admin/restaurants/${id}`),

  createMenuItem: (data) => api.post('/admin/menu-items', data),
  updateMenuItem: (id, data) => api.put(`/admin/menu-items/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/admin/menu-items/${id}`),

  createCategory: (data) => api.post('/admin/categories', data),

  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),

  getAllOrders: () => api.get('/admin/orders'),
  assignOrderToStaff: (orderId, staffId) => api.patch(`/admin/orders/${orderId}/assign`, { staffId }),

  getStaffList: () => api.get('/admin/staff'),
};

export const staffAPI = {
  getMyOrders: () => api.get('/staff/orders'),
  getOrderDetails: (id) => api.get(`/staff/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/staff/orders/${id}/status`, { status }),
};

export default api;
