import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, User, X, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const closeMenus = (event) => {
      const trigger = event.target.closest('.nav-account');
      if (!trigger) setUserMenuOpen(false);
    };
    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';
  const isSolid = isScrolled || !isHomePage || mobileMenuOpen;

  const navLinks = useMemo(() => ([
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    ...(isAuthenticated && isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ]), [isAuthenticated, isAdmin]);

  return (
    <header className={`navbar ${isSolid ? 'scrolled' : ''}`}>
      <div className="container nav-shell">
        <div className="nav-container">
          <Link to="/" className="brand-logo" aria-label="Velanova home">
            VELANOVA
            <span>Radiant Skin Rituals</span>
          </Link>

          <nav className="nav-links nav-links-desktop" aria-label="Primary navigation">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={location.pathname === item.to ? 'active' : ''}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav-icons">
            <div className="nav-account" onClick={(e) => e.stopPropagation()}>
              {isAuthenticated ? (
                <button
                  type="button"
                  className={`nav-icon-btn account-trigger ${userMenuOpen ? 'active' : ''}`}
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  title={user?.email}
                  aria-label="Open account menu"
                  aria-expanded={userMenuOpen}
                >
                  <User size={19} />
                  <span className="nav-account-label">Account</span>
                </button>
              ) : (
                <Link to="/login" className="nav-icon-btn account-trigger" aria-label="Login">
                  <User size={19} />
                  <span className="nav-account-label">Login</span>
                </Link>
              )}

              {isAuthenticated && userMenuOpen && (
                <div className="user-dropdown" role="menu" aria-label="User menu">
                  <div className="user-dropdown-head">
                    <p>Signed in as</p>
                    <strong>{user?.email}</strong>
                    <span>{isAdmin ? 'Admin access' : 'Customer account'}</span>
                  </div>

                  <Link to="/profile" className="user-dropdown-link">
                    <User size={16} />
                    My Profile
                  </Link>
                  <Link to="/orders" className="user-dropdown-link">
                    <Package size={16} />
                    Order History
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="user-dropdown-link">
                      <LayoutDashboard size={16} />
                      Admin Dashboard
                    </Link>
                  )}
                  <button type="button" className="user-dropdown-link danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <Link to="/cart" className="nav-icon-btn cart-icon" aria-label="Open cart">
              <ShoppingBag size={19} />
              <span className="nav-account-label">Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <button
              type="button"
              className={`nav-icon-btn mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div className={`nav-links-mobile ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="nav-mobile-card">
            <p className="nav-mobile-kicker">Navigate</p>
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={location.pathname === item.to ? 'active' : ''}
              >
                {item.label}
              </Link>
            ))}

            <div className="nav-mobile-divider" />

            {isAuthenticated ? (
              <>
                <Link to="/profile">My Profile</Link>
                <Link to="/orders">Order History</Link>
                <button type="button" className="nav-mobile-signout" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login">Login / Create Account</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
