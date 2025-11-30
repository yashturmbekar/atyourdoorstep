/**
 * Services Component - Dynamic Content from ContentService
 * Displays product categories and featured products from CMS
 */
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useActiveCategories,
  useFeaturedProducts,
} from '../../../hooks/useContent';
import { getImageSrc } from '../../../utils';
import './Services.css';

interface ProductDisplay {
  id: string;
  image: string;
  title: string;
  description: string;
  features: string[];
  season: string;
  price: string;
  isAvailable: boolean;
  categorySlug: string;
}

// Fallback products when API is not available
const FALLBACK_PRODUCTS: ProductDisplay[] = [
  {
    id: 'fallback-jaggery',
    image: '/images/jaggery-carousel.png',
    title: 'Organic Jaggery',
    description:
      'Pure, organic jaggery made from sugarcane in our processing facility using traditional methods. Rich in minerals and free from chemicals and artificial additives.',
    features: [
      '100% Organic',
      'Traditional Processing',
      'Rich in Minerals',
      'No Artificial Additives',
    ],
    season: 'Year-round',
    price: 'Starting from ₹80/kg',
    isAvailable: true,
    categorySlug: 'jaggery',
  },
  {
    id: 'fallback-oil',
    image: '/images/cold-pressed-oil-carousel.png',
    title: 'Cold-Pressed Oils',
    description:
      'Pure, unrefined oils extracted in our cold-pressing facility using traditional methods. Available in coconut, sesame, groundnut, and mustard varieties.',
    features: [
      'Traditional Cold-Pressed',
      'No Chemical Processing',
      'Retains Natural Nutrients',
      'Multiple Varieties',
    ],
    season: 'Year-round',
    price: 'Starting from ₹180/500ml',
    isAvailable: true,
    categorySlug: 'oil',
  },
  {
    id: 'fallback-mango',
    image: '/images/mangoes-carousel.png',
    title: 'Ratnagiri Alphonso Mangoes',
    description:
      'The king of mangoes! Our authentic Ratnagiri Alphonso mangoes known for their exceptional sweetness, rich aroma, and smooth texture. Available fresh during season (Mid-March to May-End).',
    features: [
      'GI Tagged Authentic',
      'Hand-picked Premium',
      'Perfectly Ripened',
      'Natural Sweetness',
    ],
    season: 'Mid-March - May-End',
    price: 'Starting from ₹800/dozen',
    isAvailable: isMangoSeason(),
    categorySlug: 'alphonso',
  },
];

// Function to check if mangoes are in season
function isMangoSeason(): boolean {
  // Uncomment and adjust for actual season checking
  // const now = new Date();
  // const currentYear = now.getFullYear();
  // const seasonStart = new Date(currentYear, 2, 15); // March 15
  // const seasonEnd = new Date(currentYear, 4, 31); // May 31
  // return now >= seasonStart && now <= seasonEnd;
  return true;
}

// Helper to check if product is in season based on dates
function checkProductAvailability(
  seasonStart?: string,
  seasonEnd?: string
): boolean {
  if (!seasonStart || !seasonEnd) return true; // Year-round if no season specified

  const now = new Date();
  const start = new Date(seasonStart);
  const end = new Date(seasonEnd);

  // Adjust year for current comparison
  start.setFullYear(now.getFullYear());
  end.setFullYear(now.getFullYear());

  return now >= start && now <= end;
}

// Helper to format price display
function formatPriceDisplay(
  basePrice: number,
  discountedPrice?: number
): string {
  if (discountedPrice && discountedPrice < basePrice) {
    return `Starting from ₹${discountedPrice}`;
  }
  return `Starting from ₹${basePrice}`;
}

export const Services: React.FC = () => {
  const navigate = useNavigate();

  // Fetch dynamic content from ContentService
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useActiveCategories();
  const { data: featuredProductsResponse, isLoading: productsLoading } =
    useFeaturedProducts();

  // Transform API data to component format
  const products: ProductDisplay[] = useMemo(() => {
    // If we have categories, use them to display products
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      return categoriesResponse.data
        .slice(0, 3) // Show top 3 categories
        .map(category => ({
          id: category.id,
          image:
            getImageSrc(category.imageBase64, category.imageContentType) ||
            '/images/placeholder.png',
          title: category.name,
          description: category.description || '',
          features: [], // Categories may not have features
          season: 'Year-round',
          price: 'View Products',
          isAvailable: true,
          categorySlug: category.slug,
        }));
    }

    // If we have featured products, use them
    if (
      featuredProductsResponse?.data &&
      featuredProductsResponse.data.length > 0
    ) {
      return featuredProductsResponse.data.slice(0, 3).map(product => ({
        id: product.id,
        image:
          getImageSrc(
            product.primaryImageBase64,
            product.primaryImageContentType
          ) || '/images/placeholder.png',
        title: product.name,
        description: product.shortDescription || product.fullDescription || '',
        features: product.features || [],
        season:
          product.seasonStart && product.seasonEnd
            ? `${formatSeasonDate(product.seasonStart)} - ${formatSeasonDate(product.seasonEnd)}`
            : 'Year-round',
        price: formatPriceDisplay(product.basePrice, product.discountedPrice),
        isAvailable: checkProductAvailability(
          product.seasonStart,
          product.seasonEnd
        ),
        categorySlug: product.productCategorySlug || 'products',
      }));
    }

    return FALLBACK_PRODUCTS;
  }, [categoriesResponse, featuredProductsResponse]);

  const handleOrderNow = (categorySlug: string) => {
    navigate(`/order/${categorySlug}`);
  };

  // Loading state
  if (categoriesLoading || productsLoading) {
    return (
      <section id="products" className="services section services-loading">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Products</span>
            <h2>Loading...</h2>
          </div>
          <div className="services-skeleton">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="services section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Our Products</span>
          <h2>Premium Natural Products</h2>
          <p className="section-description">
            Discover our carefully crafted selection of authentic, natural
            products made with passion and delivered fresh from our own
            production facilities.
          </p>
        </div>

        <div className="services-grid">
          {products.map(product => (
            <div
              key={product.id}
              className={`service-card ${!product.isAvailable ? 'unavailable' : ''}`}
            >
              <div className="service-header">
                <div className="service-image">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                    onError={e => {
                      e.currentTarget.src = '/images/placeholder.png';
                    }}
                  />
                  <div className="image-overlay">
                    {!product.isAvailable && (
                      <div className="unavailable-overlay">
                        <span className="unavailable-text">Out of Season</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="service-meta">
                  <h3 className="service-title">{product.title}</h3>
                  <div
                    className={`service-season ${!product.isAvailable ? 'out-of-season' : ''}`}
                  >
                    Available: {product.season}
                    {!product.isAvailable && ' (Currently Out of Season)'}
                  </div>
                </div>
              </div>
              <p className="service-description">{product.description}</p>
              {product.features.length > 0 && (
                <ul className="service-features">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <div className="service-footer">
                <div className="service-price">{product.price}</div>
                <button
                  className={`btn ${product.isAvailable ? 'btn-primary' : 'btn-disabled'}`}
                  disabled={!product.isAvailable}
                  onClick={() =>
                    product.isAvailable && handleOrderNow(product.categorySlug)
                  }
                >
                  {product.isAvailable ? 'Order Now' : 'Out of Season'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper to format season date
function formatSeasonDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}
