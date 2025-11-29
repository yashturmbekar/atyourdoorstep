/**
 * Breadcrumb Component
 * Navigation breadcrumb for admin pages
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  className = '',
}) => {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Admin', href: '/admin', icon: <FiHome /> }, ...items]
    : items;

  return (
    <nav className={`breadcrumb ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={index} className="breadcrumb-item">
              {!isLast && item.href ? (
                <Link to={item.href} className="breadcrumb-link">
                  {item.icon && (
                    <span className="breadcrumb-icon">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={`breadcrumb-text ${isLast ? 'breadcrumb-current' : ''}`}
                >
                  {item.icon && (
                    <span className="breadcrumb-icon">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </span>
              )}
              {!isLast && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  <FiChevronRight />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
