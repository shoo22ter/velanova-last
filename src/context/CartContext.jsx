import React, { createContext, useEffect, useMemo, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const makeCartKey = (productId, selectedSize) => `${productId}__${selectedSize || 'default'}`;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('velanova-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('velanova-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  const clearToast = () => setToast(null);

  const addToCart = (product, quantity = 1, selectedSize = null) => {
    const cartKey = makeCartKey(product.id, selectedSize);
    let wasExisting = false;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        wasExisting = true;
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          cartKey,
          selectedSize,
          quantity,
        },
      ];
    });

    showToast(
      wasExisting
        ? `${product.name} quantity updated in your cart.`
        : `${product.name} added to your cart.`,
    );
  };

  const removeFromCart = (cartKey) => {
    let removedItem = null;
    setCart((prev) => {
      removedItem = prev.find((item) => item.cartKey === cartKey);
      return prev.filter((item) => item.cartKey !== cartKey);
    });

    if (removedItem) showToast(`${removedItem.name} removed from your cart.`, 'info');
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCart((prev) => prev.map((item) => (item.cartKey === cartKey ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setCart([]);
    showToast('Your cart has been cleared.', 'info');
  };

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [cart]
  );

  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        clearCart,
        toast,
        clearToast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
