'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import fetchAPI from '@/services/api';
import styles from './ReviewSection.module.css';

export default function ReviewSection({ productId, avgRating, reviewCount }) {
  const { user } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sort, setSort] = useState('newest');

  const fetchReviews = async () => {
    try {
      const response = await fetchAPI(`/reviews/${productId}?sort=${sort}`);
      setReviews(response.data || []);
      setBreakdown(response.breakdown || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId, sort]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { router.push('/auth/login'); return; }
    if (rating === 0 || !comment.trim()) return;

    setSubmitting(true);
    try {
      await fetchAPI('/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId, rating, comment }),
      });
      setShowForm(false);
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getBreakdownCount = (star) => {
    const found = breakdown.find(b => b._id === star);
    return found ? found.count : 0;
  };

  const totalReviews = reviews.length || reviewCount || 0;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Customer Reviews</h2>
        {user && user.role === 'buyer' && (
          <button className={styles.writeBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className={styles.summary}>
          <div className={styles.avgRating}>
            <span className={styles.number}>{avgRating || 0}</span>
            <div className={styles.stars}>{'★'.repeat(Math.round(avgRating || 0))}{'☆'.repeat(5 - Math.round(avgRating || 0))}</div>
            <span className={styles.count}>{totalReviews} reviews</span>
          </div>
          <div className={styles.breakdown}>
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className={styles.bar}>
                <span>{star}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: totalReviews > 0 ? `${(getBreakdownCount(star) / totalReviews) * 100}%` : '0%' }} />
                </div>
                <span>{getBreakdownCount(star)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>Share Your Experience</h3>
          <div className={styles.starInput}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`${styles.starBtn} ${star <= rating ? styles.starActive : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            placeholder="Tell us about your experience with this rug..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
          />
          <button type="submit" className={styles.submitBtn} disabled={submitting || rating === 0 || !comment.trim()}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Sort */}
      {reviews.length > 0 && (
        <div className={styles.sortRow}>
          <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className={styles.list}>
          {reviews.map((review) => (
            <div key={review._id} className={styles.review}>
              <div className={styles.reviewHeader}>
                <img src={review.userId?.avatar || '/placeholder.jpg'} alt="" className={styles.reviewAvatar} />
                <div className={styles.reviewMeta}>
                  <span className={styles.reviewName}>{review.userId?.name || 'Anonymous'}</span>
                  <span className={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {review.verified && <span className={styles.verifiedBadge}>Verified Purchase</span>}
              </div>
              <div className={styles.reviewStars}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              <p className={styles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      )}
    </section>
  );
}
