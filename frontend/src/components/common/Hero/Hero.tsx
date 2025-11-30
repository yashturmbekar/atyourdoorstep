/**
 * Hero Component - Dynamic Content from ContentService
 * Displays hero slides from CMS with carousel functionality
 */
import { useState, useEffect, useMemo } from 'react';
import {
  useActiveHeroSlides,
  useActiveStatistics,
} from '../../../hooks/useContent';
import { generateProductStructuredData } from '../../../utils/seo';
import { getImageSrc } from '../../../utils';
import './Hero.css';

interface SlideData {
  id: string;
  name: string;
  description: string;
  emoji: string;
  image: string;
  imageAlt: string;
  highlight: string;
  features: string[];
  gradientColors: string[];
  ctaText?: string;
  ctaLink?: string;
}

// Default gradient colors for slides without custom colors
const DEFAULT_GRADIENTS = [
  ['#FF6B35', '#FFAA00', '#FFE135'], // Orange/Yellow
  ['#228B22', '#32CD32', '#90EE90'], // Green
  ['#8B4513', '#CD853F', '#DEB887'], // Brown
  ['#4169E1', '#6495ED', '#87CEEB'], // Blue
  ['#9932CC', '#BA55D3', '#DDA0DD'], // Purple
];

// Fallback slides when API data is not available
const FALLBACK_SLIDES: SlideData[] = [
  {
    id: 'fallback-1',
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
    id: 'fallback-2',
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
    id: 'fallback-3',
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
];

// Fallback stats
const FALLBACK_STATS = [
  { value: '5K+', label: 'Happy Customers' },
  { value: 'Fresh', label: 'Direct from Farms' },
  { value: '100%', label: 'Natural & Pure' },
];

// Helper function to extract emoji from title
function getEmojiFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('mango')) return '🥭';
  if (titleLower.includes('oil')) return '🫒';
  if (titleLower.includes('jaggery')) return '🍯';
  if (titleLower.includes('honey')) return '🍯';
  if (titleLower.includes('coconut')) return '🥥';
  if (titleLower.includes('sesame')) return '🌿';
  if (titleLower.includes('groundnut') || titleLower.includes('peanut'))
    return '🥜';
  return '✨';
}

