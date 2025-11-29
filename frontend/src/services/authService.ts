/**
 * Auth Service
 * Handles all authentication-related API calls to AuthService
 * Following Clean Architecture and instruction file standards
 *
 * Security Features:
 * - Secure token storage
 * - Automatic token refresh before expiry
 * - Input validation and sanitization
 * - Rate limiting protection
 * - Session management
 */

import apiClient, { getErrorMessage } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  ApiResponse,
  AuthResponseDto,
  UserDto,
  RegisterRequestDto,
  LoginRequestDto,
  RevokeTokenRequestDto,
} from '../types/api.types';

// Re-export types for backward compatibility
export type RegisterRequest = RegisterRequestDto;
export type LoginRequest = LoginRequestDto;
export type AuthResponse = AuthResponseDto;
export type User = UserDto;

// ============================================
// Security Constants
// ============================================

const TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const USER_STORAGE_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'tokenExpiresAt';
const LOGIN_ATTEMPTS_KEY = 'loginAttempts';
const LOCKOUT_KEY = 'loginLockout';

// Token refresh threshold (refresh 5 minutes before expiry)
const TOKEN_REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

// Rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// ============================================
// Input Validation
// ============================================

/**
 * Validates email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 */
const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Sanitizes input to prevent XSS
 */
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// ============================================
// Rate Limiting
// ============================================

