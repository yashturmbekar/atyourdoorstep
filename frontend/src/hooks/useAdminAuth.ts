import { useContext } from 'react';
import { AdminAuthContext } from '../contexts/AdminAuthContext';
import type { AdminAuthContextType } from '../contexts/AdminAuthContext';

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
