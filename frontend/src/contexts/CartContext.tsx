import React, { createContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Product, ProductVariant, CartItem, Cart } from '../types';
import { generateId, calculateDeliveryCharge } from '../utils';
import { DELIVERY_CHARGES } from '../constants';

// Cart Actions
type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: { product: Product; variant: ProductVariant; quantity: number };
    }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

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

// Cart Reducer
const cartReducer = (state: Cart, action: CartAction): Cart => {
  // Ensure state is properly normalized (handles migration from old cart structure)
  const normalizedState =
    state.subtotal !== undefined ? state : normalizeCartState(state);

  switch (action.type) {
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
    DELIVERY_CHARGES.freeDeliveryThreshold,
    DELIVERY_CHARGES.standardCharge
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

  const addToCart = (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartItemCount = () => cart.itemCount;

  const getCartTotal = () => cart.total;

  const getCartSubtotal = () => cart.subtotal;

  const getCartDeliveryCharge = () => cart.deliveryCharge;

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
