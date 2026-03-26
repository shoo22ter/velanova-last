import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import { PageTransition, ScrollReveal } from '../components/ScrollReveal';

const Checkout = () => {
  const { cartTotal, cart } = useCart();

  if (cart.length === 0) {
    return (
      <PageTransition>
        <div className="container section-padding text-center" style={{ paddingTop: '150px', minHeight: '60vh' }}>
          <ScrollReveal>
            <h2>Your cart is empty</h2>
            <Link to="/shop" className="btn btn-primary mt-4">Return to Shop</Link>
          </ScrollReveal>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <ScrollReveal>
          <h1 className="section-title">Checkout</h1>
        </ScrollReveal>
        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '50px' }}>
          <ScrollReveal>
            <h3 style={{ marginBottom: '20px' }}>Shipping Information</h3>
            <form>
              <div className="grid grid-2" style={{ gap: '20px' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-control" placeholder="Jane" required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-control" placeholder="Doe" required />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" className="form-control" placeholder="123 Luxury Ave" required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" className="form-control" placeholder="New York" required />
              </div>
              
              <h3 style={{ margin: '40px 0 20px' }}>Payment Method</h3>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" className="form-control" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="grid grid-2" style={{ gap: '20px' }}>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" className="form-control" placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" className="form-control" placeholder="123" />
                </div>
              </div>
              <button type="button" className="btn btn-black btn-full" style={{ marginTop: '30px', backgroundColor: 'var(--color-black)', color: 'var(--color-white)', padding: '15px' }} onClick={() => alert('Order placed successfully! (Demo)')}>Place Order &mdash; ${(cartTotal + 15).toFixed(2)}</button>
            </form>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} className="order-summary" style={{ backgroundColor: 'var(--color-light-gray)', padding: '30px', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.name}</p>
                    <p style={{ color: 'var(--color-dark-gray)', fontSize: '0.8rem' }}>Qty: {item.quantity}</p>
                    <p className="text-gold" style={{ fontSize: '0.9rem' }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Shipping</span><span>$15.00</span>
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Total</span><span>${(cartTotal + 15).toFixed(2)}</span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
};
export default Checkout;
