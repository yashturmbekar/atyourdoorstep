/**
 * Button Components
 * Consistent button styling across admin
 */

import React from 'react';
import './Button.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'ghost'
  | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
}) => {
  return (
    <button
      type={type}
      className={`
        admin-btn 
        admin-btn-${variant} 
        admin-btn-${size}
        ${fullWidth ? 'admin-btn-full' : ''}
        ${isLoading ? 'admin-btn-loading' : ''}
        ${className}
      `.trim()}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading && <span className="admin-btn-spinner" />}
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="admin-btn-icon">{icon}</span>
      )}
      <span className="admin-btn-text">{children}</span>
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="admin-btn-icon">{icon}</span>
      )}
    </button>
  );
};

interface IconButtonProps {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onClick,
  title,
  className = '',
}) => {
  return (
    <button
      type="button"
      className={`
        admin-icon-btn 
        admin-icon-btn-${variant} 
        admin-icon-btn-${size}
        ${className}
      `.trim()}
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      {icon}
    </button>
  );
};

export default Button;
