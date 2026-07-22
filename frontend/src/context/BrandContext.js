'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const BrandContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState({
    name: 'LoomistryStudio',
    logo: '/logo.png',
    logoDark: '/logo.png',
    favicon: '/favicon.ico',
    tagline: 'Premium Handmade Rugs & Carpets',
  });

  useEffect(() => {
    async function fetchBranding() {
      try {
        const res = await fetch(`${API_URL}/settings/branding`);
        const data = await res.json();
        if (data.data) setBrand(data.data);
      } catch (error) {
        // Use defaults
      }
    }
    fetchBranding();
  }, []);

  return (
    <BrandContext.Provider value={brand}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrand must be used within BrandProvider');
  return context;
}
