/**
 * Admin API service — syncs with backend /api/admin endpoints
 */
import fetchAPI from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// ─── Products ────────────────────────────────────────────────────────────────

export async function getAdminProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/admin/products${query ? `?${query}` : ''}`);
}

export async function getAdminProduct(id) {
  return fetchAPI(`/admin/products/${id}`);
}

export async function createProduct(data) {
  return fetchAPI('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id, data) {
  return fetchAPI(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id) {
  return fetchAPI(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}

export async function toggleProduct(id) {
  return fetchAPI(`/admin/products/${id}/toggle`, {
    method: 'PATCH',
  });
}

// ─── Media Upload ────────────────────────────────────────────────────────────

export async function uploadImages(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const response = await fetch(`${API_URL}/admin/upload/images`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append('video', file);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const response = await fetch(`${API_URL}/admin/upload/video`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

// ─── Coupons ─────────────────────────────────────────────────────────────────

export async function getAdminCoupons() {
  return fetchAPI('/admin/coupons');
}

export async function createCoupon(data) {
  return fetchAPI('/admin/coupons', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCoupon(id, data) {
  return fetchAPI(`/admin/coupons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCoupon(id) {
  return fetchAPI(`/admin/coupons/${id}`, { method: 'DELETE' });
}

export async function toggleCoupon(id) {
  return fetchAPI(`/admin/coupons/${id}/toggle`, { method: 'PATCH' });
}

// ─── Coupon Validation (buyer) ───────────────────────────────────────────────

export async function validateCoupon(code, orderAmount) {
  return fetchAPI('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, orderAmount }),
  });
}
