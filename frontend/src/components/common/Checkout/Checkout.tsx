import React, { useState } from 'react';
import type {
  Product,
  ProductVariant,
  CustomerInfo,
  OrderItem,
  CartItem,
} from '../../../types';
import { Button } from '../Button';
import {
  formatPrice,
  calculateDeliveryCharge,
  validatePhoneNumber,
  validateEmail,
  validatePincode,
} from '../../../utils';
import { DELIVERY_CHARGES } from '../../../constants';
import './Checkout.css';

interface CheckoutProps {
  // For single product checkout (Order Now)
  product?: Product;
  variant?: ProductVariant;
  quantity?: number;
  // For cart checkout (Proceed to Checkout)
  cartItems?: CartItem[];
  cartSubtotal?: number;
  cartDeliveryCharge?: number;
  cartTotal?: number;

  onClose: () => void;
  onOrderConfirm: (orderData: {
    customerInfo: CustomerInfo;
    orderItems: OrderItem[];
    deliveryCharge: number;
    total: number;
  }) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  product,
  variant,
  quantity,
  cartItems,
  cartSubtotal,
  cartDeliveryCharge,
  cartTotal,
  onClose,
  onOrderConfirm,
}) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if this is a single product checkout or cart checkout
  const isCartCheckout = Boolean(cartItems && cartItems.length > 0);

  // Calculate totals based on checkout type
  const subtotal = isCartCheckout
    ? cartSubtotal || 0
    : (variant?.price || 0) * (quantity || 0);
  const deliveryCharge = isCartCheckout
    ? cartDeliveryCharge || 0
    : calculateDeliveryCharge(
        subtotal,
        DELIVERY_CHARGES.freeDeliveryThreshold,
        DELIVERY_CHARGES.standardCharge
      );
  const total = isCartCheckout ? cartTotal || 0 : subtotal + deliveryCharge;

  // Create order items based on checkout type
  const orderItems: OrderItem[] = isCartCheckout
    ? (cartItems || []).map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        variantId: item.variant.id,
        variantSize: item.variant.size,
        price: item.variant.price,
        quantity: item.quantity,
        total: item.variant.price * item.quantity,
      }))
    : product && variant && quantity
      ? [
          {
            productId: product.id,
            productName: product.name,
            variantId: variant.id,
            variantSize: variant.size,
            price: variant.price,
            quantity,
            total: variant.price * quantity,
          },
        ]
      : [];

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(customerInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (customerInfo.email && !validateEmail(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!customerInfo.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!customerInfo.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!validatePincode(customerInfo.pincode)) {
      newErrors.pincode = 'Please enter a valid pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error field for better UX
      const firstErrorField = document.querySelector('.form-input.error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstErrorField as HTMLElement).focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      onOrderConfirm({
        customerInfo,
        orderItems,
        deliveryCharge,
        total,
      });
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2 className="checkout-title">
            {isCartCheckout
              ? 'Complete Your Cart Order'
              : 'Complete Your Order'}
          </h2>
          <button className="checkout-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h3 className="summary-title">
              {isCartCheckout
                ? `Order Summary (${cartItems?.length || 0} items)`
                : 'Order Summary'}
            </h3>

            {isCartCheckout ? (
              // Multiple items from cart
              <div className="order-items">
                {cartItems?.map(item => (
                  <div
                    key={`${item.product.id}-${item.variant.id}`}
                    className="order-item"
                  >
                    <div className="item-image">
                      <img src={item.product.image} alt={item.product.name} />
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.product.name}</h4>
                      <p className="item-variant">Pack of {item.variant.size}</p>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.variant.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Single item from direct order
              product &&
              variant &&
              quantity && (
                <div className="order-item">
                  <div className="item-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">{product.name}</h4>
                    <p className="item-variant">{variant.size}</p>
                    <p className="item-quantity">Quantity: {quantity}</p>
                  </div>
                  <div className="item-price">
                    {formatPrice(variant.price * quantity)}
                  </div>
                </div>
              )
            )}

            <div className="pricing-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charge:</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="free-delivery">FREE</span>
                  ) : (
                    formatPrice(deliveryCharge)
                  )}
                </span>
              </div>
              <div className="price-row total-row">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {deliveryCharge === 0 && (
              <div className="delivery-message">
                🎉 You qualify for free delivery!
              </div>
            )}
          </div>

          {/* Customer Information Form */}
          <form className="customer-form" onSubmit={handleSubmit}>
            <h3 className="form-title">Delivery Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={customerInfo.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={customerInfo.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address (Optional)
              </label>
              <input
                type="email"
                id="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={customerInfo.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Delivery Address *
              </label>
              <textarea
                id="address"
                className={`form-input form-textarea ${errors.address ? 'error' : ''}`}
                value={customerInfo.address}
                onChange={e => handleInputChange('address', e.target.value)}
                placeholder="Enter complete delivery address"
                rows={3}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  value={customerInfo.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="pincode" className="form-label">
                  Pincode *
                </label>
                <input
                  type="text"
                  id="pincode"
                  className={`form-input ${errors.pincode ? 'error' : ''}`}
                  value={customerInfo.pincode}
                  onChange={e => handleInputChange('pincode', e.target.value)}
                  placeholder="Enter 6-digit pincode"
                />
                {errors.pincode && (
                  <span className="error-message">{errors.pincode}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                size="large"
                onClick={onClose}
                className="cancel-btn"
                disabled={isSubmitting}
                aria-label="Cancel order and close checkout"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={isSubmitting}
                className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                aria-label={
                  isSubmitting
                    ? 'Processing your order'
                    : `Place order for ${formatPrice(total)}`
                }
              >
                {isSubmitting ? (
                  <>
                    <span style={{ opacity: 0 }}>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>🛒</span>
                    Place Order - {formatPrice(total)}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
