import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartToast from './components/CartToast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import About from './pages/About';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';
import { UserProvider, useUser } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { OrdersProvider } from './context/OrdersContext';

import { AnimatePresence } from 'framer-motion';

// Private route component - protects routes that require authentication
const PrivateRoute = ({ element, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Extracted inner content to use the location hook
const AppContent = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '80vh', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
            <Route path="/checkout" element={<PrivateRoute element={<Checkout />} />} />
            <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<PrivateRoute element={<Admin />} requireAdmin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <CartToast />
    </>
  );
};

function App() {
  return (
    <Router>
      <UserProvider>
        <ProductProvider>
          <OrdersProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </OrdersProvider>
        </ProductProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
