/**
 * Services Index
 * Central export point for all API services
 */

// Auth Service
export { authService } from './authService';
export type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
} from './authService';

// Product Service
export { productService } from './productService';

// Order Service
export { orderService } from './orderService';

// Customer Service
export { customerService } from './customerService';

// Notification Service
export { notificationService } from './notificationService';

// Legacy Admin API (uses real API now)
export {
  adminApi,
  productApi,
  orderApi,
  customerApi,
  analyticsApi,
} from './adminApi';

// Re-export API types
export type * from '../types/api.types';
