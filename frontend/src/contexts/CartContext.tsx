/**
 * CartContext - Dynamic Delivery Settings from ContentService
 * Uses delivery charges from CMS instead of hardcoded constants
 */
import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import type { Product, ProductVariant, CartItem, Cart } from '../types';
import { generateId, calculateDeliveryCharge } from '../utils';

// Fallback delivery charges when API is not available
const DEFAULT_DELIVERY_CHARGES = {
  freeDeliveryThreshold: 500,
  standardCharge: 50,
};

// Cart Actions
type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: { product: Product; variant: ProductVariant; quantity: number };
    }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | {
      type: 'RECALCULATE_DELIVERY';
      payload: { freeDeliveryThreshold: number; standardCharge: number };
    };

// Cart Context
interface CartContextType {
  cart: Cart;
  addToCart: (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartDeliveryCharge: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };
export type { CartContextType };

// Delivery charges configuration (mutable for dynamic updates)
let deliveryChargesConfig = { ...DEFAULT_DELIVERY_CHARGES };

// Function to update delivery charges config
export const updateDeliveryChargesConfig = (config: {
  freeDeliveryThreshold: number;
  standardCharge: number;
}) => {
  deliveryChargesConfig = { ...config };
};

// Cart Reducer
const cartReducer = (state: Cart, action: CartAction): Cart => {
  // Ensure state is properly normalized (handles migration from old cart structure)
  const normalizedState =
    state.subtotal !== undefined ? state : normalizeCartState(state);

  switch (action.type) {
    case 'RECALCULATE_DELIVERY': {
      const { freeDeliveryThreshold, standardCharge } = action.payload;
      const subtotal = normalizedState.subtotal || 0;
      const deliveryCharge = calculateDeliveryCharge(
        subtotal,
        freeDeliveryThreshold,
        standardCharge
      );

      return {
        ...normalizedState,
        deliveryCharge,
        total: calculateTotal(subtotal, deliveryCharge),
      };
    }

    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload;

      // Check if item already exists in cart
      const existingItemIndex = normalizedState.items.findIndex(
        item => item.product.id === product.id && item.variant.id === variant.id
      );

      if (existingItemIndex >= 0) {
        // Replace existing item quantity (don't add to it)
        const updatedItems = [...normalizedState.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: quantity,
        };

        const subtotal = calculateSubtotal(updatedItems);
        const deliveryCharge = calculateCartDeliveryCharge(subtotal);

        return {
          ...normalizedState,
          items: updatedItems,
          subtotal,
          deliveryCharge,
          total: calculateTotal(subtotal, deliveryCharge),
          itemCount: calculateItemCount(updatedItems),
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          id: generateId(),
          product,
          variant,
          quantity,
          addedAt: new Date(),
        };

        const updatedItems = [...normalizedState.items, newItem];
        const subtotal = calculateSubtotal(updatedItems);
        const deliveryCharge = calculateCartDeliveryCharge(subtotal);

        return {
          ...normalizedState,
          items: updatedItems,
          subtotal,
          deliveryCharge,
          total: calculateTotal(subtotal, deliveryCharge),
          itemCount: calculateItemCount(updatedItems),
        };
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = normalizedState.items.filter(
        item => item.id !== action.payload.id
      );

      const subtotal = calculateSubtotal(updatedItems);
      const deliveryCharge = calculateCartDeliveryCharge(subtotal);

      return {
        ...normalizedState,
        items: updatedItems,
        subtotal,
        deliveryCharge,
        total: calculateTotal(subtotal, deliveryCharge),
        itemCount: calculateItemCount(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const updatedItems = normalizedState.items.filter(
          item => item.id !== id
        );
        const subtotal = calculateSubtotal(updatedItems);
        const deliveryCharge = calculateCartDeliveryCharge(subtotal);

        return {
          ...normalizedState,
          items: updatedItems,
          subtotal,
          deliveryCharge,
          total: calculateTotal(subtotal, deliveryCharge),
          itemCount: calculateItemCount(updatedItems),
        };
      }

      const updatedItems = normalizedState.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );

      const subtotal = calculateSubtotal(updatedItems);
      const deliveryCharge = calculateCartDeliveryCharge(subtotal);

      return {
        ...normalizedState,
        items: updatedItems,
        subtotal,
        deliveryCharge,
        total: calculateTotal(subtotal, deliveryCharge),
        itemCount: calculateItemCount(updatedItems),
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        subtotal: 0,
        deliveryCharge: 0,
        total: 0,
        itemCount: 0,
      };

    default:
      return state;
  }
};

// Helper functions
const calculateSubtotal = (items: CartItem[]): number => {
  if (!items || items.length === 0) return 0;

  const total = items.reduce((total, item) => {
    const itemTotal = (item?.variant?.price || 0) * (item?.quantity || 0);
    return total + itemTotal;
  }, 0);

  return isNaN(total) ? 0 : total;
};

const calculateCartDeliveryCharge = (subtotal: number): number => {
  if (isNaN(subtotal) || subtotal < 0) return 0;

  const deliveryCharge = calculateDeliveryCharge(
    subtotal,
    deliveryChargesConfig.freeDeliveryThreshold,
    deliveryChargesConfig.standardCharge
  );

  return isNaN(deliveryCharge) ? 0 : deliveryCharge;
};

const calculateTotal = (subtotal: number, deliveryCharge: number): number => {
  const total = (subtotal || 0) + (deliveryCharge || 0);
  return isNaN(total) ? 0 : total;
};

const calculateItemCount = (items: CartItem[]): number => {
  if (!items || items.length === 0) return 0;

  const count = items.reduce((count, item) => count + (item?.quantity || 0), 0);
  return isNaN(count) ? 0 : count;
};

// Initial state
const initialState: Cart = {
  items: [],
  subtotal: 0,
  deliveryCharge: 0,
  total: 0,
  itemCount: 0,
};

// Helper function to ensure cart state has all required fields
const normalizeCartState = (state: Partial<Cart>): Cart => {
  const items = state.items || [];
  const subtotal = calculateSubtotal(items);
  const deliveryCharge = calculateCartDeliveryCharge(subtotal);

  return {
    items,
    subtotal,
    deliveryCharge,
    total: calculateTotal(subtotal, deliveryCharge),
    itemCount: calculateItemCount(items),
  };
};

// Cart Provider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [deliverySettings, setDeliverySettings] = useState(
    DEFAULT_DELIVERY_CHARGES
  );

