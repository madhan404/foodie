import React from "react";
import Layout from "../layout.jsx";
import HomePage from "./pages/Home.jsx";
import LandingPage from "./pages/Landing.jsx";
import RestaurantPage from "./pages/Restaurant.jsx";
import Orders from "./pages/orders.jsx";
import Profile from "./pages/Profile.jsx";
import Cart from "./pages/Cart.jsx";
import { Routes, Route, useLocation } from "react-router-dom";

const pageNames = {
  "/": "Landing",
  "/home": "Home",
  "/restaurant": "Restaurant",
  "/cart":"Cart"
};

export default function App() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  let currentPageName = "Landing";
  if (path.startsWith("/home")) currentPageName = "Home";
  else if (path.startsWith("/restaurant")) currentPageName = "Restaurant";

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/restaurant" element={<RestaurantPage />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Cart" element={<Cart />} />
      </Routes>
    </Layout>
  );
}
