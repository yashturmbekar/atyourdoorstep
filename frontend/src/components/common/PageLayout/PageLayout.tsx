import React from 'react';
import './PageLayout.css';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'gradient' | 'pattern';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
  background = 'default',
}) => {
  const classes = ['theme-page-layout', `page-bg-${background}`, className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};
