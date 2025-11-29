/**
 * Chip Component
 * Versatile chip/tag component
 */

import React from 'react';
import { FiX } from 'react-icons/fi';
import './Chip.css';

export type ChipVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  size = 'md',
  icon,
  onDelete,
  onClick,
  disabled = false,
  className = '',
}) => {
  const isClickable = onClick && !disabled;
  const isDeletable = onDelete && !disabled;

  return (
    <span
      className={`chip chip-${variant} chip-${size} ${isClickable ? 'chip-clickable' : ''} ${disabled ? 'chip-disabled' : ''} ${className}`}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{label}</span>
      {isDeletable && (
        <button
          className="chip-delete"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`Remove ${label}`}
        >
          <FiX />
        </button>
      )}
    </span>
  );
};

interface ChipGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  children,
  className = '',
}) => <div className={`chip-group ${className}`}>{children}</div>;

export default Chip;
