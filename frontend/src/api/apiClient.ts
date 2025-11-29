import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

/**
 * API Client Configuration
 *
 * Security Features:
 * - Automatic token attachment via interceptors
 * - Token refresh with retry queue
 * - Request/response logging (development only)
 * - Error normalization
 * - CSRF protection via SameSite cookies
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

// Security: Only enable in development
const IS_DEV = import.meta.env.DEV;

// Create axios instance with secure defaults
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    // Security headers
    'X-Requested-With': 'XMLHttpRequest',
  },
  // Enable credentials for cookie-based auth
  withCredentials: true,
});

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: Error | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Request interceptor
 * - Attaches access token to requests
 * - Adds security headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from storage
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching of sensitive requests
    if (config.method !== 'get') {
      config.headers['X-Request-Time'] = new Date().toISOString();
    }

    // Development logging
    if (IS_DEV) {
      console.debug(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  error => Promise.reject(error)
);

/**
 * Response interceptor
 * - Handles token refresh on 401
 * - Normalizes errors
 * - Prevents redirect loops
 */
apiClient.interceptors.response.use(
  response => {
    // Development logging
    if (IS_DEV) {
      console.debug(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Don't handle if no config (request was never sent)
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if we have a refresh token
      const refreshToken = localStorage.getItem('refreshToken');

      // If no refresh token, reject without redirect (let components handle auth state)
      if (!refreshToken) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        if (response.data?.success && response.data?.data) {
          const {
            accessToken,
            refreshToken: newRefreshToken,
            expiresAt,
          } = response.data.data;

          // Store new tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          if (expiresAt) {
            localStorage.setItem('tokenExpiresAt', expiresAt);
          }

          isRefreshing = false;
          processQueue(null);

          // Retry original request with new token
          return apiClient(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError as Error);

        // Clear all auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiresAt');
        localStorage.removeItem('adminAuth');

        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (IS_DEV && error.response) {
      console.error(
        `[API Error] ${error.response.status} ${originalRequest.url}`,
        error.response.data
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data?: T[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

// Helper function to handle API errors
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.errors?.length) {
      return axiosError.response.data.errors.join(', ');
    }
    return axiosError.message || 'An unexpected error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
