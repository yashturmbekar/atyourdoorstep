import React from 'react';
import './Loader.css';

interface LoaderProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  className = '',
  size = 'medium',
  color = 'blue',
}) => {
  return (
    <div className={`loader-container ${className}`}>
      <div className={`loader loader-${size} loader-${color}`} />
    </div>
  );
};
