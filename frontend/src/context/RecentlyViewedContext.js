'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext(null);
const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 8;

export function RecentlyViewedProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addItem = (product) => {
    if (!product || !product._id) return;
    setItems((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      const updated = [
        { _id: product._id, title: product.title, slug: product.slug, images: product.images, fixedSizes: product.fixedSizes, category: product.category, material: product.material },
        ...filtered,
      ].slice(0, MAX_ITEMS);
      return updated;
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ items, addItem }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return context;
}
