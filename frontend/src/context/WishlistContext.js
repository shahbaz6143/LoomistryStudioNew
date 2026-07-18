'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as wishlistService from '@/services/wishlist.service';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); setWishlistIds([]); return; }
    try {
      const response = await wishlistService.getWishlist();
      const items = response.data || [];
      setWishlist(items);
      setWishlistIds(items.map((p) => p._id));
    } catch (error) {
      setWishlist([]);
      setWishlistIds([]);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addItem = async (productId) => {
    try {
      await wishlistService.addToWishlist(productId);
      setWishlistIds((prev) => [...prev, productId]);
      // Refetch full list
      fetchWishlist();
      return true;
    } catch (error) {
      console.error('Add to wishlist failed:', error);
      return false;
    }
  };

  const removeItem = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      return true;
    } catch (error) {
      console.error('Remove from wishlist failed:', error);
      return false;
    }
  };

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  const itemCount = wishlistIds.length;

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistIds, itemCount, addItem, removeItem, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
