import React, { createContext, useContext, useEffect, useState } from 'react';
import { faqApi } from '../api/velanovaApi';
import { useUser } from './UserContext';

const FaqContext = createContext();

const normalizeFaq = (item) => ({
  ...item,
  isActive: Boolean(item?.isActive),
  sortOrder: Number(item?.sortOrder ?? 0),
});

const orderFaqs = (items) =>
  [...items].sort((a, b) => a.sortOrder - b.sortOrder || b.id - a.id);

export const FaqProvider = ({ children }) => {
  const { token } = useUser();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFaqs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await faqApi.list();
      const normalized = Array.isArray(data?.faqs) ? data.faqs.map(normalizeFaq) : [];
      setFaqs(orderFaqs(normalized));
    } catch (err) {
      setError(err?.message || 'Failed to load FAQs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const addFaq = async (payload) => {
    if (!token) throw new Error('You must be logged in as admin to add FAQs.');
    const data = await faqApi.create(token, payload);
    const item = normalizeFaq(data.faq);
    setFaqs((prev) => orderFaqs([item, ...prev]));
    return item;
  };

  const updateFaq = async (id, payload) => {
    if (!token) throw new Error('You must be logged in as admin to update FAQs.');
    const data = await faqApi.update(token, id, payload);
    const item = normalizeFaq(data.faq);
    setFaqs((prev) => orderFaqs(prev.map((entry) => (entry.id === id ? item : entry))));
    return item;
  };

  const deleteFaq = async (id) => {
    if (!token) throw new Error('You must be logged in as admin to delete FAQs.');
    await faqApi.remove(token, id);
    setFaqs((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <FaqContext.Provider value={{
      faqs,
      addFaq,
      updateFaq,
      deleteFaq,
      reloadFaqs: loadFaqs,
      loading,
      error,
    }}>
      {children}
    </FaqContext.Provider>
  );
};

export const useFaqs = () => {
  const context = useContext(FaqContext);
  if (!context) {
    throw new Error('useFaqs must be used within a FaqProvider');
  }
  return context;
};
