/**
 * Auth API service — syncs with backend /api/auth endpoints
 */
import fetchAPI from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Get current authenticated user
 * Maps to: GET /api/auth/me
 */
export async function getMe() {
  return fetchAPI('/auth/me');
}

/**
 * Refresh the access token
 * Maps to: POST /api/auth/refresh
 */
export async function refreshToken() {
  return fetchAPI('/auth/refresh', { method: 'POST' });
}

/**
 * Logout the current user
 * Maps to: POST /api/auth/logout
 */
export async function logout() {
  return fetchAPI('/auth/logout', { method: 'POST' });
}

/**
 * Get the OAuth login URL for a provider
 * Redirects the browser to the backend OAuth endpoint
 */
export function getOAuthUrl(provider) {
  return `${API_URL}/auth/${provider}`;
}
