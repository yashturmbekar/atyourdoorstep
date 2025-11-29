/**
 * Bento Grid Component
 * Modern asymmetric grid layout for dashboards
 */

import React from 'react';
import './BentoGrid.css';

export interface BentoGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface BentoItemProps {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3;
  className?: string;
  variant?: 'default' | 'highlight' | 'muted' | 'gradient';
  onClick?: () => void;
  interactive?: boolean;
}

export interface BentoCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'muted' | 'gradient' | 'stat';
  onClick?: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  columns = 4,
  gap = 'md',
  className = '',
}) => {
  return (
    <div
      className={`bento-grid bento-grid-${columns} gap-${gap} ${className}`}
      role="grid"
    >
      {children}
    </div>
  );
};

export const BentoItem: React.FC<BentoItemProps> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = '',
  variant = 'default',
  onClick,
  interactive = false,
}) => {
  const Component = onClick || interactive ? 'button' : 'div';

  return (
    <Component
      className={`bento-item col-span-${colSpan} row-span-${rowSpan} variant-${variant} ${interactive || onClick ? 'interactive' : ''} ${className}`}
      onClick={onClick}
      type={Component === 'button' ? 'button' : undefined}
      role="gridcell"
    >
      {children}
    </Component>
  );
};

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  action,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`bento-card variant-${variant} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      type={Component === 'button' ? 'button' : undefined}
    >
      {(title || subtitle || icon || action) && (
        <div className="bento-card-header">
          <div className="bento-card-header-left">
            {icon && <div className="bento-card-icon">{icon}</div>}
            <div className="bento-card-titles">
              {title && <h3 className="bento-card-title">{title}</h3>}
              {subtitle && <p className="bento-card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="bento-card-action">{action}</div>}
        </div>
      )}
      <div className="bento-card-content">{children}</div>
    </Component>
  );
};

// Pre-built stat card for dashboards
export interface BentoStatProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    positive: boolean;
  };
  icon?: React.ReactNode;
  trend?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const BentoStat: React.FC<BentoStatProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  className = '',
  variant = 'default',
}) => {
  return (
    <div className={`bento-stat variant-${variant} ${className}`}>
      <div className="bento-stat-header">
        <span className="bento-stat-title">{title}</span>
        {icon && <span className="bento-stat-icon">{icon}</span>}
      </div>
      <div className="bento-stat-value">{value}</div>
      <div className="bento-stat-footer">
        {change && (
          <span
            className={`bento-stat-change ${change.positive ? 'positive' : 'negative'}`}
          >
            {change.positive ? '↑' : '↓'} {Math.abs(change.value)}%
          </span>
        )}
        {trend && <span className="bento-stat-trend">{trend}</span>}
      </div>
    </div>
  );
};

export default BentoGrid;
