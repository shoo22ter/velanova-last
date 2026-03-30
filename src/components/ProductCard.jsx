import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const currentPrice = product.isOnSale && product.salePrice ? Number(product.salePrice) : Number(product.price);
  const originalPrice = Number(product.price);
  const discount = product.isOnSale && product.salePrice
    ? Math.max(0, Math.round(((originalPrice - currentPrice) / originalPrice) * 100))
    : 0;

  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [added]);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, 1, product.sizes?.[0] || null);
    setAdded(true);
  };

  return (
    <article className="product-card modern">
      <Link to={`/product/${product.id}`} className="product-image-wrap" aria-label={`View ${product.name}`}>
        <div className="product-badges">
          {product.isNew && <span className="product-badge badge-new">New</span>}
          {product.isOnSale && product.salePrice && (
            <span className="product-badge badge-sale">-{discount}%</span>
          )}
        </div>

        <img src={product.image} alt={product.name} />

        <div className="product-card-overlay">
          <button
            type="button"
            className={`product-overlay-btn ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
            {added ? 'Added to cart' : 'Add to cart'}
          </button>
        </div>
      </Link>

      <div className="product-info">
        <p className="category">{product.category}</p>
        <div className="product-title-row">
          <h3>{product.name}</h3>
          <span className="product-cta-chip">
            <ShoppingBag size={14} />
            Add
          </span>
        </div>

        <p className="product-description">
          {product.description?.slice(0, 88) || 'Refined care essential designed for your daily ritual.'}
          {product.description?.length > 88 ? '…' : ''}
        </p>

        <div className="price">
          {product.isOnSale && product.salePrice ? (
            <>
              <span className="sale">${currentPrice.toFixed(2)}</span>
              <span className="old">${originalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="regular">${currentPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
