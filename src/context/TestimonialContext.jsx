import React, { createContext, useContext, useEffect, useState } from 'react';
import { testimonialApi } from '../api/velanovaApi';
import { useUser } from './UserContext';

const TestimonialContext = createContext();

const normalizeTestimonial = (item) => ({
  ...item,
  isActive: Boolean(item?.isActive),
  sortOrder: Number(item?.sortOrder ?? 0),
  rating: Number(item?.rating ?? 5),
});

const orderTestimonials = (items) =>
  [...items].sort((a, b) => a.sortOrder - b.sortOrder || b.id - a.id);

export const TestimonialProvider = ({ children }) => {
  const { token } = useUser();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTestimonials = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await testimonialApi.list();
      const normalized = Array.isArray(data?.testimonials) ? data.testimonials.map(normalizeTestimonial) : [];
      setTestimonials(orderTestimonials(normalized));
    } catch (err) {
      setError(err?.message || 'Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const addTestimonial = async (payload) => {
    if (!token) throw new Error('You must be logged in as admin to add testimonials.');
    const data = await testimonialApi.create(token, payload);
    const item = normalizeTestimonial(data.testimonial);
    setTestimonials((prev) => orderTestimonials([item, ...prev]));
    return item;
  };

  const updateTestimonial = async (id, payload) => {
    if (!token) throw new Error('You must be logged in as admin to update testimonials.');
    const data = await testimonialApi.update(token, id, payload);
    const item = normalizeTestimonial(data.testimonial);
    setTestimonials((prev) => orderTestimonials(prev.map((entry) => (entry.id === id ? item : entry))));
    return item;
  };

  const deleteTestimonial = async (id) => {
    if (!token) throw new Error('You must be logged in as admin to delete testimonials.');
    await testimonialApi.remove(token, id);
    setTestimonials((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <TestimonialContext.Provider value={{
      testimonials,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      reloadTestimonials: loadTestimonials,
      loading,
      error,
    }}>
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) {
    throw new Error('useTestimonials must be used within a TestimonialProvider');
  }
  return context;
};
