import fetchAPI from './api';

export async function getCart() {
  return fetchAPI('/cart');
}

export async function addToCart({ productId, size, color, quantity = 1, isCustomSize = false, customDimensions }) {
  return fetchAPI('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, size, color, quantity, isCustomSize, customDimensions }),
  });
}

export async function updateCartItem(itemId, quantity) {
  return fetchAPI('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ itemId, quantity }),
  });
}

export async function removeFromCart(itemId) {
  return fetchAPI(`/cart/${itemId}`, { method: 'DELETE' });
}

export async function clearCart() {
  return fetchAPI('/cart/clear', { method: 'DELETE' });
}
