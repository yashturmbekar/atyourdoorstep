/**
 * Content Dashboard Component
 * Main landing page for the CMS section showing all content sections
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiGrid,
  FiImage,
  FiMessageSquare,
  FiTrendingUp,
  FiSettings,
  FiPackage,
  FiTruck,
  FiMail,
  FiInfo,
} from 'react-icons/fi';
import {
  useCategories,
  useHeroSlides,
  useTestimonials,
  useStatistics,
  useSiteSettings,
  useUspItems,
} from '../../../hooks/useContent';
import './ContentManagement.css';

interface ContentSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  count?: number;
  isLoading?: boolean;
}

const ContentDashboard: React.FC = () => {
  // Fetch counts for each section
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: heroSlidesData, isLoading: heroSlidesLoading } =
    useHeroSlides();
  const { data: testimonialsData, isLoading: testimonialsLoading } =
    useTestimonials();
  const { data: statisticsData, isLoading: statisticsLoading } =
    useStatistics();
  const { data: settingsData, isLoading: settingsLoading } = useSiteSettings();
  const { data: uspData, isLoading: uspLoading } = useUspItems();

  const contentSections: ContentSection[] = [
    {
      title: 'Categories',
      description: 'Manage product categories and subcategories',
      icon: <FiGrid />,
      path: '/admin/content/categories',
      count: categoriesData?.data?.length,
      isLoading: categoriesLoading,
    },
    {
      title: 'Hero Slides',
      description: 'Configure homepage hero carousel slides',
      icon: <FiImage />,
      path: '/admin/content/hero-slides',
      count: heroSlidesData?.data?.length,
      isLoading: heroSlidesLoading,
    },
    {
      title: 'Testimonials',
      description: 'Manage customer testimonials and reviews',
      icon: <FiMessageSquare />,
      path: '/admin/content/testimonials',
      count: testimonialsData?.data?.length,
      isLoading: testimonialsLoading,
    },
    {
      title: 'Statistics',
      description: 'Configure homepage statistics display',
      icon: <FiTrendingUp />,
      path: '/admin/content/statistics',
      count: statisticsData?.data?.length,
      isLoading: statisticsLoading,
    },
    {
      title: 'Site Settings',
      description: 'General site settings and information',
      icon: <FiSettings />,
      path: '/admin/content/settings',
      count: settingsData?.data?.length,
      isLoading: settingsLoading,
    },
    {
      title: 'USP Items',
      description: 'Unique selling points and features',
      icon: <FiPackage />,
      path: '/admin/content/usp-items',
      count: uspData?.data?.length,
      isLoading: uspLoading,
    },
    {
      title: 'Company Story',
      description: 'About us and company history',
      icon: <FiInfo />,
      path: '/admin/content/company-story',
      isLoading: false,
    },
    {
      title: 'Delivery Settings',
      description: 'Delivery zones and shipping options',
      icon: <FiTruck />,
      path: '/admin/content/delivery-settings',
      isLoading: false,
    },
    {
      title: 'Inquiry Types',
      description: 'Contact form inquiry categories',
      icon: <FiMail />,
      path: '/admin/content/inquiry-types',
      isLoading: false,
    },
  ];

  return (
    <div className="content-management">
      <div className="page-header">
        <h1 className="page-title">Content Management</h1>
        <p className="page-subtitle">
          Manage all website content, settings, and configurations
        </p>
      </div>

      <div className="content-sections-grid">
        {contentSections.map(section => (
          <Link
            key={section.path}
            to={section.path}
            className="content-section-card"
          >
            <div className="section-icon">{section.icon}</div>
            <div className="section-content">
              <h3 className="section-title">{section.title}</h3>
              <p className="section-description">{section.description}</p>
            </div>
            {section.isLoading ? (
              <div
                className="loading-spinner"
                style={{ width: '24px', height: '24px', borderWidth: '2px' }}
              />
            ) : section.count !== undefined ? (
              <div className="section-count">{section.count}</div>
            ) : null}
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div style={{ marginTop: '2rem' }}>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '1rem',
          }}
        >
          Content Overview
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-light)',
                marginBottom: '0.25rem',
              }}
            >
              Total Categories
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}
            >
              {categoriesLoading ? '...' : categoriesData?.data?.length || 0}
            </div>
          </div>
          <div
            style={{
              padding: '1.25rem',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-light)',
                marginBottom: '0.25rem',
              }}
            >
              Active Hero Slides
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}
            >
              {heroSlidesLoading
                ? '...'
                : heroSlidesData?.data?.filter(s => s.isActive).length || 0}
            </div>
          </div>
          <div
            style={{
              padding: '1.25rem',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-light)',
                marginBottom: '0.25rem',
              }}
            >
              Featured Testimonials
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}
            >
              {testimonialsLoading
                ? '...'
                : testimonialsData?.data?.filter(t => t.isFeatured).length || 0}
            </div>
          </div>
          <div
            style={{
              padding: '1.25rem',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-light)',
                marginBottom: '0.25rem',
              }}
            >
              Site Settings
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}
            >
              {settingsLoading ? '...' : settingsData?.data?.length || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDashboard;
