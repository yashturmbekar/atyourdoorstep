import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';

export const Services: React.FC = () => {
  const navigate = useNavigate();

  const handleOrderNow = (category: 'alphonso' | 'jaggery' | 'oil') => {
    navigate(`/order/${category}`);
  };
  // Function to check if mangoes are in season
  const isMangoSeason = () => {
    // const now = new Date();
    // const currentYear = now.getFullYear();

    // // Mid-March (March 15) to May-End (May 31)
    // const seasonStart = new Date(currentYear, 2, 15); // March 15
    // const seasonEnd = new Date(currentYear, 4, 31); // May 31

    //return now >= seasonStart && now <= seasonEnd;
    return true;
  };

  const products = [
    {
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
      category: 'jaggery' as const,
    },
    {
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
      category: 'oil' as const,
    },
    {
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
      category: 'alphonso' as const,
    },
  ];

  return (
    <section id="products" className="services section">
      <div className="container">
        {' '}
        <div className="section-header">
          <span className="section-label">Our Products</span>
          <h2>Premium Natural Products</h2>
          <p className="section-description">
            Discover our carefully crafted selection of authentic, natural
            products made with passion and delivered fresh from our own
            production facilities.
          </p>
        </div>{' '}
        <div className="services-grid">
          {products.map((product, index) => (
            <div
              key={index}
              className={`service-card ${!product.isAvailable ? 'unavailable' : ''}`}
            >
              {' '}
              <div className="service-header">
                <div className="service-image">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
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
              </ul>{' '}
              <div className="service-footer">
                <div className="service-price">{product.price}</div>
                <button
                  className={`btn ${product.isAvailable ? 'btn-primary' : 'btn-disabled'}`}
                  disabled={!product.isAvailable}
                  onClick={() =>
                    product.isAvailable && handleOrderNow(product.category)
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
