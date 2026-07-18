import fetchAPI from './api';

export async function getWishlist() {
  return fetchAPI('/wishlist');
}

export async function addToWishlist(productId) {
  return fetchAPI('/wishlist/add', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlist(productId) {
  return fetchAPI(`/wishlist/${productId}`, { method: 'DELETE' });
}
