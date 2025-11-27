import apiClient, { ApiResponse, getErrorMessage } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: string[];
  createdAt: string;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
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
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
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
   * Logout user
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
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
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
   * Revoke refresh token
   */
  async revokeToken(refreshToken: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.revoke, { refreshToken });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Store authentication tokens
   */
  storeTokens(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  },

  /**
   * Clear all authentication data
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
  getStoredUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
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
};

export default authService;
