'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import fetchAPI from '@/services/api';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState({
    code: 'INR',
    symbol: '₹',
    isIndia: true,
  });

  useEffect(() => {
    async function detectCurrency() {
      try {
        const response = await fetchAPI('/geo/detect');
        setCurrency({
          code: response.data.currency,
          symbol: response.data.symbol,
          isIndia: response.data.isIndia,
        });
      } catch (error) {
        // Default to INR
      }
    }
    detectCurrency();
  }, []);

  /**
   * Get the price for current region from a size object
   */
  const getPrice = (sizeObj) => {
    if (!sizeObj) return 0;
    return currency.isIndia ? sizeObj.priceINR : sizeObj.priceUSD;
  };

  /**
   * Get per sq ft price from customSizePrice object
   */
  const getCustomPrice = (customSizePrice) => {
    if (!customSizePrice) return 0;
    return currency.isIndia ? customSizePrice.pricePerSqFtINR : customSizePrice.pricePerSqFtUSD;
  };

  /**
   * Format price with currency symbol
   */
  const formatPrice = (amount) => {
    return `${currency.symbol}${Number(amount).toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, getPrice, getCustomPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
