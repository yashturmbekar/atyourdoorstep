import React, { useMemo } from 'react';
import type { Product, ProductVariant } from '../../../types';
import { ProductCard } from '../ProductCard';
import {
  useActiveCategories,
  useFeaturedProducts,
} from '../../../hooks/useContent';
import { useCart } from '../../../hooks';
import './CategoryProductCatalog.css';

// Fallback products when API is not available
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'alphonso-1',
    name: 'Premium Alphonso Mangoes',
    category: 'alphonso',
    description:
      'Fresh, premium quality Alphonso mangoes - the king of mangoes.',
    image: '/images/mangoes-carousel.png',
    variants: [
      {
        id: 'alphonso-2dozen',
        size: '2 dozen',
        price: 1600,
        unit: 'kg',
        inStock: true,
      },
    ],
  },
];

// Fallback category names
const FALLBACK_CATEGORY_NAMES: Record<string, string> = {
  alphonso: 'Alphonso Mangoes',
  jaggery: 'Jaggery Products',
  oil: 'Cold Pressed Oils',
};

// Fallback category descriptions
const FALLBACK_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  alphonso:
    'Fresh, premium quality Alphonso mangoes - the king of mangoes. Sweet, juicy, and aromatic.',
  jaggery:
    'Pure, organic jaggery products made from sugarcane using traditional methods.',
  oil: 'Pure cold-pressed oils extracted using traditional methods. Rich in nutrients and flavor.',
};

interface CategoryProductCatalogProps {
  category: string;
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

  // Fetch dynamic content from ContentService
  const { data: categoriesResponse } = useActiveCategories();
  const { data: productsResponse } = useFeaturedProducts();

  // Transform API categories to category names map
  const categoryNames = useMemo(() => {
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      const namesMap: Record<string, string> = {};
      categoriesResponse.data.forEach(cat => {
        namesMap[cat.slug] = cat.name;
      });
      return namesMap;
    }
    return FALLBACK_CATEGORY_NAMES;
  }, [categoriesResponse]);

  // Get category description from API or fallback
  const categoryDescription = useMemo(() => {
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      const cat = categoriesResponse.data.find(c => c.slug === category);
      if (cat?.description) return cat.description;
    }
    return FALLBACK_CATEGORY_DESCRIPTIONS[category] || '';
  }, [categoriesResponse, category]);

  // Transform API products to component format and filter by category
  const filteredProducts: Product[] = useMemo(() => {
    if (productsResponse?.data && productsResponse.data.length > 0) {
      return productsResponse.data
        .filter(apiProduct => apiProduct.categorySlug === category)
        .map(apiProduct => ({
          id: apiProduct.id,
          name: apiProduct.name,
          category: apiProduct.categorySlug || category,
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
    return FALLBACK_PRODUCTS.filter(product => product.category === category);
  }, [productsResponse, category]);

  const cartItemCount = getCartItemCount();

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
            <p>{categoryDescription}</p>
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
