/**
 * Accordion Component
 * Collapsible content panels with smooth animations
 */

import React, { useState, createContext, useContext, useCallback } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './Accordion.css';

// Types
export interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  className?: string;
}

export interface AccordionItemProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

// Context
interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

interface AccordionItemContextValue {
  id: string;
  isOpen: boolean;
  disabled: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null
);

// Hook
export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion');
  }
  return context;
};

export const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('useAccordionItem must be used within an AccordionItem');
  }
  return context;
};

// Components
export const Accordion: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpenItems)
  );

  const toggleItem = useCallback(
    (id: string) => {
      setOpenItems(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className={`accordion ${className}`} role="presentation">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  children,
  disabled = false,
  className = '',
}) => {
  const { openItems } = useAccordion();
  const isOpen = openItems.has(id);

  return (
    <AccordionItemContext.Provider value={{ id, isOpen, disabled }}>
      <div
        className={`accordion-item ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''} ${className}`}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className = '',
  icon,
}) => {
  const { toggleItem } = useAccordion();
  const { id, isOpen, disabled } = useAccordionItem();

  return (
    <button
      type="button"
      className={`accordion-trigger ${className}`}
      onClick={() => !disabled && toggleItem(id)}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${id}`}
      disabled={disabled}
    >
      <span className="accordion-trigger-content">{children}</span>
      <span className={`accordion-trigger-icon ${isOpen ? 'rotated' : ''}`}>
        {icon || <FiChevronDown />}
      </span>
    </button>
  );
};

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className = '',
}) => {
  const { id, isOpen } = useAccordionItem();

  return (
    <div
      id={`accordion-content-${id}`}
      className={`accordion-content ${isOpen ? 'open' : ''} ${className}`}
      role="region"
      aria-hidden={!isOpen}
    >
      <div className="accordion-content-inner">{children}</div>
    </div>
  );
};

export default Accordion;
