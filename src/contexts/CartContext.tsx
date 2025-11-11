/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { validateCoupon } from '../api/coupons';

export interface CartItem {
  id: string;
  game: string;
  imageLink: string;
  price: number;
  type: 'primary' | 'secondary';
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, type: 'primary' | 'secondary') => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  appliedCoupon: AppliedCoupon | null;
  discount: number;
  finalPrice: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon));
    }
  }, []);

  // Save cart to localStorage and calculate totals whenever items change
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

  // Save coupon to localStorage whenever it changes
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('appliedCoupon');
    }
  }, [appliedCoupon]);

  // Recalculate discount and final price when cart or coupon changes
  useEffect(() => {
    if (appliedCoupon && totalPrice > 0) {
      setDiscount(appliedCoupon.discount);
      setFinalPrice(totalPrice - appliedCoupon.discount);
    } else {
      setDiscount(0);
      setFinalPrice(totalPrice);
    }
  }, [totalPrice, appliedCoupon]);

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
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (totalPrice === 0) {
        return {
          success: false,
          message: 'Adicione itens ao carrinho antes de aplicar um cupom'
        };
      }

      const result = await validateCoupon(code, totalPrice);
      
      if (result.valid && result.coupon && result.discount !== undefined) {
        setAppliedCoupon({
          code: result.coupon.code,
          discount: result.discount,
          type: result.coupon.type,
          value: result.coupon.value
        });
        
        return {
          success: true,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error: any) {
      console.log(error)
      const errorMessage =  error.response?.data.message || 'Erro ao validar cupom';
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        appliedCoupon,
        discount,
        finalPrice,
        applyCoupon,
        removeCoupon
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
