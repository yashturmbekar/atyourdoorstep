/**
 * OrderPage - Dynamic Content from ContentService
 * Displays products by category with data from CMS
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  Product,
  ProductVariant,
  Order,
  CustomerInfo,
  OrderItem,
} from '../types';
import {
  Header,
  Footer,
  Checkout,
  OrderTracker,
  Cart,
} from '../components/common';
import { ProductCard } from '../components/common/ProductCard';
import { useCart } from '../hooks';
import {
  useActiveCategories,
  useProductsByCategory,
} from '../hooks/useContent';
import { generateId } from '../utils';
import { PRODUCTS } from '../constants';
import './OrderPage.css';

// Fallback category info when API is not available
const FALLBACK_CATEGORY_INFO: Record<
  string,
  {
    title: string;
    description: string;
    season: string;
    image: string;
  }
> = {
  alphonso: {
    title: 'Alphonso Mangoes',
    description:
      'Fresh, premium quality Alphonso mangoes - the king of mangoes. Sweet, juicy, and aromatic.',
    season: 'Mid-March - May-End',
    image: '/images/mangoes-carousel.png',
  },
  jaggery: {
    title: 'Jaggery Products',
    description:
      'Pure, organic jaggery products made from sugarcane using traditional methods.',
    season: 'Year-round',
    image: '/images/jaggery-carousel.png',
  },
  oil: {
    title: 'Cold-Pressed Oils',
    description:
      'Pure cold-pressed oils extracted using traditional methods. Rich in nutrients and flavor.',
    season: 'Year-round',
    image: '/images/cold-pressed-oil-carousel.png',
  },
};

export const OrderPage = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const { cart, clearCart } = useCart();

  // Fetch dynamic content from ContentService
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useActiveCategories();
  const { data: productsResponse, isLoading: productsLoading } =
    useProductsByCategory(category || '');

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

  // Build category info from API or fallback
  const categoryInfo = useMemo(() => {
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      const dynamicInfo: Record<
        string,
        { title: string; description: string; season: string; image: string }
      > = {};
      categoriesResponse.data.forEach(cat => {
        const slug = cat.slug || cat.id;
        dynamicInfo[slug] = {
          title: cat.name,
          description:
            cat.description ||
            `Premium quality ${cat.name.toLowerCase()} products.`,
          season: 'Year-round',
          image: cat.imageUrl || '/images/placeholder.png',
        };
      });
      return { ...FALLBACK_CATEGORY_INFO, ...dynamicInfo };
    }
    return FALLBACK_CATEGORY_INFO;
  }, [categoriesResponse]);

  // Get valid category slugs
  const validCategories = useMemo(() => {
    return Object.keys(categoryInfo);
  }, [categoryInfo]);

  // Transform API products to component format or use fallback
  const filteredProducts: Product[] = useMemo(() => {
    // First try to get products from API
    if (productsResponse?.data && productsResponse.data.length > 0) {
      return productsResponse.data.map(apiProduct => ({
        id: apiProduct.id,
        name: apiProduct.name,
        category: apiProduct.categorySlug || category || '',
        image: apiProduct.primaryImageUrl || '/images/placeholder.png',
        description:
          apiProduct.shortDescription || apiProduct.fullDescription || '',
        features: apiProduct.features || [],
        variants: apiProduct.variants?.map(v => ({
          id: v.id,
          size: v.size || 'Standard',
          price: v.price || apiProduct.basePrice,
          unit: v.unit || 'unit',
          inStock: v.isAvailable && v.stockQuantity > 0,
        })) || [
          {
            id: apiProduct.id,
            size: 'Standard',
            price: apiProduct.basePrice,
            unit: 'unit',
            inStock: true,
          },
        ],
      }));
    }

    // Fallback to hardcoded PRODUCTS constant
    return PRODUCTS.filter(
      product => category && product.category === category
    );
  }, [productsResponse, category]);

  // Redirect to home if invalid category (after loading completes)
  useEffect(() => {
    if (!categoriesLoading && category && !validCategories.includes(category)) {
      navigate('/', { replace: true });
    }
  }, [category, validCategories, categoriesLoading, navigate]);

  // Scroll to top when component mounts or category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  // Order handlers
  const handleOrderNow = (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => {
    setCheckoutData({ product, variant, quantity });
    setIsCartCheckout(false);
    setShowCheckout(true);
  };

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
    // Navigate back to home page after order completion
    navigate('/', { replace: true });
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

  // Navigate to different category
  const handleCategorySwitch = (newCategory: string) => {
    navigate(`/order/${newCategory}`, { replace: true });
  };

  // Early return if no category or loading
  if (!category) {
    return null;
  }

  const currentCategoryInfo =
    categoryInfo[category] || FALLBACK_CATEGORY_INFO.alphonso;

  const isLoading = categoriesLoading || productsLoading;

  return (
    <div className="order-page">
      <Header onCartClick={handleShowCart} />

      <main className="order-page-main">
        {/* Category Header */}
        <section className="order-page-header">
          <div className="container">
            <div className="order-page-title-section">
              <h1 className="order-page-title">
                {isLoading ? 'Loading...' : currentCategoryInfo.title}
              </h1>

              {/* Category Navigation - Compact Mode */}
              <div className="category-navigation-compact">
                <span className="nav-label">Explore other products:</span>
                {Object.entries(categoryInfo)
                  .filter(([key]) => key !== category)
                  .slice(0, 5) // Limit to 5 other categories
                  .map(([key, info], index, array) => (
                    <>
                      <button
                        key={key}
                        className="category-nav-link-compact"
                        onClick={() => handleCategorySwitch(key)}
                        aria-label={`Switch to ${info.title} category`}
                        title={`Explore ${info.title}`}
                      >
                        {info.title}
                      </button>
                      {index < array.length - 1 && (
                        <span className="nav-separator">•</span>
                      )}
                    </>
                  ))}
              </div>
            </div>

            <div className="order-page-description-section">
              <p className="order-page-description">
                {isLoading
                  ? 'Loading product information...'
                  : currentCategoryInfo.description}
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="order-page-products">
          <div className="container">
            <div className="section-header">
              <h2>Available Products</h2>
              <p>
                Choose from our premium selection of{' '}
                {currentCategoryInfo.title.toLowerCase()}
              </p>
            </div>

            {isLoading ? (
              <div className="products-loading">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <div
                className={`products-grid products-count-${filteredProducts.length}`}
              >
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOrderNow={handleOrderNow}
                  />
                ))}
              </div>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <h3>No products available</h3>
                <p>Products in this category are currently unavailable</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Modal */}
      {showCart && (
        <Cart onClose={handleCartClose} onCheckout={handleCartCheckout} />
      )}

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
    </div>
  );
};
