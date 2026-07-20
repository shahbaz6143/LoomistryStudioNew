'use client';

import { useEffect, useState } from 'react';
import fetchAPI from '@/services/api';
import styles from './page.module.css';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await fetchAPI('/admin/reviews');
      setReviews(response.data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleModerate = async (id, isApproved) => {
    try {
      await fetchAPI(`/admin/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isApproved }),
      });
      setReviews(reviews.map(r => r._id === id ? { ...r, isApproved } : r));
    } catch (error) {
      alert('Failed: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await fetchAPI(`/admin/reviews/${id}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r._id !== id));
    } catch (error) {
      alert('Failed: ' + error.message);
    }
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div>
      <h1 className={styles.title}>Reviews ({reviews.length})</h1>

      {reviews.length === 0 ? (
        <p className={styles.empty}>No reviews yet.</p>
      ) : (
        <div className={styles.list}>
          {reviews.map((review) => (
            <div key={review._id} className={`${styles.card} ${!review.isApproved ? styles.hidden : ''}`}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.stars}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  <span className={styles.product}>{review.productId?.title || 'Unknown Product'}</span>
                </div>
                <span className={`${styles.statusBadge} ${review.isApproved ? styles.approved : styles.hiddenBadge}`}>
                  {review.isApproved ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <p className={styles.comment}>{review.comment}</p>
              <div className={styles.cardFooter}>
                <div className={styles.reviewer}>
                  <strong>{review.userId?.name || 'Anonymous'}</strong>
                  <span>{review.userId?.email}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  {review.verified && <span className={styles.verified}>Verified</span>}
                </div>
                <div className={styles.actions}>
                  {review.isApproved ? (
                    <button onClick={() => handleModerate(review._id, false)} className={styles.hideBtn}>Hide</button>
                  ) : (
                    <button onClick={() => handleModerate(review._id, true)} className={styles.approveBtn}>Approve</button>
                  )}
                  <button onClick={() => handleDelete(review._id)} className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
