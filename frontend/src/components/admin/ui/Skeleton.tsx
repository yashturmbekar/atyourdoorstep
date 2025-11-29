/**
 * Skeleton Loading Components
 * Beautiful animated skeleton loaders
 */

import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius,
  className = '',
  variant = 'text',
}) => {
  const getStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    };

    if (borderRadius) {
      baseStyle.borderRadius =
        typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    } else if (variant === 'circular') {
      baseStyle.borderRadius = '50%';
    } else if (variant === 'text') {
      baseStyle.borderRadius = '4px';
    } else {
      baseStyle.borderRadius = '8px';
    }

    return baseStyle;
  };

  return <div className={`skeleton ${className}`} style={getStyle()} />;
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="skeleton-table-cell">
          <Skeleton height={12} width="70%" />
        </div>
      ))}
    </div>
    <div className="skeleton-table-body">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-table-cell">
              {colIndex === 0 ? (
                <div className="skeleton-table-product">
                  <Skeleton width={40} height={40} borderRadius={8} />
                  <div className="skeleton-table-product-info">
                    <Skeleton height={14} width="80%" />
                    <Skeleton height={10} width="50%" />
                  </div>
                </div>
              ) : (
                <Skeleton height={14} width={`${50 + Math.random() * 40}%`} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="skeleton-card">
    <div className="skeleton-card-header">
      <Skeleton width={120} height={20} />
      <Skeleton width={80} height={16} />
    </div>
    <div className="skeleton-card-body">
      <Skeleton height={100} borderRadius={8} />
      <div className="skeleton-card-content">
        <Skeleton height={16} width="90%" />
        <Skeleton height={14} width="70%" />
        <Skeleton height={14} width="50%" />
      </div>
    </div>
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="skeleton-stat-card">
    <div className="skeleton-stat-header">
      <Skeleton width="60%" height={14} />
      <Skeleton width={40} height={40} borderRadius={10} />
    </div>
    <Skeleton width="40%" height={32} />
    <Skeleton width="70%" height={12} />
  </div>
);

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="skeleton-form">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="skeleton-form-group">
        <Skeleton width={100} height={14} />
        <Skeleton height={42} borderRadius={8} />
      </div>
    ))}
    <div className="skeleton-form-actions">
      <Skeleton width={100} height={40} borderRadius={8} />
      <Skeleton width={120} height={40} borderRadius={8} />
    </div>
  </div>
);

export default Skeleton;
