import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderApi } from '../api/velanovaApi';
import { useUser } from './UserContext';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const { token } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    if (!token) {
      setOrders([]);
      setError('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await orderApi.list(token);
      setOrders(data?.orders || []);
    } catch (err) {
      setError(err?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const addOrder = async (orderData) => {
    if (!token) throw new Error('You must be logged in to place an order.');
    const data = await orderApi.create(token, orderData);
    const order = data.order;
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!token) throw new Error('You must be logged in as admin to update orders.');
    const data = await orderApi.updateStatus(token, orderId, newStatus);
    const nextOrder = data.order;
    setOrders((prev) => prev.map((order) => (order.id === orderId ? nextOrder : order)));
    return nextOrder;
  };

  const deleteOrder = async (orderId) => {
    if (!token) throw new Error('You must be logged in as admin to delete orders.');
    await orderApi.remove(token, orderId);
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((order) => order.status === 'Pending').length;
    const completedOrders = orders.filter((order) => order.status === 'Delivered').length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    };
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      getOrderById,
      getOrderStats,
      refreshOrders: loadOrders,
      loading,
      error,
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
