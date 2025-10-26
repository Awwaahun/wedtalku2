// src/contexts/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeddingTemplate } from '../lib/supabase';

interface CartItem extends WeddingTemplate {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (template: WeddingTemplate) => void;
  removeFromCart: (templateId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (template: WeddingTemplate) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === template.id);
      if (exists) {
        return prev; // Template sudah ada di cart
      }
      return [...prev, { ...template, quantity: 1 }];
    });
  };

  const removeFromCart = (templateId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== templateId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};