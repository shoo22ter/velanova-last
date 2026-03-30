import React, { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('velanova_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('velanova_orders', JSON.stringify(orders));
  }, [orders]);

  // Add new order
  const addOrder = (orderData) => {
    const order = {
      id: orderData.id,
      date: orderData.date,
      customerInfo: orderData.customerInfo,
      paymentMethod: orderData.paymentMethod,
      items: orderData.items,
      subTotal: orderData.subTotal,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      status: 'Pending', // Pending, Processing, Shipped, Delivered, Cancelled
    };
    setOrders(prevOrders => [order, ...prevOrders]); // Newest first
    return order;
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Delete order
  const deleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // Get orders statistics
  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const completedOrders = orders.filter(order => order.status === 'Delivered').length;

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
