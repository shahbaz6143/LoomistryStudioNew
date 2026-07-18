/**
 * Product API service — syncs with backend /api/products endpoints
 */
import fetchAPI from './api';

/**
 * Get all products with optional filters
 * Maps to: GET /api/products?category=...&color=...&sort=...
 */
export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) params.append('category', filters.category);
  if (filters.collection) params.append('collection', filters.collection);
  if (filters.color) params.append('color', filters.color);
  if (filters.material) params.append('material', filters.material);
  if (filters.shape) params.append('shape', filters.shape);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const queryString = params.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';

  return fetchAPI(endpoint);
}

/**
 * Get a single product by slug
 * Maps to: GET /api/products/:slug
 */
export async function getProductBySlug(slug) {
  return fetchAPI(`/products/${slug}`);
}

/**
 * Get product categories
 * Maps to: GET /api/products/categories
 */
export async function getCategories() {
  return fetchAPI('/products/categories');
}

/**
 * Get product collections
 * Maps to: GET /api/products/collections
 */
export async function getCollections() {
  return fetchAPI('/products/collections');
}
