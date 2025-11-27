import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AdminUser } from '../types';

export interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (module: string, action?: string) => boolean;
  isLoading: boolean;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock admin user for demo purposes
  const mockAdminUser: AdminUser = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@atyourdoorstep.com',
    role: 'super_admin',
    permissions: [
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
    ],
    lastLogin: new Date(),
    isActive: true,
  };

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      try {
        const { token, user } = JSON.parse(savedAuth);
        if (token && user) {
          setIsAuthenticated(true);
          setAdminUser(user);
        }
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('adminAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Mock authentication - replace with actual API call
      if (email === 'admin@atyourdoorstep.com' && password === 'admin123') {
        const authData = {
          token: 'mock-jwt-token',
          user: mockAdminUser,
        };

        localStorage.setItem('adminAuth', JSON.stringify(authData));
        setIsAuthenticated(true);
        setAdminUser(mockAdminUser);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const checkPermission = (module: string, action?: string): boolean => {
    if (!adminUser || !adminUser.permissions) return false;

    if (adminUser.role === 'super_admin') return true;

    const permission = action ? `${module}.${action}` : module;

    return adminUser.permissions.some(
      perm => perm.name === permission || perm.module === module
    );
  };

  const value: AdminAuthContextType = {
    isAuthenticated,
    adminUser,
    login,
    logout,
    checkPermission,
    isLoading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
