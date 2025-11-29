/**
 * Badge Component
 * Status indicators and counters
 */

import React from 'react';
import './Badge.css';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
}) => {
  if (dot) {
    return (
      <span
        className={`badge-dot badge-dot-${variant} ${pulse ? 'badge-dot-pulse' : ''} ${className}`}
      />
    );
  }

  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
