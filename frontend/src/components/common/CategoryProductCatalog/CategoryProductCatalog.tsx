import React from 'react';
import type { Product, ProductVariant } from '../../../types';
import { ProductCard } from '../ProductCard';
import { PRODUCTS } from '../../../constants';
import { useCart } from '../../../hooks';
import './CategoryProductCatalog.css';

interface CategoryProductCatalogProps {
  category: 'alphonso' | 'jaggery' | 'oil';
  onOrderNow: (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => void;
  onClose: () => void;
  onCartClick?: () => void;
}

export const CategoryProductCatalog: React.FC<CategoryProductCatalogProps> = ({
  category,
  onOrderNow,
  onClose,
  onCartClick,
}) => {
  const { getCartItemCount } = useCart();

  const cartItemCount = getCartItemCount();
  const categoryNames = {
    alphonso: 'Alphonso Mangoes',
    jaggery: 'Jaggery Products',
    oil: 'Cold Pressed Oils',
  };

  const filteredProducts = PRODUCTS.filter(
    product => product.category === category
  );

  return (
    <div className="category-catalog-overlay">
      <div className="category-catalog-modal">
        <div className="category-catalog-header">
          <div className="category-info">
            <h2 className="category-title">{categoryNames[category]}</h2>
            <div className="category-navigation">
              <span className="nav-label">Explore other products:</span>
              {Object.entries(categoryNames)
                .filter(([key]) => key !== category)
                .map(([key, name], index, array) => (
                  <React.Fragment key={key}>
                    <button
                      className="category-nav-link"
                      onClick={() => {
                        // Close current modal and open the new category
                        onClose();
                        // Small delay to ensure smooth transition
                        setTimeout(() => {
                          // Trigger the service order handler for the new category
                          const event = new CustomEvent('categorySwitch', {
                            detail: { category: key },
                          });
                          window.dispatchEvent(event);
                        }, 100);
                      }}
                      aria-label={`Switch to ${name} category`}
                      title={`Explore ${name}`}
                    >
                      {name}
                    </button>
                    {index < array.length - 1 && (
                      <span className="nav-separator">•</span>
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
          <div className="category-catalog-actions">
            {/* Cart Button */}
            {onCartClick && (
              <button
                className={`category-cart-button ${cartItemCount > 0 ? 'has-items' : ''}`}
                onClick={onCartClick}
                aria-label="View Cart"
                title="View Cart"
              >
                🛒
                {cartItemCount > 0 && (
                  <span className="category-cart-badge">{cartItemCount}</span>
                )}
              </button>
            )}
            <button className="category-catalog-close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="category-catalog-content">
          <div className="category-description">
            <p>
              {category === 'alphonso' &&
                'Fresh, premium quality Alphonso mangoes - the king of mangoes. Sweet, juicy, and aromatic.'}
              {category === 'jaggery' &&
                'Pure, organic jaggery products made from sugarcane using traditional methods.'}
              {category === 'oil' &&
                'Pure cold-pressed oils extracted using traditional methods. Rich in nutrients and flavor.'}
            </p>
          </div>
          <div
            className={`category-products-grid products-count-${filteredProducts.length}`}
          >
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOrderNow={onOrderNow}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No products available</h3>
              <p>Products in this category are currently unavailable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
