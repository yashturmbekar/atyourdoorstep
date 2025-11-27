import React from 'react';
import './Section.css';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  id,
}) => {
  const classes = [
    'theme-section',
    `section-${variant}`,
    `section-padding-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={classes}>
      {children}
    </section>
  );
};
