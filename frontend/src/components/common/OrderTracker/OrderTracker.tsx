import React from 'react';
import type { Order } from '../../../types';
import { Button } from '../Button';
import { formatPrice, formatDate } from '../../../utils';
import './OrderTracker.css';

interface OrderTrackerProps {
  order: Order;
  onClose: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  order,
  onClose,
}) => {
  const getStatusIcon = (status: Order['status']): string => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'processing':
        return '📦';
      case 'shipped':
        return '🚛';
      case 'delivered':
        return '🎉';
      case 'cancelled':
        return '❌';
      default:
        return '📝';
    }
  };

  const getStatusText = (status: Order['status']): string => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'confirmed':
        return 'Order Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="order-tracker-overlay">
      <div className="order-tracker-modal">
        <div className="order-tracker-header">
          <div className="order-success-icon">🎉</div>
          <h2 className="order-tracker-title">Order Placed Successfully!</h2>
          <p className="order-tracker-subtitle">
            Thank you for your order. We'll deliver it to your doorstep.
          </p>
        </div>

        <div className="order-tracker-content">
          <div className="order-details">
            <div className="order-info-section">
              <h3 className="section-title">Order Information</h3>
              <div className="order-info-grid">
                <div className="info-item">
                  <span className="info-label">Order ID:</span>
                  <span className="info-value">{order.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order Date:</span>
                  <span className="info-value">
                    {formatDate(order.orderDate)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value status-badge">
                    {getStatusIcon(order.status)} {getStatusText(order.status)}
                  </span>
                </div>
                {order.estimatedDelivery && (
                  <div className="info-item">
                    <span className="info-label">Estimated Delivery:</span>
                    <span className="info-value">
                      {formatDate(order.estimatedDelivery)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="customer-info-section">
              <h3 className="section-title">Delivery Information</h3>
              <div className="customer-info">
                <p>
                  <strong>Name:</strong> {order.customerInfo.name}
                </p>
                <p>
                  <strong>Phone:</strong> {order.customerInfo.phone}
                </p>
                {order.customerInfo.email && (
                  <p>
                    <strong>Email:</strong> {order.customerInfo.email}
                  </p>
                )}
                <p>
                  <strong>Address:</strong>
                </p>
                <div className="address-details">
                  {order.customerInfo.address}
                  <br />
                  {order.customerInfo.city}, {order.customerInfo.pincode}
                </div>
              </div>
            </div>

            <div className="order-items-section">
              <h3 className="section-title">Order Items</h3>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <h4 className="item-name">{item.productName}</h4>
                      <p className="item-details">
                        Size: {item.variantSize} | Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="item-total">{formatPrice(item.total)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-summary-section">
              <h3 className="section-title">Order Summary</h3>
              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Charge:</span>
                  <span>
                    {order.deliveryCharge === 0 ? (
                      <span className="free-delivery">FREE</span>
                    ) : (
                      formatPrice(order.deliveryCharge)
                    )}
                  </span>
                </div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-actions">
            <Button
              variant="primary"
              size="large"
              onClick={onClose}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </Button>
          </div>

          <div className="order-contact-info">
            <p className="contact-text">
              Need help with your order? Contact us at{' '}
              <a href="tel:+919876543210" className="contact-link">
                +91 98765 43210
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
