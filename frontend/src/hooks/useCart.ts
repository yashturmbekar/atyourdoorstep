import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import type { CartContextType } from '../contexts/CartContext';

// Hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
