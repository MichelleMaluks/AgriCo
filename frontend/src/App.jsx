import { useState } from "react";
import React, { useContext } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BuyerDashboard from "./pages/BuyerDashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import BrowseProviders from "./pages/BrowseProviders";
import ProviderProfileForm from "./pages/ProviderProfileForm";
import ProviderProfilePage from "./pages/ProviderProfilePage";
import ProviderMessages from "./pages/ProviderMessages";
import Forum from "./pages/Forum";
import ForumPost from "./pages/ForumDetail";
import Messages from "./pages/Messages";
import SavedProviders from "./pages/SavedProviders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/global.css";
import ForumDetail from "./pages/ForumDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminServices from "./pages/admin/AdminServices";
import AdminForum from "./pages/admin/AdminForum";
function App() {
  const { user } = useContext(AuthContext);
  return (
    <CartProvider>
      <Router>
        {/* Global Navbar */}
        <Navbar />

        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Home />} />

          <Route path="/messages" element={<Messages />} />
          <Route path="/saved-providers" element={<SavedProviders />} />

          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />


          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumDetail />} /> 
          {/* Buyer Flow */}
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

          {/* Products */}
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Providers */}
          <Route path="/providers" element={<BrowseProviders />} />
          <Route
            path="/provider-profile/:providerId"
            element={<ProviderProfileForm user={user} />}
          />
          <Route path="/provider/:id" element={<ProviderProfilePage />} />

          <Route
            path="/provider/:id/profile"
            element={<ProviderProfileForm />}
          />
          {/* Provider messages */}
          <Route path="/provider/:id/messages" element={<ProviderMessages />} />
        

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/forum" element={<AdminForum />} />
        
        </Routes>

        {/* Global Footer */}
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
