import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, Package, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrdersContext';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';
import ProductForm from '../components/ProductForm';
import './Admin.css';

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefault } = useProducts();
  const { orders } = useOrders();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => {
      const name = String(product?.name ?? '').toLowerCase();
      const category = String(product?.category ?? '').toLowerCase();
      return name.includes(term) || category.includes(term);
    });
  }, [products, search]);

  const flash = (message, type = 'success') => {
    if (type === 'error') {
      setErrorMsg(message);
      window.clearTimeout(window.__velanovaAdminErrorFlash);
      window.__velanovaAdminErrorFlash = window.setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setSuccessMsg(message);
    window.clearTimeout(window.__velanovaAdminFlash);
    window.__velanovaAdminFlash = window.setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleAddProduct = (formData) => {
    try {
      addProduct(formData);
      setShowForm(false);
      flash('Product added successfully.');
    } catch (error) {
      flash('Failed to save product. Try a smaller image file.', 'error');
    }
  };

  const handleUpdateProduct = (formData) => {
    try {
      updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
      flash('Product updated successfully.');
    } catch (error) {
      flash('Failed to update product. Try a smaller image file.', 'error');
    }
  };

  const handleConfirmDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirm(null);
    flash('Product deleted.');
  };

  const handleReset = () => {
    if (window.confirm('Reset to default products? This cannot be undone.')) {
      resetToDefault();
      flash('Default products restored.');
    }
  };

  return (
    <PageTransition>
      <div className="page-shell page-top-space white-main">
        <section className="section-padding surface-white">
          <div className="container">
            <ScrollReveal>
              <div className="admin-shell">
                <div className="admin-topbar">
                  <div>
                    <p className="section-kicker">Management</p>
                    <h1 className="section-title admin-title">Admin Dashboard</h1>
                    <p className="admin-subcopy">Cleaner spacing, clearer controls, and a more professional product workspace.</p>
                  </div>

                  <div className="admin-stats-inline">
                    <div><strong>{products.length}</strong><span>Products</span></div>
                    <div><strong>{orders.length}</strong><span>Orders</span></div>
                  </div>
                </div>

                <div className="admin-tabbar">
                  <div className="admin-tab active">
                    <Package size={18} />
                    Products ({products.length})
                  </div>
                  <Link to="/orders" className="admin-tab">
                    <ShoppingCart size={18} />
                    Orders ({orders.length})
                  </Link>
                </div>

                {successMsg && <div className="admin-alert success">✓ {successMsg}</div>}
                {errorMsg && <div className="admin-alert" style={{ borderColor: '#f2d2d2', background: '#fff1f1', color: '#b42318' }}>⚠ {errorMsg}</div>}

                <div className="admin-actions-row">
                  <button
                    onClick={() => {
                      setShowForm(!showForm);
                      setEditingProduct(null);
                    }}
                    className="btn btn-gold"
                  >
                    <Plus size={16} />
                    {showForm ? 'Close Form' : 'Add Product'}
                  </button>

                  <button onClick={handleReset} className="btn btn-outline">Reset Products</button>

                  <div className="admin-searchbox">
                    <Search size={16} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search product or category"
                    />
                  </div>
                </div>

                {(showForm || editingProduct) && (
                  <ProductForm
                    product={editingProduct}
                    onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                  />
                )}

                <div className="admin-products-head">
                  <h3>All Products</h3>
                  <span>{filteredProducts.length} visible</span>
                </div>

                <div className="products-grid-admin">
                  {filteredProducts.length === 0 ? (
                    <div className="admin-empty-card">
                      <p>No products match your search.</p>
                    </div>
                  ) : (
                    filteredProducts.map((product) => {
                      const stock = Number(product.stock ?? 0);
                      const stockAlertLevel = Number(product.stockAlertLevel ?? 5);
                      const stockStatus =
                        stock <= 0 ? 'out' : stock <= stockAlertLevel ? 'low' : 'in';
                      const stockLabel =
                        stockStatus === 'out'
                          ? 'Out of stock'
                          : stockStatus === 'low'
                            ? `Low stock (${stock})`
                            : `In stock (${stock})`;

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="admin-card"
                        >
                          <div className="admin-card-image">
                            <img src={product.image} alt={product.name} />
                            {product.isNew && <span className="badge-new">NEW</span>}
                            {product.isOnSale && <span className="badge-sale">SALE</span>}
                          </div>

                          <div className="admin-card-content">
                            <h4>{product.name}</h4>
                            <p className="admin-card-meta">
                              {product.category} • {product.isOnSale && product.salePrice
                                ? (
                                  <>
                                    <span className="sale">${product.salePrice.toFixed(2)}</span>
                                    <span className="old">${product.price.toFixed(2)}</span>
                                  </>
                                )
                                : `$${product.price.toFixed(2)}`}
                            </p>

                            <div className={`admin-stock-badge ${stockStatus}`}>
                              {stockLabel}
                            </div>

                            <p className="admin-card-description">
                              {product.description.slice(0, 110)}{product.description.length > 110 ? '...' : ''}
                            </p>

                            <div className="admin-card-actions">
                              <button onClick={() => setEditingProduct(product)} className="btn-action btn-edit">
                                <Edit2 size={16} /> Edit
                              </button>
                              <button onClick={() => setDeleteConfirm(product.id)} className="btn-action btn-delete">
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>

                            {deleteConfirm === product.id && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="delete-confirm">
                                <p>Delete "{product.name}"?</p>
                                <div className="delete-confirm-actions">
                                  <button onClick={() => handleConfirmDelete(product.id)} className="btn-confirm btn-confirm-yes">
                                    Yes, Delete
                                  </button>
                                  <button onClick={() => setDeleteConfirm(null)} className="btn-confirm btn-confirm-no">
                                    Cancel
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Admin;
