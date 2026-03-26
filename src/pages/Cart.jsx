import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus } from 'lucide-react';

import { PageTransition, ScrollReveal } from '../components/ScrollReveal';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <PageTransition>
        <div className="container section-padding text-center" style={{ paddingTop: '150px', minHeight: '70vh' }}>
          <ScrollReveal>
            <h2 style={{ marginBottom: '20px' }}>Your Cart is Empty</h2>
            <p style={{ color: 'var(--color-dark-gray)', marginBottom: '40px' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </ScrollReveal>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <ScrollReveal>
          <h1 className="section-title">Your Cart</h1>
        </ScrollReveal>
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          <div className="cart-items">
            {cart.map((item, idx) => (
              <ScrollReveal key={item.id} delay={idx * 0.1}>
                <div className="cart-item" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '20px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100px', height: '120px', objectFit: 'cover' }} />
                  <div className="item-details" style={{ flex: 1 }}>
                    <Link to={`/product/${item.id}`}><h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3></Link>
                    <p className="text-gold" style={{ marginBottom: '15px' }}>${item.price.toFixed(2)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div className="quantity-selector" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', width: 'fit-content' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '8px 12px' }}><Minus size={14}/></button>
                        <span style={{ padding: '0 15px', fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '8px 12px' }}><Plus size={14}/></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', background: 'none' }}><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <div className="item-total text-right">
                    <p style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal delay={0.2} className="cart-summary" style={{ backgroundColor: 'var(--color-light-gray)', padding: '30px', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-full" style={{ width: '100%', backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>Proceed to Checkout</Link>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
};
export default Cart;
