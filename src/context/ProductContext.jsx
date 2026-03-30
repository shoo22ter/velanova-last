import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/mockData';

const ProductContext = createContext();

const DEFAULT_VARIANTS = ['30ml', '50ml', '100ml'];

const normalizeSizes = (sizes, fallbackStock = 0) => {
  if (!Array.isArray(sizes) || sizes.length === 0) return [];

  return sizes
    .map((entry) => {
      if (typeof entry === 'string') {
        return { size: entry, stock: 0 };
      }
      return {
        size: String(entry.size || '').trim(),
        stock: Math.max(0, Number(entry.stock || 0)),
      };
    })
    .filter((entry) => entry.size);
};

const totalSizeStock = (sizes) => sizes.reduce((sum, item) => sum + Number(item.stock || 0), 0);

const normalizeProduct = (product) => {
  const sizes = normalizeSizes(product.sizes, product.stock || 0);
  const hasSizes = sizes.length > 0;

  return {
    ...product,
    salePrice: product.salePrice === '' ? '' : product.salePrice,
    sizes,
    stock: hasSizes ? totalSizeStock(sizes) : Math.max(0, Number(product.stock ?? 0)),
    stockAlertLevel: Math.max(0, Number(product.stockAlertLevel ?? 5)),
    isNew: Boolean(product.isNew),
    isOnSale: Boolean(product.isOnSale),
  };
};

const normalizeProducts = (items) => Array.isArray(items) ? items.map(normalizeProduct) : [];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('velanova_products');
    const source = saved ? JSON.parse(saved) : initialProducts;
    const normalized = normalizeProducts(source);

    // Ensure SALE/NEW flags always exist for older localStorage data versions
    // so badges render consistently across Home/Shop cards.
    let shouldPersistNormalized = false;
    const patched = normalized.map((p) => {
      const hasIsNew = Object.prototype.hasOwnProperty.call(p, 'isNew');
      const hasIsOnSale = Object.prototype.hasOwnProperty.call(p, 'isOnSale');
      const next = {
        ...p,
        isNew: hasIsNew ? Boolean(p.isNew) : false,
        isOnSale: hasIsOnSale ? Boolean(p.isOnSale) : false,
      };

      if (!hasIsNew || !hasIsOnSale) shouldPersistNormalized = true;
      return next;
    });

    if (shouldPersistNormalized) {
      localStorage.setItem('velanova_products', JSON.stringify(patched));
    }

    return patched;
  });

  useEffect(() => {
    try {
      localStorage.setItem('velanova_products', JSON.stringify(products));
    } catch (error) {
      if (error?.name === 'QuotaExceededError') {
        console.error('Storage full: product changes could not be persisted.', error);
      } else {
        console.error('Failed to save product data.', error);
      }
    }
  }, [products]);

  const addProduct = (newProduct) => {
    const product = normalizeProduct({
      ...newProduct,
      id: `p${Date.now()}`,
    });

    setProducts((prev) => [...prev, product]);
    return product;
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? normalizeProduct({ ...p, ...updatedData }) : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetToDefault = () => {
    const normalizedDefaults = normalizeProducts(initialProducts);
    setProducts(normalizedDefaults);
    localStorage.removeItem('velanova_products');
  };

  const reduceStock = (productId, quantity, selectedSize = null) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;

        if (selectedSize && Array.isArray(p.sizes) && p.sizes.length > 0) {
          const nextSizes = p.sizes.map((variant) =>
            variant.size === selectedSize
              ? { ...variant, stock: Math.max(0, Number(variant.stock || 0) - quantity) }
              : variant
          );
          return { ...p, sizes: nextSizes, stock: totalSizeStock(nextSizes) };
        }

        return { ...p, stock: Math.max(0, Number(p.stock || 0) - quantity) };
      })
    );
  };

  const updateStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? normalizeProduct({ ...p, stock: Math.max(0, Number(newStock || 0)) }) : p
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefault,
        reduceStock,
        updateStock,
        defaultVariants: DEFAULT_VARIANTS,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