  // Fetch delivery settings from API on mount
  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_CONTENT_API_BASE_URL || '/api/content'}/delivery-settings/charges`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const newSettings = {
              freeDeliveryThreshold:
                data.data.freeDeliveryThreshold ??
                DEFAULT_DELIVERY_CHARGES.freeDeliveryThreshold,
              standardCharge:
                data.data.standardCharge ??
                DEFAULT_DELIVERY_CHARGES.standardCharge,
            };
            setDeliverySettings(newSettings);
            updateDeliveryChargesConfig(newSettings);

            // Recalculate delivery for current cart
            dispatch({
              type: 'RECALCULATE_DELIVERY',
              payload: newSettings,
            });
          }
        }
      } catch (error) {
        console.warn(
          'Failed to fetch delivery settings, using defaults:',
          error
        );
      }
    };

    fetchDeliverySettings();
  }, []);

  // Update delivery config when settings change
  useEffect(() => {
    updateDeliveryChargesConfig(deliverySettings);
  }, [deliverySettings]);

  // Debug logging
  React.useEffect(() => {
    console.log('Cart state updated:', {
      items: cart.items.length,
      subtotal: cart.subtotal,
      deliveryCharge: cart.deliveryCharge,
      total: cart.total,
      itemCount: cart.itemCount,
    });
  }, [cart]);

  const addToCart = useCallback(
    (product: Product, variant: ProductVariant, quantity: number) => {
      dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getCartItemCount = useCallback(() => cart.itemCount, [cart.itemCount]);

  const getCartTotal = useCallback(() => cart.total, [cart.total]);

  const getCartSubtotal = useCallback(() => cart.subtotal, [cart.subtotal]);

  const getCartDeliveryCharge = useCallback(
    () => cart.deliveryCharge,
    [cart.deliveryCharge]
  );

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    getCartSubtotal,
    getCartDeliveryCharge,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
