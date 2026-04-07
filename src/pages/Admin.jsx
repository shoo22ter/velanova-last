import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, Package, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrdersContext';
import { useBanners } from '../context/BannerContext';
import { useTestimonials } from '../context/TestimonialContext';
import { useFaqs } from '../context/FaqContext';
import { useSettings } from '../context/SettingsContext';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';
import ProductForm from '../components/ProductForm';
import BannerForm from '../components/BannerForm';
import TestimonialForm from '../components/TestimonialForm';
import FaqForm from '../components/FaqForm';
import SettingsForm from '../components/SettingsForm';
import './Admin.css';

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefault, loading, error } = useProducts();
  const { orders } = useOrders();
  const { banners, addBanner, updateBanner, deleteBanner, loading: bannersLoading, error: bannersError } = useBanners();
  const {
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    loading: testimonialsLoading,
    error: testimonialsError,
  } = useTestimonials();
  const { faqs, addFaq, updateFaq, deleteFaq, loading: faqsLoading, error: faqsError } = useFaqs();
  const { settings, updateSettings, loading: settingsLoading, error: settingsError } = useSettings();

  const [activeTab, setActiveTab] = useState('products');

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');

  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteBannerConfirm, setDeleteBannerConfirm] = useState(null);

  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deleteTestimonialConfirm, setDeleteTestimonialConfirm] = useState(null);

  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deleteFaqConfirm, setDeleteFaqConfirm] = useState(null);

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

  const switchTab = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    setEditingProduct(null);
    setDeleteConfirm(null);
    setShowBannerForm(false);
    setEditingBanner(null);
    setDeleteBannerConfirm(null);
    setShowTestimonialForm(false);
    setEditingTestimonial(null);
    setDeleteTestimonialConfirm(null);
    setShowFaqForm(false);
    setEditingFaq(null);
    setDeleteFaqConfirm(null);
  };

  const handleAddProduct = async (formData) => {
    try {
      await addProduct(formData);
      setShowForm(false);
      flash('Product added successfully.');
    } catch (err) {
      flash(err?.message || 'Failed to save product. Try a smaller image file.', 'error');
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      await updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
      flash('Product updated successfully.');
    } catch (err) {
      flash(err?.message || 'Failed to update product. Try a smaller image file.', 'error');
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      flash('Product deleted.');
    } catch (err) {
      flash(err?.message || 'Failed to delete product.', 'error');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset to default products? This cannot be undone.')) {
      try {
        await resetToDefault();
        flash('Default products restored.');
      } catch (err) {
        flash(err?.message || 'Failed to reset products.', 'error');
      }
    }
  };

  const handleAddBanner = async (formData) => {
    try {
      await addBanner(formData);
      setShowBannerForm(false);
      flash('Banner added successfully.');
    } catch (err) {
      flash(err?.message || 'Failed to save banner.', 'error');
    }
  };

  const handleUpdateBanner = async (formData) => {
    try {
      await updateBanner(editingBanner.id, formData);
      setEditingBanner(null);
      flash('Banner updated successfully.');
    } catch (err) {
      flash(err?.message || 'Failed to update banner.', 'error');
    }
  };

  const handleConfirmDeleteBanner = async (id) => {
    try {
      await deleteBanner(id);
      setDeleteBannerConfirm(null);
      flash('Banner deleted.');
    } catch (err) {
      flash(err?.message || 'Failed to delete banner.', 'error');
    }
  };

  const handleAddTestimonial = async (formData) => {
    try {
      await addTestimonial(formData);
      setShowTestimonialForm(false);
      flash('Testimonial added successfully.');
    } catch (err) {
      flash(err?.message || 'Failed to save testimonial.', 'error');
    }
  };

  const handleUpdateTestimonial = async (formData) => {
    try {
      await updateTestimonial(editingTestimonial.id, formData);
      setEditingTestimonial(null);
      flash('Testimonial updated successfully.');
    } catch (err) {
      flash(err?.message || 'Failed to update testimonial.', 'error');
    }
  };

  const handleConfirmDeleteTestimonial = async (id) => {
    try {
      await deleteTestimonial(id);
      setDeleteTestimonialConfirm(null);
      flash('Testimonial deleted.');
    } catch (err) {
      flash(err?.message || 'Failed to delete testimonial.', 'error');
    }
  };

  const handleAddFaq = async (formData) => {
    try {
      await addFaq(formData);
      setShowFaqForm(false);
      flash('FAQ added successfully.');
    } catch (err) {
      flash(err?.message || 'Failed to save FAQ.', 'error');
    }
  };

  const handleUpdateFaq = async (formData) => {
    try {
      await updateFaq(editingFaq.id, formData);
      setEditingFaq(null);
      flash('FAQ updated successfully.');
    } catch (err) {
      flash(err?.message || 'Failed to update FAQ.', 'error');
    }
  };

  const handleConfirmDeleteFaq = async (id) => {
    try {
      await deleteFaq(id);
      setDeleteFaqConfirm(null);
      flash('FAQ deleted.');
    } catch (err) {
      flash(err?.message || 'Failed to delete FAQ.', 'error');
    }
  };

  const handleUpdateSettings = async (formData) => {
    try {
      await updateSettings(formData);
      flash('Settings saved successfully.');
    } catch (err) {
      flash(err?.message || 'Failed to update settings.', 'error');
    }
  };

  const activeError = errorMsg || (
    activeTab === 'products'
      ? error
      : activeTab === 'banners'
        ? bannersError
        : activeTab === 'testimonials'
          ? testimonialsError
          : activeTab === 'faqs'
            ? faqsError
            : activeTab === 'settings'
              ? settingsError
              : ''
  );

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
                    <p className="admin-subcopy">Keep your content fresh with full control over products, banners, testimonials, FAQs, and site settings.</p>
                  </div>

                  <div className="admin-stats-inline">
                    <div><strong>{products.length}</strong><span>Products</span></div>
                    <div><strong>{orders.length}</strong><span>Orders</span></div>
                  </div>
                </div>

                <div className="admin-tabbar">
                  <button type="button" className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => switchTab('products')}>
                    <Package size={18} />
                    Products ({products.length})
                  </button>
                  <button type="button" className={`admin-tab ${activeTab === 'banners' ? 'active' : ''}`} onClick={() => switchTab('banners')}>
                    Banners ({banners.length})
                  </button>
                  <button type="button" className={`admin-tab ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => switchTab('testimonials')}>
                    Testimonials ({testimonials.length})
                  </button>
                  <button type="button" className={`admin-tab ${activeTab === 'faqs' ? 'active' : ''}`} onClick={() => switchTab('faqs')}>
                    FAQs ({faqs.length})
                  </button>
                  <button type="button" className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => switchTab('settings')}>
                    Site Settings
                  </button>
                  <Link to="/orders" className="admin-tab">
                    <ShoppingCart size={18} />
                    Orders ({orders.length})
                  </Link>
                </div>

                {successMsg && <div className="admin-alert success">✓ {successMsg}</div>}
                {activeError && (
                  <div className="admin-alert" style={{ borderColor: '#f2d2d2', background: '#fff1f1', color: '#b42318' }}>
                    ⚠ {activeError}
                  </div>
                )}

                {activeTab === 'products' && (
                  <>
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
                      {loading ? (
                        <div className="admin-empty-card">
                          <p>Loading products...</p>
                        </div>
                      ) : filteredProducts.length === 0 ? (
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
                  </>
                )}

                {activeTab === 'banners' && (
                  <>
                    <div className="admin-actions-row">
                      <button
                        onClick={() => {
                          setShowBannerForm(!showBannerForm);
                          setEditingBanner(null);
                        }}
                        className="btn btn-gold"
                      >
                        <Plus size={16} />
                        {showBannerForm ? 'Close Form' : 'Add Banner'}
                      </button>
                    </div>

                    {(showBannerForm || editingBanner) && (
                      <BannerForm
                        banner={editingBanner}
                        onSubmit={editingBanner ? handleUpdateBanner : handleAddBanner}
                        onCancel={() => {
                          setShowBannerForm(false);
                          setEditingBanner(null);
                        }}
                      />
                    )}

                    <div className="admin-products-head">
                      <h3>All Banners</h3>
                      <span>{banners.length} total</span>
                    </div>

                    <div className="products-grid-admin">
                      {bannersLoading ? (
                        <div className="admin-empty-card">
                          <p>Loading banners...</p>
                        </div>
                      ) : banners.length === 0 ? (
                        <div className="admin-empty-card">
                          <p>No banners added yet.</p>
                        </div>
                      ) : (
                        banners.map((banner) => (
                          <motion.div
                            key={banner.id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="admin-card"
                          >
                            <div className="admin-card-image">
                              <img src={banner.image} alt={banner.title} />
                              {!banner.isActive && <span className="badge-inactive">INACTIVE</span>}
                            </div>

                            <div className="admin-card-content">
                              <h4>{banner.title}</h4>
                              {banner.subtitle && <p className="admin-card-subtitle">{banner.subtitle}</p>}
                              <div className="admin-meta-row">
                                <span>CTA: {banner.ctaLabel || 'None'}</span>
                                <span>Order: {banner.sortOrder}</span>
                                <span>Status: {banner.isActive ? 'Active' : 'Hidden'}</span>
                              </div>

                              <div className="admin-card-actions">
                                <button onClick={() => setEditingBanner(banner)} className="btn-action btn-edit">
                                  <Edit2 size={16} /> Edit
                                </button>
                                <button onClick={() => setDeleteBannerConfirm(banner.id)} className="btn-action btn-delete">
                                  <Trash2 size={16} /> Delete
                                </button>
                              </div>

                              {deleteBannerConfirm === banner.id && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="delete-confirm">
                                  <p>Delete "{banner.title}"?</p>
                                  <div className="delete-confirm-actions">
                                    <button onClick={() => handleConfirmDeleteBanner(banner.id)} className="btn-confirm btn-confirm-yes">
                                      Yes, Delete
                                    </button>
                                    <button onClick={() => setDeleteBannerConfirm(null)} className="btn-confirm btn-confirm-no">
                                      Cancel
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'testimonials' && (
                  <>
                    <div className="admin-actions-row">
                      <button
                        onClick={() => {
                          setShowTestimonialForm(!showTestimonialForm);
                          setEditingTestimonial(null);
                        }}
                        className="btn btn-gold"
                      >
                        <Plus size={16} />
                        {showTestimonialForm ? 'Close Form' : 'Add Testimonial'}
                      </button>
                    </div>

                    {(showTestimonialForm || editingTestimonial) && (
                      <TestimonialForm
                        testimonial={editingTestimonial}
                        onSubmit={editingTestimonial ? handleUpdateTestimonial : handleAddTestimonial}
                        onCancel={() => {
                          setShowTestimonialForm(false);
                          setEditingTestimonial(null);
                        }}
                      />
                    )}

                    <div className="admin-products-head">
                      <h3>All Testimonials</h3>
                      <span>{testimonials.length} total</span>
                    </div>

                    <div className="products-grid-admin">
                      {testimonialsLoading ? (
                        <div className="admin-empty-card">
                          <p>Loading testimonials...</p>
                        </div>
                      ) : testimonials.length === 0 ? (
                        <div className="admin-empty-card">
                          <p>No testimonials added yet.</p>
                        </div>
                      ) : (
                        testimonials.map((testimonial) => (
                          <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="admin-card"
                          >
                            <div className="admin-card-content">
                              <div className="admin-card-header">
                                {testimonial.avatar && (
                                  <img src={testimonial.avatar} alt={testimonial.name} className="admin-avatar" />
                                )}
                                <div>
                                  <h4>{testimonial.name}</h4>
                                  {testimonial.role && <p className="admin-card-subtitle">{testimonial.role}</p>}
                                </div>
                              </div>

                              <p className="admin-card-description">"{testimonial.quote}"</p>

                              <div className="admin-meta-row">
                                <span>Rating: {testimonial.rating}/5</span>
                                <span>Order: {testimonial.sortOrder}</span>
                                <span>Status: {testimonial.isActive ? 'Active' : 'Hidden'}</span>
                              </div>

                              <div className="admin-card-actions">
                                <button onClick={() => setEditingTestimonial(testimonial)} className="btn-action btn-edit">
                                  <Edit2 size={16} /> Edit
                                </button>
                                <button onClick={() => setDeleteTestimonialConfirm(testimonial.id)} className="btn-action btn-delete">
                                  <Trash2 size={16} /> Delete
                                </button>
                              </div>

                              {deleteTestimonialConfirm === testimonial.id && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="delete-confirm">
                                  <p>Delete "{testimonial.name}"?</p>
                                  <div className="delete-confirm-actions">
                                    <button onClick={() => handleConfirmDeleteTestimonial(testimonial.id)} className="btn-confirm btn-confirm-yes">
                                      Yes, Delete
                                    </button>
                                    <button onClick={() => setDeleteTestimonialConfirm(null)} className="btn-confirm btn-confirm-no">
                                      Cancel
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'faqs' && (
                  <>
                    <div className="admin-actions-row">
                      <button
                        onClick={() => {
                          setShowFaqForm(!showFaqForm);
                          setEditingFaq(null);
                        }}
                        className="btn btn-gold"
                      >
                        <Plus size={16} />
                        {showFaqForm ? 'Close Form' : 'Add FAQ'}
                      </button>
                    </div>

                    {(showFaqForm || editingFaq) && (
                      <FaqForm
                        faq={editingFaq}
                        onSubmit={editingFaq ? handleUpdateFaq : handleAddFaq}
                        onCancel={() => {
                          setShowFaqForm(false);
                          setEditingFaq(null);
                        }}
                      />
                    )}

                    <div className="admin-products-head">
                      <h3>All FAQs</h3>
                      <span>{faqs.length} total</span>
                    </div>

                    <div className="products-grid-admin">
                      {faqsLoading ? (
                        <div className="admin-empty-card">
                          <p>Loading FAQs...</p>
                        </div>
                      ) : faqs.length === 0 ? (
                        <div className="admin-empty-card">
                          <p>No FAQs added yet.</p>
                        </div>
                      ) : (
                        faqs.map((faq) => (
                          <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="admin-card"
                          >
                            <div className="admin-card-content">
                              <h4>{faq.question}</h4>
                              <p className="admin-card-description">{faq.answer}</p>
                              <div className="admin-meta-row">
                                <span>Order: {faq.sortOrder}</span>
                                <span>Status: {faq.isActive ? 'Active' : 'Hidden'}</span>
                              </div>

                              <div className="admin-card-actions">
                                <button onClick={() => setEditingFaq(faq)} className="btn-action btn-edit">
                                  <Edit2 size={16} /> Edit
                                </button>
                                <button onClick={() => setDeleteFaqConfirm(faq.id)} className="btn-action btn-delete">
                                  <Trash2 size={16} /> Delete
                                </button>
                              </div>

                              {deleteFaqConfirm === faq.id && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="delete-confirm">
                                  <p>Delete this FAQ?</p>
                                  <div className="delete-confirm-actions">
                                    <button onClick={() => handleConfirmDeleteFaq(faq.id)} className="btn-confirm btn-confirm-yes">
                                      Yes, Delete
                                    </button>
                                    <button onClick={() => setDeleteFaqConfirm(null)} className="btn-confirm btn-confirm-no">
                                      Cancel
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'settings' && (
                  <>
                    {settingsLoading ? (
                      <div className="admin-empty-card">
                        <p>Loading settings...</p>
                      </div>
                    ) : (
                      <SettingsForm settings={settings} onSubmit={handleUpdateSettings} />
                    )}
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Admin;