// Helper function to blend two hex colors
function blendColors(color1: string, color2: string, ratio: number): string {
  const hex = (c: string) => parseInt(c, 16);
  const c1 = color1.replace('#', '');
  const c2 = color2.replace('#', '');

  const r = Math.round(
    hex(c1.slice(0, 2)) * (1 - ratio) + hex(c2.slice(0, 2)) * ratio
  );
  const g = Math.round(
    hex(c1.slice(2, 4)) * (1 - ratio) + hex(c2.slice(2, 4)) * ratio
  );
  const b = Math.round(
    hex(c1.slice(4, 6)) * (1 - ratio) + hex(c2.slice(4, 6)) * ratio
  );

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Helper function to parse gradient colors
function parseGradientColors(
  start?: string,
  end?: string,
  index = 0
): string[] {
  if (start && end) {
    const middle = blendColors(start, end, 0.5);
    return [start, middle, end];
  }
  return DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length];
}

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch dynamic content from ContentService
  const { data: heroSlidesResponse, isLoading: slidesLoading } =
    useActiveHeroSlides();
  const { data: statisticsResponse, isLoading: statsLoading } =
    useActiveStatistics();

  // Transform API data to component format
  const slides: SlideData[] = useMemo(() => {
    if (!heroSlidesResponse?.data || heroSlidesResponse.data.length === 0) {
      return FALLBACK_SLIDES;
    }

    return heroSlidesResponse.data.map((slide, index) => ({
      id: slide.id,
      name: slide.title,
      description: slide.description || '',
      emoji: getEmojiFromTitle(slide.title),
      image:
        getImageSrc(slide.imageBase64, slide.imageContentType) ||
        '/images/placeholder.png',
      imageAlt: slide.subtitle || slide.title,
      highlight: slide.subtitle || '',
      features: slide.features || [],
      gradientColors: parseGradientColors(
        slide.gradientStart,
        slide.gradientEnd,
        index
      ),
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
    }));
  }, [heroSlidesResponse]);

  // Transform statistics data
  const stats = useMemo(() => {
    if (!statisticsResponse?.data || statisticsResponse.data.length === 0) {
      return FALLBACK_STATS;
    }

    return statisticsResponse.data
      .filter(stat => stat.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .slice(0, 3)
      .map(stat => ({
        value: `${stat.value}${stat.suffix || ''}`,
        label: stat.label,
      }));
  }, [statisticsResponse]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => {
      const next = (prev + 1) % slides.length;
      setTimeout(() => setIsTransitioning(false), 600);
      return next;
    });
  };

  const prevSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => {
      const next = (prev - 1 + slides.length) % slides.length;
      setTimeout(() => setIsTransitioning(false), 600);
      return next;
    });
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Add structured data for current slide
  useEffect(() => {
    if (slides.length === 0) return;
    const currentProduct = slides[currentSlide];
    if (!currentProduct) return;

    const productSchema = generateProductStructuredData({
      name: currentProduct.name,
      description: currentProduct.description,
      image: `https://atyourdoorstep.shop${currentProduct.image}`,
      category: 'Food & Natural Products',
    });

    const existingSchema = document.querySelector(
      'script[data-product-schema]'
    );
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-product-schema', 'true');
    script.textContent = JSON.stringify(productSchema);
    document.head.appendChild(script);
  }, [currentSlide, slides]);

  // Loading state
  if (slidesLoading || statsLoading) {
    return (
      <section id="home" className="hero hero-loading">
        <div className="container">
          <div className="hero-skeleton">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-description"></div>
            <div className="skeleton-image"></div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide] || FALLBACK_SLIDES[0];

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
              <span className="title-secondary">{currentSlideData.name}</span>
              <br />
              <span className="title-branding">At Your Doorstep</span>
            </h1>
            <p className="hero-description" itemProp="description">
              {currentSlideData.description}
            </p>
            <div className="product-features">
              {currentSlideData.highlight && (
                <div className="feature-highlight">
                  <span className="highlight-badge">
                    {currentSlideData.highlight}
                  </span>
                </div>
              )}
              {currentSlideData.features.length > 0 && (
                <ul className="features-list">
                  {currentSlideData.features.map((feature, index) => (
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
              )}
            </div>
            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  if (currentSlideData.ctaLink) {
                    scrollToSection(currentSlideData.ctaLink.replace('#', ''));
                  } else {
                    scrollToSection('products');
                  }
                }}
              >
                {currentSlideData.ctaText || 'Shop Now'}
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
              {stats.map((stat, index) => (
                <div key={index} className="stat">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>{' '}
          <div className="hero-visual">
            <div className="modern-carousel">
              <div className="carousel-wrapper">
                <div className="carousel-main-container">
                  <div className="carousel-track-modern">
                    {/* Create extended array for infinite effect */}
                    {[...slides, ...slides, ...slides].map((slide, index) => {
                      const slidePosition = index - slides.length; // Center the current set
                      const isActive = slidePosition === currentSlide;
                      const isPrev = slidePosition === currentSlide - 1;
                      const isNext = slidePosition === currentSlide + 1;

                      return (
                        <div
                          key={`${slide.id}-${index}`}
                          className={`carousel-slide-modern ${
                            isActive ? 'active' : ''
                          } ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
                          style={
                            {
                              '--slide-position': slidePosition - currentSlide,
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
                                    '--glow-color-1': `${slide.gradientColors[0]}20`,
                                    '--glow-color-2': `${slide.gradientColors[1]}15`,
                                    '--glow-color-3': `${slide.gradientColors[2]}10`,
                                  } as React.CSSProperties
                                }
                              ></div>
                              <img
                                src={slide.image}
                                alt={slide.imageAlt}
                                className="product-image-modern"
                                onLoad={e => {
                                  e.currentTarget.style.opacity = '1';
                                }}
                                onError={e => {
                                  e.currentTarget.style.opacity = '0.3';
                                }}
                              />
                              <div className="product-shine"></div>
                            </div>

                            <div className="product-info-modern">
                              <h3 className="product-name-modern">
                                {slide.name}
                              </h3>{' '}
                              <div
                                className="product-accent-bar"
                                style={
                                  {
                                    '--accent-color-1': slide.gradientColors[0],
                                    '--accent-color-2': slide.gradientColors[1],
                                  } as React.CSSProperties
                                }
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      className={`indicator-modern ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to ${slide.name}`}
                      style={
                        {
                          '--indicator-color': slide.gradientColors[0],
                        } as React.CSSProperties
                      }
                    >
                      <div className="indicator-progress">
                        {' '}
                        <div
                          className="indicator-fill"
                          style={
                            {
                              '--fill-color-1': slide.gradientColors[0],
                              '--fill-color-2': slide.gradientColors[1],
                            } as React.CSSProperties
                          }
                        ></div>
                      </div>
                      <span className="indicator-label">{slide.emoji}</span>
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
