import React, { createContext, useContext, useEffect, useState } from 'react';
import { bannerApi } from '../api/velanovaApi';
import { useUser } from './UserContext';

const BannerContext = createContext();

const normalizeBanner = (banner) => ({
  ...banner,
  isActive: Boolean(banner?.isActive),
  sortOrder: Number(banner?.sortOrder ?? 0),
});

const orderBanners = (items) =>
  [...items].sort((a, b) => a.sortOrder - b.sortOrder || b.id - a.id);

export const BannerProvider = ({ children }) => {
  const { token } = useUser();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBanners = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bannerApi.list();
      const normalized = Array.isArray(data?.banners) ? data.banners.map(normalizeBanner) : [];
      setBanners(orderBanners(normalized));
    } catch (err) {
      setError(err?.message || 'Failed to load banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const addBanner = async (payload) => {
    if (!token) throw new Error('You must be logged in as admin to add banners.');
    const data = await bannerApi.create(token, payload);
    const banner = normalizeBanner(data.banner);
    setBanners((prev) => orderBanners([banner, ...prev]));
    return banner;
  };

  const updateBanner = async (id, payload) => {
    if (!token) throw new Error('You must be logged in as admin to update banners.');
    const data = await bannerApi.update(token, id, payload);
    const banner = normalizeBanner(data.banner);
    setBanners((prev) => orderBanners(prev.map((item) => (item.id === id ? banner : item))));
    return banner;
  };

  const deleteBanner = async (id) => {
    if (!token) throw new Error('You must be logged in as admin to delete banners.');
    await bannerApi.remove(token, id);
    setBanners((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <BannerContext.Provider value={{
      banners,
      addBanner,
      updateBanner,
      deleteBanner,
      reloadBanners: loadBanners,
      loading,
      error,
    }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanners = () => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBanners must be used within a BannerProvider');
  }
  return context;
};
