/**
 * About Component - Dynamic Content from ContentService
 * Displays company story sections and statistics from CMS
 */
import { useMemo } from 'react';
import {
  useActiveCompanyStory,
  useActiveStatistics,
} from '../../../hooks/useContent';
import './About.css';

// Fallback data when API is not available
const FALLBACK_CARDS = [
  {
    title: 'Our Story',
    icon: '📖',
    content: `We began over 30 years ago with a small, traditional jaggery unit near sugarcane fields — built on values of purity, tradition, and hard work.

At the heart of this growth lies a simple yet powerful mission: To bring honest, chemical-free, and high-quality products into Indian households, while making the process as easy and accessible as possible.

Today, AtYourDoorstep is more than just a brand — it's a promise of purity with convenience, rooted in Indian traditions and powered by modern delivery.`,
  },
  {
    title: 'Our Spaces',
    icon: '🏭',
    content: `Our Mango Orchards: Located in Ratnagiri, thriving on red laterite soil and clean air, producing premium Alphonso mangoes.

Our Jaggery Warehouse: Built near sugarcane farms, where juice is boiled in iron pans over firewood, the traditional way.

Our Cold-Pressing Unit: Operates in a controlled hygienic environment, where quality seeds are cold-pressed without heat or chemicals.`,
  },
  {
    title: 'Our Products',
    icon: '🌱',
    content: `Jaggery: With over 30 years in the industry, our jaggery is made using age-old methods in our own processing facility — rich in minerals, free from chemicals.

Cold-Pressed Oils: Since 2021, we've been extracting unrefined oils (coconut, sesame, groundnut, mustard) using the traditional wooden ghani method in our cold-pressing facility — keeping nutrients intact.

Mangoes: For the past 4 years, we've been hand-picking the finest GI-tagged Alphonso mangoes from Ratnagiri. No carbide, no shortcuts — just naturally ripened, sun-kissed fruits.`,
  },
];

const FALLBACK_STATS = [
  { number: '30+', label: 'Years of Experience' },
  { number: '100%', label: 'Chemical Free' },
  { number: '3', label: 'Premium Products' },
  { number: '1000+', label: 'Happy Customers' },
];

// Helper function to get icon from section type
function getIconFromTitle(title: string): string {
  const lowerTitle = title?.toLowerCase() || '';
  if (lowerTitle.includes('story') || lowerTitle.includes('history'))
    return '📖';
  if (
    lowerTitle.includes('space') ||
    lowerTitle.includes('facility') ||
    lowerTitle.includes('warehouse')
  )
    return '🏭';
  if (lowerTitle.includes('product') || lowerTitle.includes('offering'))
    return '🌱';
  if (lowerTitle.includes('mission') || lowerTitle.includes('vision'))
    return '🎯';
  if (lowerTitle.includes('team') || lowerTitle.includes('people')) return '👥';
  if (lowerTitle.includes('value')) return '💎';
  return '✨';
}

// Helper function to combine items into content paragraphs
function itemsToContent(
  items: Array<{ title?: string; description: string }>
): string {
  if (!items || items.length === 0) return '';
  return items
    .sort((a, b) => (a as any).displayOrder - (b as any).displayOrder)
    .map(item => item.description)
    .join('\n\n');
}

export const About = () => {
  // Fetch dynamic content from ContentService
  const { data: companyStoryResponse, isLoading: storyLoading } =
    useActiveCompanyStory();
  const { data: statisticsResponse, isLoading: statsLoading } =
    useActiveStatistics();

  // Transform company story data
  const cards = useMemo(() => {
    if (!companyStoryResponse?.data || companyStoryResponse.data.length === 0) {
      return FALLBACK_CARDS;
    }

    return companyStoryResponse.data
      .filter(section => section.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(section => ({
        title: section.title,
        icon: getIconFromTitle(section.title),
        content: itemsToContent(section.items || []),
        items: section.items || [],
      }));
  }, [companyStoryResponse]);

  // Transform statistics data
  const stats = useMemo(() => {
    if (!statisticsResponse?.data || statisticsResponse.data.length === 0) {
      return FALLBACK_STATS;
    }

    return statisticsResponse.data
      .filter(stat => stat.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(stat => ({
        number: `${stat.value}${stat.suffix || ''}`,
        label: stat.label,
      }));
  }, [statisticsResponse]);

  // Loading state
  if (storyLoading || statsLoading) {
    return (
      <section id="about" className="about section about-loading">
        <div className="container">
          <div className="section-header">
            <span className="section-label">About Us</span>
            <h2>Loading...</h2>
          </div>
          <div className="about-skeleton">
            <div className="skeleton-stats"></div>
            <div className="skeleton-cards"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="about section"
      itemScope
      itemType="https://schema.org/Organization"
      data-content-type="company-information"
      data-crawl-priority="high"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">About Us</span>
          <h2 itemProp="name">
            Purity, Tradition, and <span className="highlight">Quality</span>
          </h2>
          <p
            className="section-description"
            itemProp="description"
            data-content="company-mission"
          >
            AtYourDoorstep is a proudly Indian, family-run business bringing the
            essence of purity, tradition, and quality directly to your home.
            From the sweetness of our Ratnagiri Alphonso mangoes to the rich
            minerals of our organic jaggery, and the wholesome goodness of our
            cold-pressed oils — we deliver farm-fresh, factory-direct products
            with no middlemen and no compromises.
          </p>
        </div>

        {/* Stats Section */}
        <div
          className="stats-grid"
          data-content="company-statistics"
          itemScope
          itemType="https://schema.org/QuantitativeValue"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="about-stat-item"
              itemProp="value"
              data-stat-type={stat.label.toLowerCase().replace(/\s+/g, '-')}
            >
              <div className="stat-number" itemProp="value">
                {stat.number}
              </div>
              <div className="stat-label" itemProp="name">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Cards Section */}
        <div className="about-content">
          <div className="cards-grid" data-content="company-details">
            {cards.map((card, index) => (
              <div
                key={index}
                className="feature-card"
                itemScope
                itemType="https://schema.org/Thing"
                data-content-section={card.title
                  .toLowerCase()
                  .replace(/\s+/g, '-')}
              >
                <div className="card-icon">{card.icon}</div>
                <h3 className="card-title" itemProp="name">
                  {card.title}
                </h3>
                <div className="card-content" itemProp="description">
                  {typeof card.content === 'string'
                    ? card.content
                        .split('\n\n')
                        .map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))
                    : card.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="about-cta"
          data-content="call-to-action"
          itemScope
          itemType="https://schema.org/Action"
        >
          <div className="cta-content">
            <h3 itemProp="name">Ready to Experience Pure Quality?</h3>
            <p itemProp="description">
              Discover our range of authentic, farm-fresh products
            </p>
            <button
              className="cta-button"
              itemProp="target"
              onClick={() =>
                document
                  .getElementById('products')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore Our Products
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
