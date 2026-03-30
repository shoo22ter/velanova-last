import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartToast.css';

const CartToast = () => {
  const { toast, clearToast } = useCart();

  if (!toast) return null;

  return (
    <div className={`cart-toast ${toast.type || 'success'}`} role="status" aria-live="polite">
      <div className="cart-toast-icon">
        {toast.type === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />}
      </div>
      <div className="cart-toast-copy">
        <strong>{toast.type === 'info' ? 'Updated' : 'Added to cart'}</strong>
        <span>{toast.message}</span>
      </div>
      <button type="button" className="cart-toast-close" onClick={clearToast} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
};

export default CartToast;
