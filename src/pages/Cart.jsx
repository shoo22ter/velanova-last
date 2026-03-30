import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <PageTransition>
        <div className="cart-page">
          <div className="container cart-shell">
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingBag size={34} />
              </div>
              <p className="cart-kicker">Your bag is waiting</p>
              <h2>Your cart is empty</h2>
              <p>Add your favorite products to continue with checkout.</p>
              <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="cart-page">
        <section className="section-padding">
          <div className="container cart-shell">
            <ScrollReveal>
              <div className="cart-stage">
                <div className="cart-header">
                  <div>
                    <p className="cart-kicker">Cart</p>
                    <h1>Your selected products</h1>
                    <p>Review your selections, update quantities with ease, and move to checkout with a smoother premium flow.</p>
                  </div>

                  <div className="cart-payment-hint">
                    <ShieldCheck size={22} />
                    <div>
                      <strong>Trusted checkout</strong>
                      <span>Simple payment options and fast local delivery.</span>
                    </div>
                  </div>
                </div>

                <div className="cart-feedback-strip">
                  <div className="cart-feedback-card">
                    <Sparkles size={18} />
                    <div>
                      <strong>Polished cart experience</strong>
                      <span>Faster controls, clearer totals, and an easier path to purchase.</span>
                    </div>
                  </div>
                  <div className="cart-feedback-card">
                    <Truck size={18} />
                    <div>
                      <strong>Delivery with care</strong>
                      <span>Your order is prepared for fast local delivery with premium presentation.</span>
                    </div>
                  </div>
                </div>

                <div className="cart-layout-grid">
                  <div className="cart-items-column">
                    {cart.map((item, idx) => (
                      <ScrollReveal key={item.cartKey || item.id} delay={idx * 0.04}>
                        <div className="cart-luxury-item">
                          <Link to={`/product/${item.id}`} className="cart-item-image-wrap">
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                          </Link>

                          <div className="cart-item-copy">
                            <p className="cart-item-category">{item.category}</p>
                            <Link to={`/product/${item.id}`}>
                              <h3>{item.name}</h3>
                            </Link>

                            {item.selectedSize && (
                              <div className="cart-size-badge">
                                Selected size: <strong>{item.selectedSize}</strong>
                              </div>
                            )}

                            <p className="cart-item-description">
                              {item.description ? item.description.slice(0, 120) : 'Premium product selected for your order.'}
                              {item.description && item.description.length > 120 ? '...' : ''}
                            </p>

                            <div className="cart-item-controls">
                              <div className="cart-quantity-pill">
                                <button
                                  onClick={() => updateQuantity(item.cartKey || item.id, item.quantity - 1)}
                                  aria-label="decrease quantity"
                                >
                                  <Minus size={16} />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.cartKey || item.id, item.quantity + 1)}
                                  aria-label="increase quantity"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.cartKey || item.id)}
                                className="cart-remove-btn"
                                aria-label="remove product"
                              >
                                <Trash2 size={16} />
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="cart-item-pricing">
                            <span className="cart-item-unit-price">${Number(item.price || 0).toFixed(2)} each</span>
                            <strong>${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</strong>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>

                  <ScrollReveal delay={0.08}>
                    <aside className="cart-summary-panel">
                      <p className="cart-summary-kicker">Order summary</p>
                      <h3>Ready for checkout</h3>

                      <div className="cart-summary-rows">
                        <div className="cart-summary-row">
                          <span>Items</span>
                          <strong>{cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</strong>
                        </div>
                        <div className="cart-summary-row">
                          <span>Subtotal</span>
                          <strong>${cartTotal.toFixed(2)}</strong>
                        </div>
                        <div className="cart-summary-row">
                          <span>Shipping</span>
                          <strong>Calculated at checkout</strong>
                        </div>
                        <div className="cart-summary-row total">
                          <span>Total</span>
                          <strong>${cartTotal.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className="cart-summary-note">
                        <p>Available payment methods</p>
                        <div className="cart-method-list">
                          <div className="cart-method-card">
                            <Truck size={18} />
                            <div>
                              <strong>Cash on Delivery</strong>
                              <span>Fast local delivery with payment on arrival.</span>
                            </div>
                          </div>
                          <div className="cart-method-card">
                            <ShieldCheck size={18} />
                            <div>
                              <strong>Wish Money</strong>
                              <span>Simple digital payment with the same delivery flow.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Link to="/checkout" className="btn btn-primary btn-full">
                        Proceed to Checkout <ArrowRight size={16} />
                      </Link>
                      <Link to="/shop" className="btn btn-outline btn-full cart-continue-link">Continue Shopping</Link>
                    </aside>
                  </ScrollReveal>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Cart;
