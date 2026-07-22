'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import fetchAPI from '@/services/api';
import styles from './page.module.css';

export default function AccountPage() {
  const { user } = useAuth();
  const { confirm, showToast } = useToast();
  const [tab, setTab] = useState('addresses');
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false });
  const [cardForm, setCardForm] = useState({ cardholderName: '', last4: '', brand: 'visa', expiryMonth: '', expiryYear: '', isDefault: false });

  useEffect(() => {
    if (!user) return;
    fetchAPI('/account/addresses').then(r => setAddresses(r.data || [])).catch(() => {});
    fetchAPI('/account/cards').then(r => setCards(r.data || [])).catch(() => {});
  }, [user]);

  // Address handlers
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchAPI('/account/addresses', { method: 'POST', body: JSON.stringify(addressForm) });
      setAddresses(res.data);
      setShowAddressForm(false);
      setAddressForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false });
      showToast({ title: 'Address Saved', message: 'Your address has been added successfully.' });
    } catch (err) {
      showToast({ title: 'Error', message: err.message });
    }
  };

  const handleDeleteAddress = (id) => {
    confirm({
      title: 'Delete Address',
      message: 'Are you sure you want to remove this address?',
      confirmText: 'Delete',
      onConfirm: async () => {
        const res = await fetchAPI(`/account/addresses/${id}`, { method: 'DELETE' });
        setAddresses(res.data);
      },
    });
  };

  // Card handlers
  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchAPI('/account/cards', { method: 'POST', body: JSON.stringify(cardForm) });
      setCards([...cards, res.data]);
      setShowCardForm(false);
      setCardForm({ cardholderName: '', last4: '', brand: 'visa', expiryMonth: '', expiryYear: '', isDefault: false });
      showToast({ title: 'Card Saved', message: 'Your payment method has been saved.' });
    } catch (err) {
      showToast({ title: 'Error', message: err.message });
    }
  };

  const handleDeleteCard = (id) => {
    confirm({
      title: 'Remove Card',
      message: 'Are you sure you want to remove this saved card?',
      confirmText: 'Remove',
      onConfirm: async () => {
        await fetchAPI(`/account/cards/${id}`, { method: 'DELETE' });
        setCards(cards.filter(c => c._id !== id));
      },
    });
  };

  if (!user) {
    return <div className={`container ${styles.page}`}><p className={styles.empty}>Please sign in to manage your account.</p></div>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>My Account</h1>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'addresses' ? styles.tabActive : ''}`} onClick={() => setTab('addresses')}>Saved Addresses</button>
        <button className={`${styles.tab} ${tab === 'cards' ? styles.tabActive : ''}`} onClick={() => setTab('cards')}>Saved Cards</button>
      </div>

      {/* Addresses Tab */}
      {tab === 'addresses' && (
        <>
          <button onClick={() => setShowAddressForm(!showAddressForm)} className={styles.addBtn}>
            {showAddressForm ? 'Cancel' : '+ Add New Address'}
          </button>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className={styles.form}>
              <h3>New Address</h3>
              <div className={styles.row}>
                <div className={styles.field}><label>Full Name *</label><input value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} required /></div>
                <div className={styles.field}><label>Phone *</label><input value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} required /></div>
              </div>
              <div className={styles.field}><label>Address Line 1 *</label><input value={addressForm.addressLine1} onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})} required /></div>
              <div className={styles.field}><label>Address Line 2</label><input value={addressForm.addressLine2} onChange={e => setAddressForm({...addressForm, addressLine2: e.target.value})} /></div>
              <div className={styles.row}>
                <div className={styles.field}><label>City *</label><input value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required /></div>
                <div className={styles.field}><label>State *</label><input value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} required /></div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}><label>Postal Code *</label><input value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} required /></div>
                <div className={styles.field}><label>Country *</label><input value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} required /></div>
              </div>
              <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} /> Set as default
              </label>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>Save Address</button>
              </div>
            </form>
          )}

          <div className={styles.grid}>
            {addresses.length === 0 && !showAddressForm && (
              <p className={styles.empty}>No saved addresses. Add one for faster checkout.</p>
            )}
            {addresses.map((addr) => (
              <div key={addr._id} className={styles.addressCard}>
                <div className={styles.addressHeader}>
                  <h4>{addr.fullName} {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}</h4>
                </div>
                <div className={styles.addressBody}>
                  {addr.addressLine1}<br />
                  {addr.addressLine2 && <>{addr.addressLine2}<br /></>}
                  {addr.city}, {addr.state} {addr.postalCode}<br />
                  {addr.country}<br />
                  Phone: {addr.phone}
                </div>
                <div className={styles.addressActions}>
                  <button onClick={() => handleDeleteAddress(addr._id)} className={styles.rmBtn}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Cards Tab */}
      {tab === 'cards' && (
        <>
          <button onClick={() => setShowCardForm(!showCardForm)} className={styles.addBtn}>
            {showCardForm ? 'Cancel' : '+ Add New Card'}
          </button>

          {showCardForm && (
            <form onSubmit={handleAddCard} className={styles.form}>
              <h3>Add Payment Card</h3>
              <div className={styles.field}><label>Cardholder Name *</label><input value={cardForm.cardholderName} onChange={e => setCardForm({...cardForm, cardholderName: e.target.value})} required placeholder="Name on card" /></div>
              <div className={styles.row}>
                <div className={styles.field}><label>Last 4 Digits *</label><input value={cardForm.last4} onChange={e => setCardForm({...cardForm, last4: e.target.value})} required maxLength={4} placeholder="1234" /></div>
                <div className={styles.field}><label>Card Brand *</label>
                  <select value={cardForm.brand} onChange={e => setCardForm({...cardForm, brand: e.target.value})}>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="rupay">RuPay</option>
                  </select>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}><label>Expiry Month *</label><input type="number" min="1" max="12" value={cardForm.expiryMonth} onChange={e => setCardForm({...cardForm, expiryMonth: e.target.value})} required placeholder="MM" /></div>
                <div className={styles.field}><label>Expiry Year *</label><input type="number" min="2024" max="2040" value={cardForm.expiryYear} onChange={e => setCardForm({...cardForm, expiryYear: e.target.value})} required placeholder="YYYY" /></div>
              </div>
              <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="checkbox" checked={cardForm.isDefault} onChange={e => setCardForm({...cardForm, isDefault: e.target.checked})} /> Set as default
              </label>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>Save Card</button>
              </div>
            </form>
          )}

          <div className={styles.grid}>
            {cards.length === 0 && !showCardForm && (
              <p className={styles.empty}>No saved cards. Add one for faster checkout.</p>
            )}
            {cards.map((card) => (
              <div key={card._id} className={styles.card}>
                <div className={styles.cardIcon}>{card.brand}</div>
                <div className={styles.cardInfo}>
                  <h4>•••• •••• •••• {card.last4}</h4>
                  <p>{card.cardholderName} &middot; Expires {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}</p>
                </div>
                {card.isDefault && <span className={styles.defaultBadge}>Default</span>}
                <button onClick={() => handleDeleteCard(card._id)} className={styles.deleteBtn}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