const rateLimiter = {
  getAttempts(): number {
    try {
      const attempts = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
      return attempts ? parseInt(attempts, 10) : 0;
    } catch {
      return 0;
    }
  },

  incrementAttempts(): void {
    try {
      const attempts = this.getAttempts() + 1;
      localStorage.setItem(LOGIN_ATTEMPTS_KEY, attempts.toString());
    } catch {
      // Ignore storage errors
    }
  },

  resetAttempts(): void {
    try {
      localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
    } catch {
      // Ignore storage errors
    }
  },

  isLockedOut(): boolean {
    try {
      const lockoutTime = localStorage.getItem(LOCKOUT_KEY);
      if (!lockoutTime) return false;

      const lockoutExpiry = parseInt(lockoutTime, 10);
      if (Date.now() > lockoutExpiry) {
        this.resetAttempts();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  setLockout(): void {
    try {
      const lockoutExpiry = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(LOCKOUT_KEY, lockoutExpiry.toString());
    } catch {
      // Ignore storage errors
    }
  },

  getRemainingLockoutTime(): number {
    try {
      const lockoutTime = localStorage.getItem(LOCKOUT_KEY);
      if (!lockoutTime) return 0;

      const remaining = parseInt(lockoutTime, 10) - Date.now();
      return Math.max(0, Math.ceil(remaining / 1000 / 60)); // Return minutes
    } catch {
      return 0;
    }
  },

  checkAndUpdateAttempts(): void {
    if (this.getAttempts() >= MAX_LOGIN_ATTEMPTS) {
      this.setLockout();
    }
  },
};

/**
 * Auth Service - All authentication-related API operations
 */
export const authService = {
  // Token refresh state
  _refreshPromise: null as Promise<AuthResponseDto> | null,
  _refreshTimer: null as ReturnType<typeof setTimeout> | null,

  /**
   * Register a new user with input validation
   * @param data - Registration data
   * @returns Auth response with tokens and user
   */
  async register(data: RegisterRequestDto): Promise<AuthResponseDto> {
    // Validate required fields
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new Error('All required fields must be provided');
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('. '));
    }

    try {
      const sanitizedData = {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        firstName: sanitizeInput(data.firstName.trim()),
        lastName: sanitizeInput(data.lastName.trim()),
        phoneNumber: data.phoneNumber?.trim(),
      };

      const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
        API_ENDPOINTS.auth.register,
        sanitizedData
      );

      if (response.data.success && response.data.data) {
        this.storeTokens(response.data.data);
        this.setupTokenRefresh();
        return response.data.data;
      }

      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Login with email and password (with rate limiting)
   * @param data - Login credentials
   * @returns Auth response with tokens and user
   */
  async login(data: LoginRequestDto): Promise<AuthResponseDto> {
    // Check for lockout
    if (rateLimiter.isLockedOut()) {
      const remainingMinutes = rateLimiter.getRemainingLockoutTime();
      throw new Error(
        `Too many login attempts. Please try again in ${remainingMinutes} minutes.`
      );
    }

    // Validate inputs
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }

    if (!isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    try {
      const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
        API_ENDPOINTS.auth.login,
        {
          email: data.email.toLowerCase().trim(),
          password: data.password,
        }
      );

      if (response.data.success && response.data.data) {
        // Reset rate limiter on successful login
        rateLimiter.resetAttempts();

        this.storeTokens(response.data.data);
        this.setupTokenRefresh();
        return response.data.data;
      }

      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      // Increment failed attempts
      rateLimiter.incrementAttempts();
      rateLimiter.checkAndUpdateAttempts();

      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Logout current user and revoke tokens
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.auth.revoke, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
      this.clearRefreshTimer();
    }
  },

  /**
   * Get current authenticated user
   * @returns Current user data
   */
  async getCurrentUser(): Promise<UserDto> {
    try {
      const response = await apiClient.get<ApiResponse<UserDto>>(
        API_ENDPOINTS.auth.me
      );

      if (response.data.success && response.data.data) {
        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(response.data.data)
        );
        return response.data.data;
      }

      throw new Error('Failed to get user information');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<AuthResponseDto> {
    // Prevent multiple simultaneous refresh requests
    if (this._refreshPromise) {
      return this._refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this._refreshPromise = (async () => {
      try {
        const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
          API_ENDPOINTS.auth.refresh,
          { refreshToken }
        );

        if (response.data.success && response.data.data) {
          this.storeTokens(response.data.data);
          this.setupTokenRefresh();
          return response.data.data;
        }

        throw new Error('Token refresh failed');
      } catch (error) {
        this.clearTokens();
        this.clearRefreshTimer();
        throw error;
      } finally {
        this._refreshPromise = null;
      }
    })();

    return this._refreshPromise;
  },

  /**
   * Revoke a refresh token
   * @param refreshToken - Token to revoke
   */
  async revokeToken(refreshToken: string): Promise<void> {
    try {
      const data: RevokeTokenRequestDto = { refreshToken };
      await apiClient.post(API_ENDPOINTS.auth.revoke, data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Store authentication tokens in localStorage
   * @param authResponse - Auth response containing tokens
   */
  storeTokens(authResponse: AuthResponseDto): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, authResponse.accessToken);
      localStorage.setItem(
        REFRESH_TOKEN_STORAGE_KEY,
        authResponse.refreshToken
      );
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authResponse.user));
      if (authResponse.expiresAt) {
        localStorage.setItem(TOKEN_EXPIRY_KEY, authResponse.expiresAt);
      }
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  },

  /**
   * Clear all authentication data from storage
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      // Clear legacy keys
      localStorage.removeItem('adminAuth');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Get token expiry time
   */
  getTokenExpiry(): Date | null {
    try {
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      return expiry ? new Date(expiry) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return new Date() >= expiry;
  },

  /**
   * Check if token is expiring soon
   */
  isTokenExpiringSoon(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() + TOKEN_REFRESH_THRESHOLD_MS >= expiry.getTime();
  },

  /**
   * Get stored user data
   */
  getStoredUser(): UserDto | null {
    try {
      const userJson = localStorage.getItem(USER_STORAGE_KEY);
      if (!userJson) return null;
      return JSON.parse(userJson) as UserDto;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    return !this.isTokenExpired();
  },

  /**
   * Check if user has specific role
   * @param role - Role to check
   */
  hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return user?.roles?.includes(role) ?? false;
  },

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('Admin');
  },

  /**
   * Check if user is manager
   */
  isManager(): boolean {
    return this.hasRole('Manager') || this.isAdmin();
  },

  /**
   * Setup automatic token refresh before expiry
   */
  setupTokenRefresh(): void {
    this.clearRefreshTimer();

    const expiry = this.getTokenExpiry();
    if (!expiry) return;

    const now = Date.now();
    const expiryTime = expiry.getTime();
    const refreshTime = expiryTime - TOKEN_REFRESH_THRESHOLD_MS;

    if (refreshTime <= now) {
      // Token is already expiring soon, refresh immediately
      this.refreshToken().catch(console.error);
      return;
    }

    // Schedule refresh
    const delay = refreshTime - now;
    this._refreshTimer = setTimeout(() => {
      this.refreshToken().catch(console.error);
    }, delay);
  },

  /**
   * Clear the token refresh timer
   */
  clearRefreshTimer(): void {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
  },

  /**
   * Initialize auth state from storage (call on app startup)
   */
  initialize(): void {
    if (this.isAuthenticated()) {
      this.setupTokenRefresh();
    }
  },
};

// Export rate limiter for testing
export { rateLimiter };

export default authService;
