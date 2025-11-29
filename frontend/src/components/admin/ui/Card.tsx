/**
 * Card Components
 */

import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}) => (
  <div
    className={`admin-card admin-card-${variant} admin-card-p-${padding} ${className}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
}) => {
  // If children provided, render them directly (flexible mode)
  if (children) {
    return <div className={`admin-card-header ${className}`}>{children}</div>;
  }

  // Otherwise use title/subtitle/action props (structured mode)
  return (
    <div className={`admin-card-header ${className}`}>
      <div className="admin-card-header-content">
        {title && <h3 className="admin-card-title">{title}</h3>}
        {subtitle && <p className="admin-card-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="admin-card-header-action">{action}</div>}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => <div className={`admin-card-body ${className}`}>{children}</div>;

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => <div className={`admin-card-footer ${className}`}>{children}</div>;

export default Card;
