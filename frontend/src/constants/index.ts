// Application constants
export * from './socialMedia';
export * from './products';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const APP_CONFIG = {
  name: 'AtYourDoorStep',
  version: '1.0.0',
  description: 'Your doorstep delivery application',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
} as const;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const;
