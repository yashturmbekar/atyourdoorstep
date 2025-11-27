import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
}) => {
  const classes =
    `button button-${variant} button-${size} ${disabled ? 'button-disabled' : ''} ${className}`.trim();

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
