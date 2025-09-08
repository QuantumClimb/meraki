import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '../hooks/useProducts';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number; // timestamp
}

export interface Purchase {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  whatsappSent: boolean;
}

interface CartState {
  items: CartItem[];
  purchases: Purchase[];
  isLoaded: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { items: CartItem[]; purchases: Purchase[] } }
  | { type: 'PURCHASE_COMPLETE'; payload: { purchase: Purchase } }
  | { type: 'CLEAR_PURCHASES' };

const initialState: CartState = {
  items: [],
  purchases: [],
  isLoaded: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, { product, quantity, addedAt: Date.now() }],
      };
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload.productId),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items,
        purchases: action.payload.purchases,
        isLoaded: true,
      };
    
    case 'PURCHASE_COMPLETE':
      return {
        ...state,
        items: [], // Clear cart after purchase
        purchases: [...state.purchases, action.payload.purchase],
      };
    
    case 'CLEAR_PURCHASES':
      return {
        ...state,
        purchases: [],
      };
    
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('meraki-cart');
    const savedPurchases = localStorage.getItem('meraki-purchases');
    
    if (savedCart || savedPurchases) {
      dispatch({
        type: 'LOAD_CART',
        payload: {
          items: savedCart ? JSON.parse(savedCart) : [],
          purchases: savedPurchases ? JSON.parse(savedPurchases) : [],
        },
      });
    } else {
      dispatch({
        type: 'LOAD_CART',
        payload: { items: [], purchases: [] },
      });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.isLoaded) {
      localStorage.setItem('meraki-cart', JSON.stringify(state.items));
    }
  }, [state.items, state.isLoaded]);

  // Save purchases to localStorage whenever they change
  useEffect(() => {
    if (state.isLoaded) {
      localStorage.setItem('meraki-purchases', JSON.stringify(state.purchases));
    }
  }, [state.purchases, state.isLoaded]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Helper functions
export function addToCart(product: Product, quantity: number = 1) {
  return { type: 'ADD_TO_CART' as const, payload: { product, quantity } };
}

export function removeFromCart(productId: number) {
  return { type: 'REMOVE_FROM_CART' as const, payload: { productId } };
}

export function updateQuantity(productId: number, quantity: number) {
  return { type: 'UPDATE_QUANTITY' as const, payload: { productId, quantity } };
}

export function clearCart() {
  return { type: 'CLEAR_CART' as const };
}

export function completePurchase(items: CartItem[], total: number) {
  const purchase: Purchase = {
    id: `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    items,
    total,
    timestamp: Date.now(),
    whatsappSent: true,
  };
  return { type: 'PURCHASE_COMPLETE' as const, payload: { purchase } };
}

export function clearPurchases() {
  return { type: 'CLEAR_PURCHASES' as const };
}
