import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, ShoppingCart } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';
import './Orders.css';

const Orders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc': return new Date(b.date) - new Date(a.date);
      case 'date-asc': return new Date(a.date) - new Date(b.date);
      case 'total-desc': return b.total - a.total;
      case 'total-asc': return a.total - b.total;
      default: return 0;
    }
  });

  const downloadOrderAsCSV = (order) => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Address', 'Status', 'Total'];
    const row = [
      order.id,
      new Date(order.date).toLocaleDateString(),
      `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      order.customerInfo.email,
      order.customerInfo.phone,
      `${order.customerInfo.address}, ${order.customerInfo.city}`,
      order.status,
      `$${order.total.toFixed(2)}`,
    ];
    const csv = [headers, row].map((e) => `"${e.join('","')}"`).join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `order-${order.id}.csv`;
    link.click();
  };

  const statusClass = (status) => `status-badge status-${status.toLowerCase()}`;

  return (
    <PageTransition>
      <div className="page-shell page-top-space white-main">
        <section className="section-padding surface-white">
          <div className="container">
            <ScrollReveal>
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
                <p className="section-kicker">Order history</p>
                <h1 className="section-title" style={{ textAlign: 'left' }}>Track and manage orders</h1>
                <p className="section-copy" style={{ margin: 0, maxWidth: '680px', textAlign: 'left' }}>
                  Cleaner cards, better status badges, and clearer item details.
                </p>
              </div>
            </ScrollReveal>

            {orders.length === 0 ? (
              <ScrollReveal>
                <div className="empty-state">
                  <ShoppingCart size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
                  <h2>No Orders Yet</h2>
                  <p>You have not placed any orders yet. Start shopping to see your order history here.</p>
                </div>
              </ScrollReveal>
            ) : (
              <>
                <ScrollReveal>
                  <div className="orders-controls">
                    <div className="control-group">
                      <label>Filter by status</label>
                      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All Orders</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label>Sort by</label>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="total-desc">Highest Price</option>
                        <option value="total-asc">Lowest Price</option>
                      </select>
                    </div>

                    <div className="results-count">
                      Showing {sortedOrders.length} of {orders.length} orders
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="orders-list">
                    {sortedOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="order-item"
                      >
                        <div
                          className="order-item-header"
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        >
                          <div className="order-item-info">
                            <div className="order-item-id">{order.id}</div>
                            <div className="order-item-date">{new Date(order.date).toLocaleDateString()}</div>
                          </div>

                          <div className="order-item-customer">
                            <div className="customer-name">
                              {order.customerInfo.firstName} {order.customerInfo.lastName}
                            </div>
                            <div className="customer-email">{order.customerInfo.email || 'No email added'}</div>
                          </div>

                          <div className="order-item-items">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>

                          <div className="order-item-total">${order.total.toFixed(2)}</div>

                          <div className={statusClass(order.status)}>
                            {order.status}
                          </div>

                          <div className="order-item-expand">
                            <motion.div
                              animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={20} />
                            </motion.div>
                          </div>
                        </div>

                        <motion.div
                          initial={false}
                          animate={{
                            height: expandedOrder === order.id ? 'auto' : 0,
                            opacity: expandedOrder === order.id ? 1 : 0,
                          }}
                          transition={{ duration: 0.25 }}
                          className="order-item-expanded"
                        >
                          <div className="order-detail-content">
                            <div className="detail-section">
                              <h4>Delivery details</h4>
                              <p>{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                              <p>{order.customerInfo.address}</p>
                              <p>{order.customerInfo.city}</p>
                              <p>{order.customerInfo.phone}</p>
                              <p>{order.customerInfo.email || 'No email added'}</p>
                            </div>

                            <div className="detail-section">
                              <h4>Items ordered</h4>
                              <div className="ordered-items">
                                {order.items.map((item, i) => (
                                  <div key={item.cartKey || `${item.id}-${i}`} className="ordered-item">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-details">
                                      <span>
                                        Qty: {item.quantity}
                                        {item.selectedSize ? ` • ${item.selectedSize}` : ''}
                                      </span>
                                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Order summary</h4>
                              <div className="order-summary">
                                <div className="summary-row"><span>Subtotal</span><span>${order.subTotal.toFixed(2)}</span></div>
                                <div className="summary-row"><span>Delivery Fee</span><span>${order.deliveryFee.toFixed(2)}</span></div>
                                <div className="summary-row total"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Payment method</h4>
                              <p>{order.paymentMethod || 'Cash on Delivery'}</p>
                            </div>

                            <div className="detail-section">
                              <h4>Update status</h4>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="status-select"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>

                            <div className="detail-section">
                              <h4>Export order</h4>
                              <button onClick={() => downloadOrderAsCSV(order)} className="btn-download">
                                <Download size={16} /> Download CSV
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollReveal>
              </>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Orders;
