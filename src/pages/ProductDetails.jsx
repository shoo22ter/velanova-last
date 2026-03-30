import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BadgeDollarSign, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();

  const product = useMemo(() => products.find((item) => item.id === id), [products, id]);
  const productSizes = Array.isArray(product?.sizes) ? product.sizes : [];
  const hasSizes = productSizes.length > 0;

  const firstAvailableSize =
    productSizes.find((variant) => Number(variant.stock || 0) > 0)?.size ||
    productSizes[0]?.size ||
    '';

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(firstAvailableSize);

  useEffect(() => {
    setQuantity(1);
    setSelectedSize(firstAvailableSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, firstAvailableSize]);

  if (!product) {
    return (
      <PageTransition>
        <div className="product-details-page">
          <div className="container details-shell">
            <div className="details-stage details-not-found">
              <h2>Product not found</h2>
              <p>The selected product could not be loaded. Please return to the shop and try again.</p>
              <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const currentPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const availableStock = hasSizes
    ? Number(productSizes.find((variant) => variant.size === selectedSize)?.stock || 0)
    : Number(product.stock || 0);

  const canAddToCart = hasSizes ? Boolean(selectedSize) && availableStock > 0 : availableStock > 0;

  const incrementQuantity = () => {
    if (!canAddToCart) return;
    setQuantity((prev) => Math.min(prev + 1, Math.max(1, availableStock)));
  };

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addToCart(product, quantity, hasSizes ? selectedSize : null);
  };

  return (
    <PageTransition>
      <div className="product-details-page">
        <div className="container details-shell">
          <section className="section-padding details-stage">
            <div className="details-breadcrumb-row">
              <Link to="/shop" className="details-back-link">
                <ArrowLeft size={16} /> Back to collection
              </Link>
              <span>{product.category} / Product Details</span>
            </div>

            <div className="details-main-grid">
              <ScrollReveal>
                <div className="details-image-panel">
                  {product.isOnSale && <span className="details-badge">On Sale</span>}
                  <img src={product.image} alt={product.name} className="details-image" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <div className="details-content-panel">
                  <p className="details-category">{product.category}</p>
                  <h1>{product.name}</h1>

                  <div className="details-price-row">
                    <strong>${Number(currentPrice).toFixed(2)}</strong>
                    {product.isOnSale && product.salePrice && (
                      <span style={{ textDecoration: 'line-through' }}>
                        ${Number(product.price).toFixed(2)}
                      </span>
                    )}
                    <span className={availableStock > 0 ? 'details-stock-ok' : 'details-stock-low'}>
                      {availableStock > 0 ? `${availableStock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <p className="details-description">{product.description}</p>

                  {hasSizes && (
                    <div className="details-size-panel">
                      <div className="details-size-head">
                        <strong>Select Size</strong>
                        <span>{selectedSize ? `Selected: ${selectedSize}` : 'Choose a size'}</span>
                      </div>

                      <div className="details-size-grid">
                        {productSizes.map((variant) => {
                          const soldOut = Number(variant.stock || 0) <= 0;
                          const active = selectedSize === variant.size;

                          return (
                            <button
                              key={variant.size}
                              type="button"
                              className={`details-size-chip ${active ? 'active' : ''}`}
                              disabled={soldOut}
                              onClick={() => !soldOut && setSelectedSize(variant.size)}
                            >
                              <span>{variant.size}</span>
                              <small>{soldOut ? 'Sold out' : `${variant.stock} left`}</small>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="details-actions-row">
                    <div className="details-quantity-control">
                      <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                        <Minus size={16} />
                      </button>
                      <span>{quantity}</span>
                      <button type="button" onClick={incrementQuantity}>
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      className="btn btn-primary details-add-btn"
                      disabled={!canAddToCart}
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag size={18} />
                      {canAddToCart ? 'Add Selected Product' : 'Unavailable'}
                    </button>
                  </div>

                  <div className="details-payment-panel">
                    <div className="details-payment-head">
                      <ShieldCheck size={18} />
                      <strong>Trusted checkout</strong>
                    </div>

                    <div className="details-payment-grid">
                      <div className="details-payment-card">
                        <Truck size={18} />
                        <div>
                          <strong>Fast local delivery</strong>
                          <span>Handled carefully with premium packaging and fast local fulfillment.</span>
                        </div>
                      </div>

                      <div className="details-payment-card">
                        <BadgeDollarSign size={18} />
                        <div>
                          <strong>Payment options</strong>
                          <span>Cash on Delivery and Wish Money are available for a smoother purchase.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="details-meta-grid">
                    <div>
                      <strong>Product ID</strong>
                      <span>{product.id}</span>
                    </div>
                    <div>
                      <strong>Category</strong>
                      <span>{product.category}</span>
                    </div>
                    <div>
                      <strong>Status</strong>
                      <span>{availableStock > 0 ? 'Available now' : 'Currently unavailable'}</span>
                    </div>
                    <div>
                      <strong>Selection</strong>
                      <span>{hasSizes ? (selectedSize || 'Select a size') : 'Single standard version'}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetails;
