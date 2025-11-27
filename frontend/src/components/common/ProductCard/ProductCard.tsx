import React, { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../../../types';
import { Button } from '../Button';
import { Loader } from '../Loader';
import { formatPrice } from '../../../utils';
import { useCart } from '../../../hooks';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onOrderNow: (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOrderNow,
}) => {
  const { addToCart, cart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  // Store quantities for each variant separately (for display purposes only)
  const [variantQuantities, setVariantQuantities] = useState<
    Record<string, number>
  >({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle smooth transition when product changes
  useEffect(() => {
    setIsLoading(true);

    // Reset states for new product
    setVariantQuantities({});
    setErrorMessage('');
    setSuccessMessage('');

    // Simulate smooth loading transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // 300ms loading delay for smooth transition

    return () => clearTimeout(timer);
  }, [product.id]); // Trigger when product ID changes

  // Get current quantity for selected variant from cart (this is the source of truth)
  const getQuantityFromCart = (variantId: string): number => {
    const cartItem = cart.items.find(
      item => item.product.id === product.id && item.variant.id === variantId
    );
    return cartItem ? cartItem.quantity : 0;
  };

  // Use cart quantity as source of truth, fallback to local state for display
  const cartQuantity = getQuantityFromCart(selectedVariant.id);
  const localQuantity = variantQuantities[selectedVariant.id] || 0;
  const quantity = cartQuantity > 0 ? cartQuantity : localQuantity;

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setErrorMessage(''); // Clear any error messages
    setSuccessMessage(''); // Clear any success messages
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      setVariantQuantities(prev => ({
        ...prev,
        [selectedVariant.id]: newQuantity,
      }));
      if (errorMessage) {
        setErrorMessage(''); // Clear error when quantity is updated
      }
      if (successMessage) {
        setSuccessMessage(''); // Clear success message when quantity changes
      }
    }
  };

  const handleOrderNow = () => {
    if (quantity === 0) {
      setErrorMessage(
        'Please add product to cart by selecting quantity first!'
      );
      return;
    }
    setErrorMessage(''); // Clear any existing error
    onOrderNow(product, selectedVariant, quantity);
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      setErrorMessage(
        'Please add product to cart by selecting quantity first!'
      );
      return;
    }

    if (!selectedVariant.inStock) {
      setErrorMessage('This product variant is out of stock!');
      return;
    }

    // Add to cart with the exact quantity (will replace existing quantity, not add to it)
    addToCart(product, selectedVariant, quantity);

    // Clear local quantity state since cart is now the source of truth
    setVariantQuantities(prev => ({
      ...prev,
      [selectedVariant.id]: 0,
    }));

    setSuccessMessage(
      `Updated cart: ${quantity} ${selectedVariant.size} of ${product.name}`
    );
    setErrorMessage('');

    // Clear success message after 2 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const totalPrice = selectedVariant.price * quantity;
  return (
    <div className={`product-card ${isLoading ? 'loading' : ''}`}>
      {isLoading && (
        <div className="product-card__loading-overlay">
          <Loader size="medium" color="blue" />
        </div>
      )}

      <div className="product-card__image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__variants">
          <label className="product-card__label">Size:</label>
          <div className="product-card__variant-options">
            {product.variants.map(variant => (
              <button
                key={variant.id}
                className={`product-card__variant-option ${
                  selectedVariant.id === variant.id ? 'active' : ''
                } ${!variant.inStock ? 'out-of-stock' : ''}`}
                onClick={() => handleVariantChange(variant)}
                disabled={!variant.inStock}
              >
                <span className="variant-size">{variant.size}</span>
                <span className="variant-price">
                  {formatPrice(variant.price)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-card__bottom">
        <div className="product-card__quantity-price">
          <div className="quantity-section">
            <label className="product-card__label">Qty:</label>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 0}
              >
                −
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="price-section">
            <span className="unit-price">
              {formatPrice(selectedVariant.price)} per {selectedVariant.size}
            </span>
            <span className="total-price">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <div className="product-card__actions">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <div className="action-buttons">
            <Button
              variant="secondary"
              size="medium"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!selectedVariant.inStock}
            >
              {selectedVariant.inStock ? (
                <>
                  <span className="cart-icon">🛒</span>
                  <span>Add to Cart</span>
                </>
              ) : (
                <>
                  <span className="stock-icon">❌</span>
                  <span>Out of Stock</span>
                </>
              )}
            </Button>
            <Button
              variant="primary"
              size="large"
              className="order-btn"
              onClick={handleOrderNow}
              disabled={!selectedVariant.inStock}
            >
              {selectedVariant.inStock ? '� Order Now' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
