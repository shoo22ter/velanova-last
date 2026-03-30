import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';
import './Shop.css';

const Shop = () => {
  const { products } = useProducts();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Sale', ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        filter === 'All' ||
        (filter === 'Sale' && product.isOnSale) ||
        product.category === filter;

      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [products, filter, search]);

  return (
    <PageTransition>
      <div className="shop-page">
        <section className="section-padding">
          <div className="container shop-shell">
            <ScrollReveal>
              <div className="shop-hero">
                <p className="shop-kicker">Velanova Collection</p>
                <h1>Minimal shop experience with a cleaner luxury layout.</h1>
                <p className="shop-intro">
                  Discover the full catalog in a refined all-white storefront designed
                  for clarity, premium presentation, and easy browsing.
                </p>

                <div className="shop-stats">
                  <div>
                    <span>{products.length}</span>
                    <p>Products available</p>
                  </div>
                  <div>
                    <span>{categories.length - 1}</span>
                    <p>Curated categories</p>
                  </div>
                  <div>
                    <span>{products.filter((item) => item.isOnSale).length}</span>
                    <p>Current sale pieces</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="shop-toolbar">
                <div className="shop-toolbar-top">
                  <p className="shop-toolbar-title">Find your perfect product</p>
                  <span className="shop-toolbar-meta">
                    {products.length} total • {categories.length - 1} categories
                  </span>
                </div>

                <div className="shop-search-center">
                  <div className="shop-search-wrap">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Search products, categories, or notes"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="shop-filter-group">
                  <div className="shop-filter-label">
                    <SlidersHorizontal size={16} />
                    Filter collection
                  </div>

                  <div className="shop-filter-pills">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className={`shop-pill ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <div className="shop-results-row">
                <p>
                  Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <span>{filter === 'All' ? 'All products' : `Filtered by ${filter}`}</span>
              </div>
            </ScrollReveal>

            {filteredProducts.length === 0 ? (
              <div className="shop-empty">
                <h3>No products match this search.</h3>
                <p>
                  Try another keyword or switch to a different category to explore the
                  collection.
                </p>
                <button
                  type="button"
                  className="shop-reset-btn"
                  onClick={() => {
                    setSearch('');
                    setFilter('All');
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="products-grid shop-grid">
                {filteredProducts.map((product, idx) => (
                  <ScrollReveal key={product.id} delay={idx * 0.04}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Shop;
