import React, { createContext, useEffect, useMemo, useState, useContext, useCallback } from 'react';
import { cartApi } from '../api/velanovaApi';
import { useUser } from './UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const makeCartKey = (productId, selectedSize) => `${productId}__${selectedSize || 'default'}`;

const STORAGE_KEY = 'velanova-cart';

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useUser();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // ─── Load cart ───────────────────────────────────────────────────────────
  const loadCart = useCallback(async () => {
    if (isAuthenticated && token) {
      setCartLoading(true);
      try {
        // Merge any guest localStorage items into the DB cart first
        const localRaw = localStorage.getItem(STORAGE_KEY);
        const localItems = localRaw ? JSON.parse(localRaw) : [];
        if (localItems.length > 0) {
          localStorage.removeItem(STORAGE_KEY);
          const data = await cartApi.sync(token, localItems);
          setCart(data?.items || []);
        } else {
          const data = await cartApi.list(token);
          setCart(data?.items || []);
        }
      } catch {
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    } else {
      // Guest: read from localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      setCart(saved ? JSON.parse(saved) : []);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Persist to localStorage for guests only
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  // ─── Toast ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'success') =>
    setToast({ id: Date.now(), message, type });

  const clearToast = () => setToast(null);

  // ─── Add to cart ──────────────────────────────────────────────────────────
  const addToCart = async (product, quantity = 1, selectedSize = null) => {
    const cartKey = makeCartKey(product.id, selectedSize);
    const price =
      product.isOnSale && product.salePrice
        ? Number(product.salePrice)
        : Number(product.price);

    if (isAuthenticated && token) {
      try {
        const data = await cartApi.add(token, {
          productId: product.id,
          name: product.name,
          image: product.image || '',
          price,
          quantity,
          selectedSize: selectedSize || null,
          cartKey,
        });
        setCart(data?.items || []);
        showToast(`${product.name} added to your cart.`);
      } catch {
        showToast('Could not update cart. Please try again.', 'error');
      }
    } else {
      // Guest: localStorage only
      let wasExisting = false;
      setCart((prev) => {
        const existing = prev.find((item) => item.cartKey === cartKey);
        if (existing) {
          wasExisting = true;
          return prev.map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [
          ...prev,
          { ...product, cartKey, selectedSize, quantity, price },
        ];
      });
      showToast(
        wasExisting
          ? `${product.name} quantity updated in your cart.`
          : `${product.name} added to your cart.`,
      );
    }
  };

  // ─── Remove from cart ─────────────────────────────────────────────────────
  const removeFromCart = async (cartKey) => {
    if (isAuthenticated && token) {
      try {
        const data = await cartApi.remove(token, cartKey);
        setCart(data?.items || []);
        showToast('Item removed from your cart.', 'info');
      } catch {
        showToast('Could not remove item.', 'error');
      }
    } else {
      let removedItem = null;
      setCart((prev) => {
        removedItem = prev.find((item) => item.cartKey === cartKey);
        return prev.filter((item) => item.cartKey !== cartKey);
      });
      if (removedItem) showToast(`${removedItem.name} removed from your cart.`, 'info');
    }
  };

  // ─── Update quantity ──────────────────────────────────────────────────────
  const updateQuantity = async (cartKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }

    if (isAuthenticated && token) {
      try {
        const data = await cartApi.update(token, cartKey, quantity);
        setCart(data?.items || []);
      } catch {
        showToast('Could not update quantity.', 'error');
      }
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity } : item,
        ),
      );
    }
  };

  // ─── Clear cart ───────────────────────────────────────────────────────────
  const clearCart = async () => {
    if (isAuthenticated && token) {
      try {
        await cartApi.clear(token);
        setCart([]);
        showToast('Your cart has been cleared.', 'info');
      } catch {
        showToast('Could not clear cart.', 'error');
      }
    } else {
      setCart([]);
      showToast('Your cart has been cleared.', 'info');
    }
  };

  // ─── Derived values ───────────────────────────────────────────────────────
  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
    [cart],
  );

  const cartCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart],
  );

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
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
