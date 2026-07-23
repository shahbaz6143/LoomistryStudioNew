'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import fetchAPI from '@/services/api';
import styles from './SearchModal.module.css';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetchAPI(`/products/search?q=${encodeURIComponent(query)}&limit=6`);
        setResults(response.data || []);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <svg className={styles.searchIcon} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search rugs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className={styles.closeBtn}>&times;</button>
        </div>

        {loading && <div className={styles.loading}>Searching...</div>}

        {/* Trending searches — shown when query is empty */}
        {query.length < 2 && !loading && (
          <div className={styles.trending}>
            <p className={styles.trendingLabel}>Popular Searches</p>
            <div className={styles.trendingTags}>
              {['Persian Rugs', 'Hand Knotted', 'Wool', 'Modern', 'Runner', 'Round Rug', 'Jute', 'Living Room'].map((term) => (
                <button key={term} className={styles.trendingTag} onClick={() => setQuery(term)}>
                  {term}
                </button>
              ))}
            </div>
            <p className={styles.trendingLabel} style={{ marginTop: '1.25rem' }}>Shop by Room</p>
            <div className={styles.trendingTags}>
              {['Living Room', 'Bedroom', 'Dining Room', 'Kids Room', 'Hallway'].map((room) => (
                <Link key={room} href={`/products?collection=${room.toLowerCase().replace(' ', '-')}`} className={styles.trendingTag} onClick={onClose}>
                  {room}
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className={styles.results}>
            {results.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}`}
                className={styles.resultItem}
                onClick={onClose}
              >
                <img
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.title}
                  className={styles.resultImg}
                />
                <div className={styles.resultInfo}>
                  <span className={styles.resultTitle}>{product.title}</span>
                  <span className={styles.resultMeta}>
                    {product.category}
                    {product.fixedSizes?.[0] && ` • ₹${product.fixedSizes[0].priceINR.toLocaleString()}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {query.length >= 2 && !loading && results.length === 0 && (
          <div className={styles.empty}>No products found for &ldquo;{query}&rdquo;</div>
        )}
      </div>
    </div>
  );
}
