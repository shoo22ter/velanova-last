import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsApi } from '../api/velanovaApi';
import { useUser } from './UserContext';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  supportEmail: '',
  supportPhone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
  country: '',
  hoursWeekday: '',
  hoursSaturday: '',
  hoursSunday: '',
};

const normalizeSettings = (settings) => ({
  ...DEFAULT_SETTINGS,
  ...(settings || {}),
});

export const SettingsProvider = ({ children }) => {
  const { token } = useUser();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await settingsApi.get();
      setSettings(normalizeSettings(data?.settings));
    } catch (err) {
      setError(err?.message || 'Failed to load site settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (payload) => {
    if (!token) throw new Error('You must be logged in as admin to update settings.');
    const data = await settingsApi.update(token, payload);
    const next = normalizeSettings(data?.settings);
    setSettings(next);
    return next;
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      reloadSettings: loadSettings,
      loading,
      error,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
