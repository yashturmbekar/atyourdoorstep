import { useState, useEffect, useMemo } from 'react';
import { generateProductStructuredData } from '../../../utils/seo';
import './Hero.css';

interface Product {
  id: number;
  name: string;
  description: string;
  emoji: string;
  image: string;
  imageAlt: string;
  highlight: string;
  features: string[];
  gradientColors: string[];
}

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const products: Product[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Alphonso Mangoes',
        description:
          'Experience the king of mangoes - authentic Ratnagiri Alphonso mangoes with unmatched sweetness and aroma.',
        emoji: '🥭',
        image: '/images/mangoes-carousel.png',
        imageAlt: 'Premium Ratnagiri Alphonso Mangoes',
        highlight: 'King of Mangoes',
        features: [
          'Authentic Ratnagiri Origin',
          'Peak Ripeness',
          'Rich Aroma & Taste',
          'Limited Season Availability',
        ],
        gradientColors: ['#FF6B35', '#FFAA00', '#FFE135'],
      },
      {
        id: 2,
        name: 'Cold-Pressed Oils',
        description:
          'Pure, unrefined cold-pressed oils extracted using traditional methods to preserve natural nutrients.',
        emoji: '🫒',
        image: '/images/cold-pressed-oil-carousel.png',
        imageAlt: 'Pure Cold-Pressed Oils',
        highlight: '100% Pure & Natural',
        features: [
          'Traditional Extraction',
          'No Chemical Processing',
          'Rich in Nutrients',
          'Multiple Varieties',
        ],
        gradientColors: ['#228B22', '#32CD32', '#90EE90'],
      },
      {
        id: 3,
        name: 'Organic Jaggery',
        description:
          'Natural sweetener made from organic sugarcane, free from chemicals and rich in minerals.',
        emoji: '🍯',
        image: '/images/jaggery-carousel.png',
        imageAlt: 'Organic Pure Jaggery',
        highlight: 'Chemical-Free Sweetness',
        features: [
          'Organic Sugarcane',
          'No Chemicals Added',
          'Rich in Minerals',
          'Traditional Process',
        ],
        gradientColors: ['#8B4513', '#CD853F', '#DEB887'],
      },
    ],
    []
  );

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => {
      const next = (prev + 1) % products.length;
      setTimeout(() => setIsTransitioning(false), 600); // Match CSS transition time
      return next;
    });
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => {
      const next = (prev - 1 + products.length) % products.length;
      setTimeout(() => setIsTransitioning(false), 600); // Match CSS transition time
      return next;
    });
  };
  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }; // Auto-advance carousel with smoother infinite effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % products.length;
        return next;
      });
    }, 4000); // Slightly slower for better user experience
    return () => clearInterval(timer);
  }, [products.length]);

  // Add structured data for current product
  useEffect(() => {
    const currentProduct = products[currentSlide];
    const productSchema = generateProductStructuredData({
      name: currentProduct.name,
      description: currentProduct.description,
      image: `https://atyourdoorstep.shop${currentProduct.image}`,
      category: 'Food & Natural Products',
    });

    // Remove previous product schema
    const existingSchema = document.querySelector(
      'script[data-product-schema]'
    );
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new product schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-product-schema', 'true');
    script.textContent = JSON.stringify(productSchema);
    document.head.appendChild(script);
  }, [currentSlide, products]);

  return (
    <section
      id="home"
      className="hero"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="hero-background">
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="container">
        {' '}
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title" itemProp="name">
              <span className="title-premium">Premium Quality</span>
              <br />
              <span className="title-secondary">
                {products[currentSlide].name}
              </span>
              <br />
              <span className="title-branding">At Your Doorstep</span>
            </h1>
            <p className="hero-description" itemProp="description">
              {products[currentSlide].description}
            </p>
            <div className="product-features">
              <div className="feature-highlight">
                <span className="highlight-badge">
                  {products[currentSlide].highlight}
                </span>
              </div>
              <ul className="features-list">
                {products[currentSlide].features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
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
            </div>
            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => scrollToSection('products')}
              >
                Shop Now
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => scrollToSection('about')}
              >
                Our Story
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <h3>5K+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="stat">
                <h3>Fresh</h3>
                <p>Direct from Farms</p>
              </div>
              <div className="stat">
                <h3>100%</h3>
                <p>Natural & Pure</p>
              </div>
            </div>
          </div>{' '}
          <div className="hero-visual">
            <div className="modern-carousel">
              <div className="carousel-wrapper">
                <div className="carousel-main-container">
                  <div className="carousel-track-modern">
                    {/* Create extended array for infinite effect */}
                    {[...products, ...products, ...products].map(
                      (product, index) => {
                        const slidePosition = index - products.length; // Center the current set
                        const isActive = slidePosition === currentSlide;
                        const isPrev = slidePosition === currentSlide - 1;
                        const isNext = slidePosition === currentSlide + 1;

                        return (
                          <div
                            key={`${product.id}-${index}`}
                            className={`carousel-slide-modern ${
                              isActive ? 'active' : ''
                            } ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
                            style={
                              {
                                '--slide-position':
                                  slidePosition - currentSlide,
                                '--slide-scale': isActive ? 1 : 0.8,
                                '--slide-opacity':
                                  Math.abs(slidePosition - currentSlide) <= 1
                                    ? 1
                                    : 0,
                                '--slide-z-index': isActive
                                  ? 10
                                  : Math.abs(slidePosition - currentSlide) <= 1
                                    ? 5
                                    : 1,
                              } as React.CSSProperties
                            }
                          >
                            <div className="product-card-modern">
                              <div className="product-image-wrapper">
                                {' '}
                                <div
                                  className="product-background-glow"
                                  style={
                                    {
                                      '--glow-color-1': `${product.gradientColors[0]}20`,
                                      '--glow-color-2': `${product.gradientColors[1]}15`,
                                      '--glow-color-3': `${product.gradientColors[2]}10`,
                                    } as React.CSSProperties
                                  }
                                ></div>
                                <img
                                  src={product.image}
                                  alt={product.imageAlt}
                                  className="product-image-modern"
                                  onLoad={e => {
                                    console.log(
                                      `Image loaded: ${product.image}`
                                    );
                                    e.currentTarget.style.opacity = '1';
                                  }}
                                  onError={e => {
                                    console.error(
                                      `Failed to load image: ${product.image}`
                                    );
                                    e.currentTarget.style.opacity = '0.3';
                                  }}
                                />
                                <div className="product-shine"></div>
                              </div>

                              <div className="product-info-modern">
                                <h3 className="product-name-modern">
                                  {product.name}
                                </h3>{' '}
                                <div
                                  className="product-accent-bar"
                                  style={
                                    {
                                      '--accent-color-1':
                                        product.gradientColors[0],
                                      '--accent-color-2':
                                        product.gradientColors[1],
                                    } as React.CSSProperties
                                  }
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="carousel-navigation-modern">
                  <button
                    className="nav-btn nav-prev"
                    onClick={prevSlide}
                    aria-label="Previous product"
                  >
                    <div className="nav-btn-inner">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>

                  <button
                    className="nav-btn nav-next"
                    onClick={nextSlide}
                    aria-label="Next product"
                  >
                    <div className="nav-btn-inner">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div className="carousel-indicators-modern">
                  {products.map((product, index) => (
                    <button
                      key={index}
                      className={`indicator-modern ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to ${product.name}`}
                      style={
                        {
                          '--indicator-color': product.gradientColors[0],
                        } as React.CSSProperties
                      }
                    >
                      <div className="indicator-progress">
                        {' '}
                        <div
                          className="indicator-fill"
                          style={
                            {
                              '--fill-color-1': product.gradientColors[0],
                              '--fill-color-2': product.gradientColors[1],
                            } as React.CSSProperties
                          }
                        ></div>
                      </div>
                      <span className="indicator-label">{product.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
