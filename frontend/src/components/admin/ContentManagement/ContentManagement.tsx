/**
 * Content Management Dashboard
 * Central hub for managing all CMS content
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiImage,
  FiMessageSquare,
  FiTrendingUp,
  FiSettings,
  FiLayers,
  FiMapPin,
  FiMail,
} from 'react-icons/fi';
import './ContentManagement.css';

interface ContentSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  count?: number;
}

const ContentManagement: React.FC = () => {
  const contentSections: ContentSection[] = [
    {
      id: 'hero-slides',
      title: 'Hero Slides',
      description: 'Configure homepage hero carousel slides',
      icon: <FiImage />,
      link: '/admin/content/hero-slides',
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Manage customer testimonials and reviews',
      icon: <FiMessageSquare />,
      link: '/admin/content/testimonials',
    },
    {
      id: 'statistics',
      title: 'Statistics',
      description: 'Configure homepage statistics display',
      icon: <FiTrendingUp />,
      link: '/admin/content/statistics',
    },
    {
      id: 'usp-items',
      title: 'USP Items',
      description: 'Manage unique selling proposition highlights',
      icon: <FiLayers />,
      link: '/admin/content/usp-items',
    },
    {
      id: 'company-story',
      title: 'Company Story',
      description: 'Edit about us page content sections',
      icon: <FiMapPin />,
      link: '/admin/content/company-story',
    },
    {
      id: 'site-settings',
      title: 'Site Settings',
      description: 'Configure general site settings and information',
      icon: <FiSettings />,
      link: '/admin/content/site-settings',
    },
    {
      id: 'contact-submissions',
      title: 'Contact Submissions',
      description: 'View and manage contact form submissions',
      icon: <FiMail />,
      link: '/admin/content/contacts',
    },
  ];

  return (
    <div className="content-management">
      <div className="page-header">
        <h1 className="page-title">Content Management</h1>
        <p className="page-subtitle">
          Manage all website content from one central location
        </p>
      </div>

      <div className="content-sections-grid">
        {contentSections.map(section => (
          <Link
            key={section.id}
            to={section.link}
            className="content-section-card"
          >
            <div className="section-icon">{section.icon}</div>
            <div className="section-content">
              <h3 className="section-title">{section.title}</h3>
              <p className="section-description">{section.description}</p>
            </div>
            {section.count !== undefined && (
              <div className="section-count">{section.count}</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContentManagement;
