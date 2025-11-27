import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type {
  Product,
  ProductVariant,
  Order,
  CustomerInfo,
  OrderItem,
} from '../types';
import {
  Header,
  Hero,
  About,
  Services,
  WhyChooseUs,
  Testimonials,
  Contact,
  Footer,
  Checkout,
  OrderTracker,
  Cart,
} from '../components/common';
import { useCart } from '../hooks';
import { generateId } from '../utils';

export const HomePage = () => {
  const { cart, clearCart } = useCart();
  const location = useLocation();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderTracker, setShowOrderTracker] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    product: Product;
    variant: ProductVariant;
    quantity: number;
  } | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isCartCheckout, setIsCartCheckout] = useState(false);

  // Handle hash fragment navigation
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1); // Remove the # character
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure the page has loaded
      }
    }
  }, [location.hash]);

  const handleCheckoutClose = () => {
    setShowCheckout(false);
    setCheckoutData(null);
    setIsCartCheckout(false);
  };

  const handleOrderConfirm = (orderData: {
    customerInfo: CustomerInfo;
    orderItems: OrderItem[];
    deliveryCharge: number;
    total: number;
  }) => {
    // Create order with estimated delivery date (3-5 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(
      estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 3
    );

    const order: Order = {
      id: generateId().toUpperCase(),
      customerInfo: orderData.customerInfo,
      items: orderData.orderItems,
      subtotal: orderData.orderItems.reduce((sum, item) => sum + item.total, 0),
      deliveryCharge: orderData.deliveryCharge,
      total: orderData.total,
      status: 'confirmed',
      orderDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      estimatedDelivery,
    };

    setCompletedOrder(order);
    setShowCheckout(false);
    setCheckoutData(null);
    setIsCartCheckout(false);
    setShowOrderTracker(true);

    // Clear cart if it was a cart checkout
    if (isCartCheckout) {
      clearCart();
    }
  };

  const handleOrderTrackerClose = () => {
    setShowOrderTracker(false);
    setCompletedOrder(null);
  };

  // Cart handlers
  const handleShowCart = () => {
    setShowCart(true);
  };

  const handleCartClose = () => {
    setShowCart(false);
  };

  const handleCartCheckout = () => {
    setShowCart(false);
    setIsCartCheckout(true);
    setShowCheckout(true);
  };

  return (
    <div className="homepage">
      <Header onCartClick={handleShowCart} />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          // Single product checkout props
          product={checkoutData?.product}
          variant={checkoutData?.variant}
          quantity={checkoutData?.quantity}
          // Cart checkout props
          cartItems={isCartCheckout ? cart.items : undefined}
          cartSubtotal={isCartCheckout ? cart.subtotal : undefined}
          cartDeliveryCharge={isCartCheckout ? cart.deliveryCharge : undefined}
          cartTotal={isCartCheckout ? cart.total : undefined}
          onClose={handleCheckoutClose}
          onOrderConfirm={handleOrderConfirm}
        />
      )}

      {/* Order Tracker Modal */}
      {showOrderTracker && completedOrder && (
        <OrderTracker
          order={completedOrder}
          onClose={handleOrderTrackerClose}
        />
      )}

      {/* Cart Modal */}
      {showCart && (
        <Cart onClose={handleCartClose} onCheckout={handleCartCheckout} />
      )}
    </div>
  );
};
