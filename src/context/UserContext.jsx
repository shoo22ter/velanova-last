import React, { createContext, useEffect, useState, useContext } from 'react';
import { authApi } from '../api/velanovaApi';

const UserContext = createContext();
const STORAGE_KEY = 'velanova-auth';

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { user: null, token: null };

    try {
      const parsed = JSON.parse(saved);
      return {
        user: parsed?.user || null,
        token: parsed?.token || null,
      };
    } catch {
      return { user: null, token: null };
    }
  });
  const [loading, setLoading] = useState(false);

  const user = auth.user;
  const token = auth.token;

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      setAuth({ user: data.user, token: data.token });
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password) => {
    setLoading(true);
    try {
      const data = await authApi.register(fullName, email, password);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const currentToken = token;
    setAuth({ user: null, token: null });
    if (!currentToken) return;

    try {
      await authApi.logout(currentToken);
    } catch {
      // Ignore logout errors for now.
    }
  };

  const updateProfile = async (updatedData) => {
    if (!token) {
      throw new Error('You must be logged in to update your profile.');
    }
    setLoading(true);
    try {
      const data = await authApi.updateProfile(token, updatedData);
      setAuth((prev) => ({ ...prev, user: data.user }));
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider
      value={{ user, token, login, register, logout, updateProfile, isAuthenticated, isAdmin, authLoading: loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
