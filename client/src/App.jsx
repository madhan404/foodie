import React from "react";
import Layout from "../layout.jsx";
import HomePage from "./pages/Home.jsx";
import LandingPage from "./pages/Landing.jsx";
import RestaurantPage from "./pages/Restaurant.jsx";
import Orders from "./pages/orders.jsx";
import Profile from "./pages/Profile.jsx";
import Cart from "./pages/Cart.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import StaffOrders from "./pages/StaffOrders.jsx";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

const pageNames = {
  "/": "Landing",
  "/home": "Home",
  "/restaurant": "Restaurant",
  "/cart": "Cart"
};

function AppRoutes() {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname.toLowerCase();
  let currentPageName = "Landing";
  if (path.startsWith("/home")) currentPageName = "Home";
  else if (path.startsWith("/restaurant")) currentPageName = "Restaurant";

  const RootRedirect = () => {
    if (user) {
      if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
      if (user.role === 'staff') return <Navigate to="/staff/orders" replace />;
      return <Navigate to="/home" replace />;
    }
    return <LandingPage />;
  };

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/home" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <HomePage />
          </ProtectedRoute>
        } />

        <Route path="/restaurant" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <RestaurantPage />
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Orders />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/cart" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Cart />
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/staff/orders" element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffOrders />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
