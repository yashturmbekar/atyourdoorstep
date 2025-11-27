import React, { useRef, useEffect, useState } from 'react';
import type { CartItem } from '../../../types';
import { Button } from '../Button';
import { formatPrice } from '../../../utils';
import { useCart } from '../../../hooks';
import './Cart.css';

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const cartItemsRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      if (cartItemsRef.current) {
        const { scrollHeight, clientHeight } = cartItemsRef.current;
        setShowScrollHint(scrollHeight > clientHeight);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    return () => window.removeEventListener('resize', checkScrollable);
  }, [cart.items]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      clearCart();
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-modal" onClick={e => e.stopPropagation()}>
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button className="cart-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some delicious products to get started!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div
          className={`cart-header ${showScrollHint ? 'has-scroll-content' : ''}`}
        >
          <h2>Shopping Cart ({cart.itemCount} items)</h2>
          <button className="cart-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-items" ref={cartItemsRef}>
          {showScrollHint && (
            <div className="scroll-hint-message">
              <span>Scroll to see more items ↓</span>
            </div>
          )}
          {cart.items.map((item: CartItem) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.product.image} alt={item.product.name} />
              </div>

              <div className="cart-item-details">
                <h4 className="cart-item-name">{item.product.name}</h4>
                <p className="cart-item-variant">Pack of {item.variant.size}</p>
                <p className="cart-item-price">
                  {formatPrice(item.variant.price)} per {item.variant.size}
                </p>
              </div>

              <div className="cart-item-controls">
                <div className="cart-quantity-controls">
                  <button
                    className="cart-quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="cart-quantity-display">{item.quantity}</span>
                  <button
                    className="cart-quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  {formatPrice(item.variant.price * item.quantity)}
                </div>

                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>

          <div className="cart-total">
            <div className="cart-total-breakdown">
              <div className="cart-total-line">
                <span>Subtotal ({cart.itemCount} items):</span>
                <span className="cart-subtotal-amount">
                  {formatPrice(cart.subtotal || 0)}
                </span>
              </div>
              <div className="cart-total-line">
                <span>Delivery Charge:</span>
                <span className="cart-delivery-amount">
                  {(cart.deliveryCharge || 0) === 0 ? (
                    <span className="free-delivery">FREE</span>
                  ) : (
                    formatPrice(cart.deliveryCharge || 0)
                  )}
                </span>
              </div>
              <div className="cart-total-line cart-final-total">
                <span>Total:</span>
                <span className="cart-total-amount">
                  {formatPrice(cart.total || 0)}
                </span>
              </div>
            </div>
            {(cart.deliveryCharge || 0) === 0 && (cart.subtotal || 0) > 0 && (
              <div className="delivery-message">
                🎉 You qualify for free delivery!
              </div>
            )}
          </div>

          <div className="cart-checkout">
            <Button
              variant="primary"
              size="large"
              className="checkout-btn"
              onClick={onCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
