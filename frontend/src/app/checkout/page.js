'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/services/order.service';
import { validateCoupon } from '@/services/admin.service';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearAll } = useCart();
  const { currency, formatPrice } = useCurrency();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(currency.isIndia ? 'razorpay' : 'stripe');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: currency.isIndia ? 'India' : '',
  });

  if (!user) {
    router.push('/auth/login?redirect=/checkout');
    return null;
  }

  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>Checkout</h1>
        <p>Your cart is empty. Add some products first.</p>
        <Link href="/products" className={styles.emptyBtn}>Shop Now</Link>
      </div>
    );
  }

  // Calculate prices
  const getItemPrice = (item) => {
    if (!item.productId?.fixedSizes) return 0;
    const sizeObj = item.productId.fixedSizes.find((s) => s.label === item.size);
    if (sizeObj) return currency.isIndia ? sizeObj.priceINR : sizeObj.priceUSD;
    if (item.isCustomSize && item.customDimensions && item.productId.customSizePrice) {
      const rate = currency.isIndia
        ? item.productId.customSizePrice.pricePerSqFtINR
        : item.productId.customSizePrice.pricePerSqFtUSD;
      return item.customDimensions.width * item.customDimensions.height * rate;
    }
    return 0;
  };

  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal - couponDiscount + shipping;

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode.trim()) return;
    try {
      const response = await validateCoupon(couponCode, subtotal);
      setCouponDiscount(response.data.discount);
      setCouponApplied(response.data);
    } catch (error) {
      setCouponError(error.message);
      setCouponDiscount(0);
      setCouponApplied(null);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(null);
    setCouponError('');
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const buildOrderData = () => ({
    items: items.map((item) => ({
      productId: item.productId._id,
      title: item.productId.title,
      image: item.productId.images?.[0] || '',
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: getItemPrice(item),
      isCustomSize: item.isCustomSize,
      customDimensions: item.customDimensions,
    })),
    shippingAddress: address,
    currency: currency.code,
    subtotal,
    discount: couponDiscount,
    shippingCost: shipping,
    totalAmount: total,
    couponCode: couponApplied?.code || null,
  });

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // Create Razorpay order
      const response = await createRazorpayOrder(total, 'INR');
      const { orderId, keyId } = response.data;

      // Open Razorpay modal
      const options = {
        key: keyId,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'LoomistryStudio',
        description: 'Handmade Rugs Purchase',
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: buildOrderData(),
            });

            router.push(`/orders/${verifyResponse.data.orderNumber}/confirmation`);
          } catch (error) {
            alert('Payment verification failed: ' + error.message);
          }
        },
        prefill: {
          name: address.fullName,
          email: user.email,
          contact: address.phone,
        },
        theme: { color: '#2c3e50' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    // Validate address
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.postalCode || !address.country) {
      alert('Please fill in all required address fields.');
      return;
    }

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      // Stripe - for now show a placeholder
      alert('Stripe payment integration requires HTTPS. Use Razorpay for testing.');
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        <div>
          {/* Shipping Address */}
          <div className={styles.section}>
            <h2>Shipping Address</h2>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Full Name *</label>
                <input name="fullName" value={address.fullName} onChange={handleAddressChange} required />
              </div>
              <div className={styles.field}>
                <label>Phone *</label>
                <input name="phone" value={address.phone} onChange={handleAddressChange} required />
              </div>
            </div>
            <div className={styles.field}>
              <label>Address Line 1 *</label>
              <input name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} required placeholder="House/Flat number, Street" />
            </div>
            <div className={styles.field}>
              <label>Address Line 2</label>
              <input name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} placeholder="Landmark, Area (optional)" />
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>City *</label>
                <input name="city" value={address.city} onChange={handleAddressChange} required />
              </div>
              <div className={styles.field}>
                <label>State *</label>
                <input name="state" value={address.state} onChange={handleAddressChange} required />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Postal Code *</label>
                <input name="postalCode" value={address.postalCode} onChange={handleAddressChange} required />
              </div>
              <div className={styles.field}>
                <label>Country *</label>
                <input name="country" value={address.country} onChange={handleAddressChange} required />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className={styles.section}>
            <h2>Payment Method</h2>
            <div className={styles.paymentMethods}>
              <button
                className={`${styles.payMethod} ${paymentMethod === 'razorpay' ? styles.payMethodActive : ''}`}
                onClick={() => setPaymentMethod('razorpay')}
              >
                <h4>Razorpay</h4>
                <p>UPI, Cards, NetBanking</p>
              </button>
              <button
                className={`${styles.payMethod} ${paymentMethod === 'stripe' ? styles.payMethodActive : ''}`}
                onClick={() => setPaymentMethod('stripe')}
              >
                <h4>Stripe</h4>
                <p>International Cards</p>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h2>Order Summary</h2>
          {items.map((item) => (
            <div key={item._id} className={styles.summaryItem}>
              <img src={item.productId?.images?.[0] || '/placeholder.jpg'} alt="" className={styles.summaryImg} />
              <div className={styles.summaryItemInfo}>
                <h4>{item.productId?.title}</h4>
                <p>{item.size} &middot; Qty: {item.quantity}</p>
              </div>
              <span className={styles.summaryItemPrice}>
                {formatPrice(getItemPrice(item) * item.quantity)}
              </span>
            </div>
          ))}

          <div className={styles.summaryTotals}>
            {/* Coupon Input */}
            <div className={styles.couponSection}>
              {couponApplied ? (
                <div className={styles.couponApplied}>
                  <span>🎟️ {couponApplied.code} applied (-{formatPrice(couponDiscount)})</span>
                  <button onClick={handleRemoveCoupon} className={styles.couponRemove}>Remove</button>
                </div>
              ) : (
                <div className={styles.couponInput}>
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <button onClick={handleApplyCoupon} className={styles.couponBtn}>Apply</button>
                </div>
              )}
              {couponError && <p className={styles.couponError}>{couponError}</p>}
            </div>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className={styles.summaryRow} style={{ color: 'var(--success)' }}>
                <span>Discount</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            className={styles.placeOrder}
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
