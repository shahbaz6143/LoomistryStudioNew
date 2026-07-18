/**
 * Health check service — verifies backend connection
 * Maps to: GET /api/health
 */
import fetchAPI from './api';

export async function checkHealth() {
  return fetchAPI('/health');
}
