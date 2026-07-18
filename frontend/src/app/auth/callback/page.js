'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * OAuth callback page — handles redirect after successful authentication.
 * Receives token via URL param, stores it, and refreshes user state.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store token in localStorage for cross-port development
      localStorage.setItem('accessToken', token);
      // Refresh user data from /api/auth/me
      refreshUser().then(() => {
        router.push('/');
      });
    } else {
      router.push('/auth/login?error=auth_failed');
    }
  }, [searchParams, refreshUser, router]);

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <p>Authenticating... Please wait.</p>
    </div>
  );
}
