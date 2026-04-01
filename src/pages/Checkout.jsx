import React, { useMemo, useState } from 'react';
import { CheckCircle2, CreditCard, Download, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';
import './Checkout.css';

const COD_FEE = 4;
const WISH_FEE = 4;

const generateOrderId = () => {
  const random = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1).toUpperCase();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `VLV-${date}-${random}`;
};

const loadJsPDF = () => {
  return new Promise((resolve, reject) => {
    if (window.jspdf && window.jspdf.jsPDF) return resolve(window.jspdf);
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    script.onload = () => (window.jspdf ? resolve(window.jspdf) : reject(new Error('jsPDF failed to load')));
    script.onerror = () => reject(new Error('Failed to load jsPDF script'));
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cartTotal, cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placed, setPlaced] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  const deliveryFee = paymentMethod === 'Cash on Delivery' ? COD_FEE : WISH_FEE;
  const grandTotal = useMemo(() => cartTotal + deliveryFee, [cartTotal, deliveryFee]);

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    ['firstName', 'lastName', 'phone', 'address', 'city'].forEach((field) => {
      if (!customerInfo[field].trim()) nextErrors[field] = 'This field is required';
    });
    if (customerInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      nextErrors.email = 'Enter a valid email address';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderData = {
      id: generateOrderId(),
      date: new Date().toLocaleString(),
      customerInfo,
      paymentMethod,
      items: cart,
      subTotal: cartTotal,
      deliveryFee,
      total: grandTotal,
      status: 'Pending',
    };

    setIsPlacing(true);
    setPlaceError('');
    try {
      const created = await addOrder(orderData);
      setReceipt(created || orderData);
      clearCart();
      setPlaced(true);
    } catch (error) {
      setPlaceError(error?.message || 'Could not place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  const downloadReceiptPDF = async () => {
    if (!receipt) return;
    try {
      const jsPDFLibrary = await loadJsPDF();
      const { jsPDF } = jsPDFLibrary;
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
      const margin = 14;
      let y = 20;

      pdf.setFontSize(18);
      pdf.text('Velanova Order Receipt', margin, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.text(`Order ID: ${receipt.id}`, margin, y); y += 6;
      pdf.text(`Date: ${receipt.date}`, margin, y); y += 6;
      pdf.text(`Payment: ${receipt.paymentMethod}`, margin, y); y += 10;

      receipt.items.forEach((item) => {
        const line = `${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ''} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        pdf.text(line, margin, y);
        y += 6;
      });

      y += 4;
      pdf.text(`Subtotal: $${receipt.subTotal.toFixed(2)}`, margin, y); y += 6;
      pdf.text(`Delivery: $${receipt.deliveryFee.toFixed(2)}`, margin, y); y += 6;
      pdf.setFontSize(13);
      pdf.text(`Total: $${receipt.total.toFixed(2)}`, margin, y);

      pdf.save(`velanova-receipt-${receipt.id}.pdf`);
    } catch (error) {
      alert('Could not generate PDF receipt. Please try again.');
    }
  };

  if (cart.length === 0 && !placed) {
    return (
      <PageTransition>
        <div className="checkout-page">
          <div className="container checkout-shell">
            <div className="checkout-empty">
              <h2>Your cart is empty</h2>
              <p>Return to the collection and add your favorite products first.</p>
              <Link to="/shop" className="btn btn-primary">Return to Shop</Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (placed && receipt) {
    return (
      <PageTransition>
        <div className="checkout-page">
          <div className="container checkout-shell">
            <div className="checkout-success">
              <div className="checkout-success-icon">
                <CheckCircle2 size={36} />
              </div>
              <p className="checkout-kicker">Order placed</p>
              <h2>Thank you for your order.</h2>
              <p>Your order is confirmed and your beauty essentials are now being prepared. Save your receipt below and continue exploring the collection whenever you are ready.</p>

              <div className="checkout-success-receipt">
                <div className="checkout-success-row">
                  <span>Order ID</span>
                  <strong>{receipt.id}</strong>
                </div>
                <div className="checkout-success-row">
                  <span>Date</span>
                  <strong>{receipt.date}</strong>
                </div>
                <div className="checkout-success-row">
                  <span>Payment</span>
                  <strong>{receipt.paymentMethod}</strong>
                </div>
                <div className="checkout-success-row total">
                  <span>Total</span>
                  <strong>${receipt.total.toFixed(2)}</strong>
                </div>
              </div>

              <div className="checkout-success-actions">
                <button onClick={downloadReceiptPDF} className="btn btn-outline">
                  <Download size={16} /> Download receipt
                </button>
                <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="checkout-page">
        <section className="section-padding">
          <div className="container checkout-shell">
            <ScrollReveal>
              <div className="checkout-stage">
                <div className="checkout-header">
                  <div>
                    <p className="checkout-kicker">Checkout</p>
                    <h1>Complete your order</h1>
                    <p>Minimal, clean, and focused on trust. Fill your details and confirm the order.</p>
                  </div>
                  <Link to="/cart" className="checkout-back-link">Back to cart</Link>
                </div>

                <div className="checkout-progress">
                  <div className="checkout-progress-step active">
                    <span>1</span>
                    <div><strong>Cart reviewed</strong><small>Your selected products are ready.</small></div>
                  </div>
                  <div className="checkout-progress-step active">
                    <span>2</span>
                    <div><strong>Delivery details</strong><small>Complete your information securely.</small></div>
                  </div>
                  <div className="checkout-progress-step">
                    <span>3</span>
                    <div><strong>Order confirmation</strong><small>Receive your receipt and delivery summary.</small></div>
                  </div>
                </div>

                <div className="checkout-layout-grid">
                  <ScrollReveal>
                    <div className="checkout-form-panel">
                      <form onSubmit={handlePlaceOrder}>
                        <div className="checkout-section-block">
                          <div className="checkout-section-head">
                            <p className="checkout-summary-kicker">Delivery details</p>
                            <h3>Customer information</h3>
                            <p>Please enter the information required for delivery so your order reaches you quickly and without friction.</p>
                          </div>

                          <div className="grid grid-2 checkout-form-grid">
                            {[
                              ['firstName', 'First name'],
                              ['lastName', 'Last name'],
                              ['phone', 'Phone number'],
                              ['email', 'Email (optional)'],
                              ['address', 'Address'],
                              ['city', 'City'],
                            ].map(([name, label]) => (
                              <div className="form-group" key={name}>
                                <label>{label}</label>
                                <input
                                  name={name}
                                  value={customerInfo[name]}
                                  onChange={handleCustomerInfoChange}
                                  className="form-control"
                                  placeholder={label}
                                />
                                {errors[name] && <span className="field-error">{errors[name]}</span>}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="checkout-section-block">
                          <div className="checkout-section-head">
                            <p className="checkout-summary-kicker">Payment method</p>
                            <h3>Choose how you want to pay</h3>
                          </div>

                          {[
                            {
                              name: 'Cash on Delivery',
                              icon: <Truck size={20} />,
                              text: 'Pay on delivery. Delivery fee applies.',
                            },
                            {
                              name: 'Wish Money',
                              icon: <CreditCard size={20} />,
                              text: 'Pay through Wish Money with the same delivery fee.',
                            },
                          ].map((method) => (
                            <button
                              type="button"
                              key={method.name}
                              onClick={() => setPaymentMethod(method.name)}
                              className={`payment-card ${paymentMethod === method.name ? 'active' : ''}`}
                            >
                              <div className="payment-card-icon">{method.icon}</div>
                              <div className="payment-card-copy">
                                <strong>{method.name}</strong>
                                <small>{method.text}</small>
                              </div>
                            </button>
                          ))}

                          {placeError && <div className="field-error" style={{ marginBottom: '12px' }}>{placeError}</div>}
                          <button type="submit" className="btn btn-primary btn-full checkout-submit-btn" disabled={isPlacing}>
                            {isPlacing ? 'Placing order...' : `Place Order Securely — $${grandTotal.toFixed(2)}`}
                          </button>
                        </div>
                      </form>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.08}>
                    <aside className="checkout-summary-panel">
                      <p className="checkout-summary-kicker">Summary</p>
                      <h3>Your order</h3>

                      <div className="checkout-items-list">
                        {cart.map((item) => (
                          <div key={item.cartKey || item.id} className="checkout-summary-item">
                            <img src={item.image} alt={item.name} />
                            <div>
                              <strong>{item.name}</strong>
                              <span>
                                Qty: {item.quantity}
                                {item.selectedSize ? ` • ${item.selectedSize}` : ''}
                              </span>
                            </div>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="checkout-summary-totals">
                        <div><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div>
                        <div><span>Delivery fee</span><strong>${deliveryFee.toFixed(2)}</strong></div>
                        <div className="checkout-total-row"><span>Total</span><strong>${grandTotal.toFixed(2)}</strong></div>
                      </div>

                      <div className="checkout-summary-note">
                        <strong>{paymentMethod}</strong>
                        <p>
                          {paymentMethod === 'Wish Money'
                            ? 'Digital payment with a simple delivery process and the same shipping fee.'
                            : 'Pay when your order arrives. Fast local delivery supported.'}
                        </p>
                      </div>

                      <div className="checkout-trust-strip">
                        <div><ShieldCheck size={16} /> Safe order flow</div>
                        <div><Truck size={16} /> Local delivery support</div>
                      </div>
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

export default Checkout;
