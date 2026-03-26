import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

import { PageTransition, ScrollReveal, FadeIn } from '../components/ScrollReveal';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === id);
  
  if (!product) return <div className="container section-padding text-center" style={{paddingTop: '120px'}}><h2>Product not found</h2><Link to="/shop" className="btn btn-primary mt-4">Back to Shop</Link></div>;

  return (
    <PageTransition>
      <div className="product-details-page" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '80vh' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '50px', alignItems: 'center' }}>
            <ScrollReveal className="product-image-large">
              <img src={product.image} alt={product.name} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} />
            </ScrollReveal>
            <div className="product-info-detail">
              <ScrollReveal delay={0.2}>
                <p className="text-gold" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>{product.category}</p>
                <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{product.name}</h1>
                <p className="price" style={{ fontSize: '1.5rem', marginBottom: '30px' }}>${product.price.toFixed(2)}</p>
                <p className="description" style={{ color: 'var(--color-dark-gray)', marginBottom: '40px', lineHeight: '1.8' }}>
                  {product.description}
                </p>
                
                <div className="add-to-cart-container" style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                  <div className="quantity-selector" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '15px' }}><Minus size={16}/></button>
                    <span style={{ padding: '0 20px', fontWeight: '500' }}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '15px' }}><Plus size={16}/></button>
                  </div>
                  <button className="btn btn-primary" style={{ flex: 1, display: 'flex', gap: '10px' }} onClick={() => addToCart(product, quantity)}>
                    <ShoppingBag size={18} /> Add to Cart
                  </button>
                </div>
                
                <div className="product-meta" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', fontSize: '0.9rem', color: 'var(--color-dark-gray)' }}>
                  <p><strong>Shipping:</strong> Free shipping on orders over $150</p>
                  <p><strong>Returns:</strong> 30-day return policy</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
export default ProductDetails;
