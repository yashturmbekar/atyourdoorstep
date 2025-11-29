import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AdminUser } from '../types';
import { authService } from '../services/authService';
import type { UserDto } from '../types/api.types';

export interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkPermission: (module: string, action?: string) => boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

interface AdminAuthProviderProps {
  children: ReactNode;
}

/**
 * Converts UserDto from API to AdminUser format for frontend
 */
const mapUserDtoToAdminUser = (user: UserDto): AdminUser => {
  // Determine role based on API roles
  const isAdmin = user.roles?.includes('Admin');
  const isManager = user.roles?.includes('Manager');

  let role: 'super_admin' | 'admin' | 'manager' | 'user' = 'user';
  if (isAdmin) role = 'super_admin';
  else if (isManager) role = 'manager';

  // Generate permissions based on roles
  const permissions = generatePermissionsFromRoles(user.roles || []);

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role,
    permissions,
    lastLogin: new Date(),
    isActive: true,
  };
};

/**
 * Generates permission list based on user roles
 */
const generatePermissionsFromRoles = (
  roles: string[]
): AdminUser['permissions'] => {
  const permissions: AdminUser['permissions'] = [];

  const isAdmin = roles.includes('Admin');
  const isManager = roles.includes('Manager');

  // Admin has all permissions
  if (isAdmin) {
    return [
      {
        id: 'perm-1',
        name: 'products.create',
        description: 'Create products',
        module: 'products',
      },
      {
        id: 'perm-2',
        name: 'products.update',
        description: 'Update products',
        module: 'products',
      },
      {
        id: 'perm-3',
        name: 'products.delete',
        description: 'Delete products',
        module: 'products',
      },
      {
        id: 'perm-4',
        name: 'orders.view',
        description: 'View orders',
        module: 'orders',
      },
      {
        id: 'perm-5',
        name: 'orders.update',
        description: 'Update orders',
        module: 'orders',
      },
      {
        id: 'perm-6',
        name: 'analytics.view',
        description: 'View analytics',
        module: 'analytics',
      },
      {
        id: 'perm-7',
        name: 'users.manage',
        description: 'Manage users',
        module: 'users',
      },
      {
        id: 'perm-8',
        name: 'settings.manage',
        description: 'Manage settings',
        module: 'settings',
      },
      {
        id: 'perm-9',
        name: 'content.manage',
        description: 'Manage content',
        module: 'content',
      },
    ];
  }

  // Manager has limited permissions
  if (isManager) {
    return [
      {
        id: 'perm-1',
        name: 'products.create',
        description: 'Create products',
        module: 'products',
      },
      {
        id: 'perm-2',
        name: 'products.update',
        description: 'Update products',
        module: 'products',
      },
      {
        id: 'perm-4',
        name: 'orders.view',
        description: 'View orders',
        module: 'orders',
      },
      {
        id: 'perm-5',
        name: 'orders.update',
        description: 'Update orders',
        module: 'orders',
      },
      {
        id: 'perm-6',
        name: 'analytics.view',
        description: 'View analytics',
        module: 'analytics',
      },
    ];
  }

  return permissions;
};

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize authentication state from stored tokens
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have stored credentials
        const storedUser = authService.getStoredUser();
        const hasToken = authService.getAccessToken();

        if (storedUser && hasToken) {
          // Check if user has admin/manager role
          const hasAdminAccess = storedUser.roles?.some(
            role => role === 'Admin' || role === 'Manager'
          );

          if (hasAdminAccess) {
            setAdminUser(mapUserDtoToAdminUser(storedUser));
            setIsAuthenticated(true);

            // Initialize token refresh
            authService.initialize();
          } else {
            // User doesn't have admin access, clear auth
            authService.clearTokens();
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        authService.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login with email and password
   * Validates credentials against the backend API
   */
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setError(null);

      try {
        // Call the auth service to login
        const authResponse = await authService.login({ email, password });

        // Check if user has admin or manager role
        const hasAdminAccess = authResponse.user.roles?.some(
          role => role === 'Admin' || role === 'Manager'
        );

        if (!hasAdminAccess) {
          // User logged in but doesn't have admin access
          await authService.logout();
          setError('Access denied. Admin privileges required.');
          return false;
        }

        // Set authenticated state
        const mappedUser = mapUserDtoToAdminUser(authResponse.user);
        setAdminUser(mappedUser);
        setIsAuthenticated(true);

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Login failed. Please try again.';
        setError(errorMessage);
        console.error('Login error:', err);
        return false;
      }
    },
    []
  );

  /**
   * Logout and revoke tokens
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      setError(null);
    }
  }, []);

  /**
   * Check if user has permission for a specific module/action
   */
  const checkPermission = useCallback(
    (module: string, action?: string): boolean => {
      if (!adminUser || !adminUser.permissions) return false;

      // Super admin has all permissions
      if (adminUser.role === 'super_admin') return true;

      const permission = action ? `${module}.${action}` : module;

      return adminUser.permissions.some(
        perm => perm.name === permission || perm.module === module
      );
    },
    [adminUser]
  );

  /**
   * Clear any error messages
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AdminAuthContextType = {
    isAuthenticated,
    adminUser,
    login,
    logout,
    checkPermission,
    isLoading,
    error,
    clearError,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
