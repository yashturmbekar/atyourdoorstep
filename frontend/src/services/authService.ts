/**
 * Auth Service
 * Handles all authentication-related API calls to AuthService
 * Following Clean Architecture and instruction file standards
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

/**
 * Auth Service - All authentication-related API operations
 */
export const authService = {
  /**
   * Register a new user
   * @param data - Registration data
   * @returns Auth response with tokens and user
   */
  async register(data: RegisterRequestDto): Promise<AuthResponseDto> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
        API_ENDPOINTS.auth.register,
        data
      );

      if (response.data.success && response.data.data) {
        this.storeTokens(response.data.data);
        return response.data.data;
      }

      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Login with email and password
   * @param data - Login credentials
   * @returns Auth response with tokens and user
   */
  async login(data: LoginRequestDto): Promise<AuthResponseDto> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
        API_ENDPOINTS.auth.login,
        data
      );

      if (response.data.success && response.data.data) {
        this.storeTokens(response.data.data);
        return response.data.data;
      }

      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
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
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      }

      throw new Error('Failed to get user information');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
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
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  },

  /**
   * Clear all authentication data from storage
   */
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  /**
   * Get stored user data
   */
  getStoredUser(): UserDto | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as UserDto;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
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
};

export default authService;
