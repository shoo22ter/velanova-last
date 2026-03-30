import React, { createContext, useEffect, useState, useContext } from 'react';

const UserContext = createContext();
const ADMIN_EMAIL = 'teid83@gmail.com';

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Load user from localStorage on mount
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('velanova-user');
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved);
      const normalizedEmail = String(parsed?.email || '').trim().toLowerCase();
      return {
        ...parsed,
        email: normalizedEmail || parsed?.email || '',
        role: normalizedEmail === ADMIN_EMAIL ? 'admin' : 'customer',
      };
    } catch {
      return null;
    }
  });

  // Persist user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('velanova-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('velanova-user');
    }
  }, [user]);

  // Register new user
  const register = (fullName, email, password, role = 'customer') => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedRole = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'customer';
    const newUser = {
      id: `usr-${Date.now()}`,
      fullName,
      email: normalizedEmail,
      phone: '',
      role: normalizedRole,
      createdAt: new Date().toLocaleString(),
    };
    setUser(newUser);
    return newUser;
  };

  // Login user (demo - in production, validate against backend)
  const login = (email, password, role = 'customer') => {
    // Demo: accept any email/password combination
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedRole = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'customer';
    const loginUser = {
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
      phone: '',
      role: normalizedRole,
      fullName: normalizedEmail.split('@')[0],
      createdAt: new Date().toLocaleString(),
    };
    setUser(loginUser);
    return loginUser;
  };

  // Logout user
  const logout = () => {
    setUser(null);
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    if (user) {
      const normalizedEmail = String(updatedData?.email ?? user.email ?? '').trim().toLowerCase();
      const updated = {
        ...user,
        ...updatedData,
        email: normalizedEmail,
        role: normalizedEmail === ADMIN_EMAIL ? 'admin' : 'customer',
      };
      setUser(updated);
      return updated;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider value={{ user, register, login, logout, updateProfile, isAuthenticated, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};
