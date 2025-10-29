import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: string;
  game: string;
  imageLink: string;
  price: number;
  type: 'primary' | 'secondary';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, type: 'primary' | 'secondary') => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    // Calculate total items
    setTotalItems(items.length);
    
    // Calculate total price
    const total = items.reduce((sum, item) => {
      return sum + item.price;
    }, 0);
    
    setTotalPrice(total);
  }, [items]);

  const addToCart = (item: CartItem) => {
    // Check if the same game with the same type is already in the cart
    const existingItemIndex = items.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.type === item.type
    );

    if (existingItemIndex >= 0) {
      // If it exists, don't add it again
      return;
    }

    // Otherwise, add the new item
    setItems([...items, item]);
  };

  const removeFromCart = (id: string, type: 'primary' | 'secondary') => {
    setItems(items.filter(item => !(item.id === id && item.type === type)));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
