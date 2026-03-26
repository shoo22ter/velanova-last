import React, { useState } from 'react';
import { products } from '../data/mockData';
import ProductCard from '../components/ProductCard';

import { PageTransition, ScrollReveal } from '../components/ScrollReveal';

const Shop = () => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <PageTransition>
      <div className="shop-page" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container section-padding">
          <ScrollReveal>
            <div className="section-title">
              <h2>Our Collection</h2>
              <p className="text-gold" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Curated for your radiance</p>
            </div>
            
            <div className="category-filters text-center mb-4" style={{ marginBottom: '40px' }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`btn mx-2 ${filter === cat ? 'btn-gold' : 'btn-outline'}`}
                  onClick={() => setFilter(cat)}
                  style={{ margin: '0 10px' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
          
          <div className="grid grid-3">
            {filteredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} delay={idx * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Shop;
