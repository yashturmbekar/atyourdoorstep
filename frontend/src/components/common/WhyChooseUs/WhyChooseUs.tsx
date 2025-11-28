/**
 * WhyChooseUs Component - Dynamic Content from ContentService
 * Displays USP items and statistics from CMS
 */
import { useMemo } from 'react';
import {
  useActiveUspItems,
  useActiveStatistics,
} from '../../../hooks/useContent';
import './WhyChooseUs.css';
import {
  FaSeedling,
  FaIndustry,
  FaTruck,
  FaAppleAlt,
  FaCheckCircle,
  FaHeart,
  FaLeaf,
  FaStar,
  FaShieldAlt,
  FaGem,
  FaHandshake,
  FaCertificate,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

// Icon mapping for dynamic icon rendering
const ICON_MAP: Record<string, IconType> = {
  seedling: FaSeedling,
  industry: FaIndustry,
  truck: FaTruck,
  apple: FaAppleAlt,
  check: FaCheckCircle,
  heart: FaHeart,
  leaf: FaLeaf,
  star: FaStar,
  shield: FaShieldAlt,
  gem: FaGem,
  handshake: FaHandshake,
  certificate: FaCertificate,
};

// Fallback USP items
const FALLBACK_REASONS = [
  {
    icon: 'seedling',
    title: 'Premium Organic Products',
    description:
      "Certified organic mangoes, cold-pressed oils, and traditional organic kolhapuri jaggery. Zero chemicals, zero compromise - just nature's purest goodness.",
  },
  {
    icon: 'industry',
    title: 'Vertically Integrated Operations',
    description:
      'We own our orchards, processing facilities, and distribution network. Complete control ensures consistent quality and freshness.',
  },
  {
    icon: 'truck',
    title: 'Nationwide Express Delivery',
    description:
      'Fast and reliable delivery service with careful packaging ensures your fresh organic products reach you safely anywhere in India.',
  },
  {
    icon: 'apple',
    title: 'Harvest-to-Home Promise',
    description:
      "Our mangoes are picked fresh and sent directly to you. They ripen naturally in front of you - no artificial ripening, just nature's perfect timing.",
  },
  {
    icon: 'check',
    title: '100% Satisfaction Guarantee',
    description:
      'Not happy with your order? We offer hassle-free returns and full refunds. Your satisfaction is our top priority.',
  },
  {
    icon: 'heart',
    title: 'Generational Farming Wisdom',
    description:
      'Three generations of sustainable farming practices and traditional processing methods create products with authentic taste and nutrition.',
  },
];

// Fallback stats
const FALLBACK_STATS = [
  { value: '100%', label: 'Pure & Natural' },
  { value: 'Direct', label: 'From Source' },
  { value: 'Pan-India', label: 'Delivery' },
  { value: '3+', label: 'Years Experience' },
];

// Helper function to get icon component from icon name
function getIconComponent(iconName?: string): IconType {
  if (!iconName) return FaSeedling;
  const normalizedName = iconName.toLowerCase().replace(/[^a-z]/g, '');
  return ICON_MAP[normalizedName] || FaSeedling;
}

export const WhyChooseUs = () => {
  // Fetch dynamic content from ContentService
  const { data: uspItemsResponse, isLoading: uspLoading } = useActiveUspItems();
  const { data: statisticsResponse, isLoading: statsLoading } =
    useActiveStatistics();

  // Transform USP items data
  const reasons = useMemo(() => {
    if (!uspItemsResponse?.data || uspItemsResponse.data.length === 0) {
      return FALLBACK_REASONS;
    }

    return uspItemsResponse.data
      .filter(item => item.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(item => ({
        icon: item.icon || 'seedling',
        title: item.title,
        description: item.description,
      }));
  }, [uspItemsResponse]);

  // Transform statistics data (different subset for WhyChooseUs section)
  const stats = useMemo(() => {
    if (!statisticsResponse?.data || statisticsResponse.data.length === 0) {
      return FALLBACK_STATS;
    }

    return statisticsResponse.data
      .filter(stat => stat.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .slice(0, 4)
      .map(stat => ({
        value: `${stat.value}${stat.suffix || ''}`,
        label: stat.label,
      }));
  }, [statisticsResponse]);

  // Loading state
  if (uspLoading || statsLoading) {
    return (
      <section id="why-choose-us" className="why-choose-us section why-loading">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2>Loading...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="why-choose-us" className="why-choose-us section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Why Choose Us</span>
          <h2>Experience the AtYourDoorStep Difference</h2>
          <p className="section-description">
            Discover what sets us apart in delivering the finest natural
            products with integrity, tradition, and care.
          </p>
        </div>

        <div className="reasons-grid">
          {reasons.map((reason, index) => {
            const IconComponent = getIconComponent(reason.icon);
            return (
              <div key={index} className="reason-card">
                <div className="reason-icon">
                  <IconComponent size={32} />
                </div>
                <h3 className="reason-title">{reason.title}</h3>
                <p className="reason-description">{reason.description}</p>
              </div>
            );
          })}
        </div>

        <div className="why-choose-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
