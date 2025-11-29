/**
 * Admin UI Component Library
 * Reusable, production-ready components for the admin panel
 */

// Toast Notifications
export { Toast, ToastContainer, ToastProvider } from './Toast';
export { useToast } from './useToast';
export type { ToastType, ToastOptions, ToastContextValue } from './useToast';

// Modal Dialogs
export { Modal, ConfirmModal } from './Modal';
export type { ModalProps, ConfirmModalProps } from './Modal';

// Skeleton Loaders
export {
  Skeleton,
  TableSkeleton,
  CardSkeleton,
  StatCardSkeleton,
  FormSkeleton,
} from './Skeleton';

// Chip/Tag Components
export { Chip, ChipGroup } from './Chip';
export type { ChipProps, ChipVariant } from './Chip';

// Navigation
export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbItem } from './Breadcrumb';

// Tabs
export { Tabs, Tab, TabList, TabPanel } from './Tabs';
export type { TabProps, TabsProps } from './Tabs';

// Buttons
export { Button, IconButton } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

// Badge
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';

// Empty State
export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

// Error Boundary
export { ErrorBoundary } from './ErrorBoundary';

// Card
export { Card, CardHeader, CardBody, CardFooter } from './Card';

// Accordion
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './Accordion';

// Carousel
export { Carousel, CarouselSlide } from './Carousel';
export type { CarouselProps, CarouselSlideProps } from './Carousel';

// Bento Grid
export { BentoGrid, BentoItem, BentoCard, BentoStat } from './BentoGrid';
export type {
  BentoGridProps,
  BentoItemProps,
  BentoCardProps,
  BentoStatProps,
} from './BentoGrid';

// Import all CSS
import './Toast.css';
import './Modal.css';
import './Skeleton.css';
import './Chip.css';
import './Breadcrumb.css';
import './Tabs.css';
import './Button.css';
import './Badge.css';
import './EmptyState.css';
import './ErrorBoundary.css';
import './Card.css';
import './Accordion.css';
import './Carousel.css';
import './BentoGrid.css';
