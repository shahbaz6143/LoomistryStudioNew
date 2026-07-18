'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '@/services/cart.service';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      const response = await cartService.getCart();
      setCart(response.data || { items: [] });
    } catch (error) {
      setCart({ items: [] });
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async ({ productId, size, color, quantity = 1, isCustomSize, customDimensions }) => {
    setLoading(true);
    try {
      const response = await cartService.addToCart({ productId, size, color, quantity, isCustomSize, customDimensions });
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Add to cart failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error('Update cart failed:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      setCart(response.data);
    } catch (error) {
      console.error('Remove from cart failed:', error);
    }
  };

  const clearAll = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [] });
    } catch (error) {
      console.error('Clear cart failed:', error);
    }
  };

  const itemCount = cart.items?.length || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, addItem, updateItem, removeItem, clearAll, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
