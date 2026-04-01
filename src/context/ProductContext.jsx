import React, { createContext, useContext, useState, useEffect } from 'react';
import { productApi } from '../api/velanovaApi';
import { useUser } from './UserContext';

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
    salePrice: product.salePrice === '' || product.salePrice === null ? '' : product.salePrice,
    sizes,
    stock: hasSizes ? totalSizeStock(sizes) : Math.max(0, Number(product.stock ?? 0)),
    stockAlertLevel: Math.max(0, Number(product.stockAlertLevel ?? 5)),
    isNew: Boolean(product.isNew),
    isOnSale: Boolean(product.isOnSale),
  };
};

const normalizeProducts = (items) => (Array.isArray(items) ? items.map(normalizeProduct) : []);

export const ProductProvider = ({ children }) => {
  const { token } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productApi.list();
      setProducts(normalizeProducts(data?.products || []));
    } catch (err) {
      setError(err?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (newProduct) => {
    if (!token) throw new Error('You must be logged in as admin to add products.');
    const data = await productApi.create(token, newProduct);
    const product = normalizeProduct(data.product);
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = async (id, updatedData) => {
    if (!token) throw new Error('You must be logged in as admin to update products.');
    const data = await productApi.update(token, id, updatedData);
    const product = normalizeProduct(data.product);
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
    return product;
  };

  const deleteProduct = async (id) => {
    if (!token) throw new Error('You must be logged in as admin to delete products.');
    await productApi.remove(token, id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetToDefault = async () => {
    if (!token) throw new Error('You must be logged in as admin to reset products.');
    const data = await productApi.reset(token);
    setProducts(normalizeProducts(data?.products || []));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefault,
        reloadProducts: loadProducts,
        defaultVariants: DEFAULT_VARIANTS,
        loading,
        error,
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
