import fetchAPI from './api';

export async function getOrders() {
  return fetchAPI('/orders');
}

export async function getOrderById(id) {
  return fetchAPI(`/orders/${id}`);
}

export async function getOrderByNumber(orderNumber) {
  return fetchAPI(`/orders/number/${orderNumber}`);
}

// Razorpay
export async function createRazorpayOrder(amount, currency = 'INR') {
  return fetchAPI('/payments/razorpay/create', {
    method: 'POST',
    body: JSON.stringify({ amount, currency }),
  });
}

export async function verifyRazorpayPayment(paymentData) {
  return fetchAPI('/payments/razorpay/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

// Stripe
export async function createStripeIntent(amount, currency = 'usd') {
  return fetchAPI('/payments/stripe/create-intent', {
    method: 'POST',
    body: JSON.stringify({ amount, currency }),
  });
}

export async function confirmStripePayment(paymentIntentId, orderData) {
  return fetchAPI('/payments/stripe/confirm', {
    method: 'POST',
    body: JSON.stringify({ paymentIntentId, orderData }),
  });
}
