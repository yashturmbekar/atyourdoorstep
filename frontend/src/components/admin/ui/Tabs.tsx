/**
 * Tabs Component
 * Accessible tab navigation
 */

import React, { createContext, useContext, useState } from 'react';
import './Tabs.css';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultTab?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultTab,
  children,
  className = '',
  variant = 'default',
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || '');

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={`tabs tabs-${variant} ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({
  children,
  className = '',
}) => (
  <div className={`tab-list ${className}`} role="tablist">
    {children}
  </div>
);

export interface TabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

export const Tab: React.FC<TabProps> = ({
  id,
  label,
  icon,
  badge,
  disabled = false,
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === id;

  return (
    <button
      className={`tab ${isActive ? 'tab-active' : ''} ${disabled ? 'tab-disabled' : ''}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      id={`tab-${id}`}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(id)}
    >
      {icon && <span className="tab-icon">{icon}</span>}
      <span className="tab-label">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="tab-badge">{badge > 99 ? '99+' : badge}</span>
      )}
    </button>
  );
};

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  children,
  className = '',
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  const { activeTab } = context;
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div
      className={`tab-panel ${className}`}
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      {children}
    </div>
  );
};

export default Tabs;
