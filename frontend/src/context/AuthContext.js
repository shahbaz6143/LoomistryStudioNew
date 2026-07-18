'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logout as logoutService } from '@/services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await getMe();
        setUser(response.data);
      } catch (error) {
        // Not authenticated — that's fine
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      // Logout even if API fails
    }
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await getMe();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
