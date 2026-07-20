'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function CataloguePage({ params }) {
  const [catalogue, setCatalogue] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [turning, setTurning] = useState(null); // 'next' or 'prev'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalogue() {
      try {
        const res = await fetch(`${API_URL}/catalogues/${params.slug}`);
        const data = await res.json();
        if (data.data) setCatalogue(data.data);
      } catch (error) {
        console.error('Failed to fetch catalogue:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogue();
  }, [params.slug]);

  const totalPages = catalogue?.pages?.length || 0;

  const turnNext = () => {
    if (currentPage >= totalPages - 1 || turning) return;
    setTurning('next');
    setTimeout(() => {
      setCurrentPage((p) => p + 1);
      setTurning(null);
    }, 600);
  };

  const turnPrev = () => {
    if (currentPage <= 0 || turning) return;
    setTurning('prev');
    setTimeout(() => {
      setCurrentPage((p) => p - 1);
      setTurning(null);
    }, 600);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') turnNext();
      if (e.key === 'ArrowLeft') turnPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentPage, turning]);

  if (loading) {
    return (
      <div className={styles.page}>
        <p style={{ color: 'white' }}>Loading catalogue...</p>
      </div>
    );
  }

  if (!catalogue) {
    return (
      <div className={styles.page}>
        <p style={{ color: 'white' }}>Catalogue not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Book */}
      <div className={styles.book}>
        <div className={styles.bookInner}>
          {/* Left page (current - 1 or back of current) */}
          <div className={styles.pageLeft}>
            {currentPage > 0 ? (
              <img src={catalogue.pages[currentPage - 1]} alt={`Page ${currentPage}`} className={styles.pageImg} />
            ) : (
              <div className={styles.coverContent}>
                <h1 className={styles.coverTitle}>{catalogue.title}</h1>
                <p className={styles.coverBrand}>by LoomistryStudio</p>
              </div>
            )}
          </div>

          {/* Right page (current) */}
          <div className={styles.pageRight}>
            <img src={catalogue.pages[currentPage]} alt={`Page ${currentPage + 1}`} className={styles.pageImg} />
          </div>

          {/* Page turn animation */}
          {turning === 'next' && (
            <div className={styles.turnPageNext}>
              <div className={styles.turnFront}>
                <img src={catalogue.pages[currentPage]} alt="" className={styles.pageImg} />
              </div>
              <div className={styles.turnBack}>
                {catalogue.pages[currentPage + 1] && (
                  <img src={catalogue.pages[currentPage + 1]} alt="" className={styles.pageImg} />
                )}
              </div>
            </div>
          )}

          {turning === 'prev' && (
            <div className={styles.turnPagePrev}>
              <div className={styles.turnFront}>
                {catalogue.pages[currentPage - 1] && (
                  <img src={catalogue.pages[currentPage - 1]} alt="" className={styles.pageImg} />
                )}
              </div>
              <div className={styles.turnBack}>
                <img src={catalogue.pages[currentPage]} alt="" className={styles.pageImg} />
              </div>
            </div>
          )}

          {/* Book spine shadow */}
          <div className={styles.spine} />
        </div>

        {/* Click areas */}
        <button className={styles.clickLeft} onClick={turnPrev} disabled={currentPage === 0 || !!turning} aria-label="Previous page" />
        <button className={styles.clickRight} onClick={turnNext} disabled={currentPage >= totalPages - 1 || !!turning} aria-label="Next page" />
      </div>

      {/* Navigation bar */}
      <div className={styles.navBar}>
        <button className={styles.navBtn} onClick={turnPrev} disabled={currentPage === 0 || !!turning}>
          &#8249;
        </button>

        <div className={styles.navCenter}>
          <span className={styles.pageNum}>{currentPage + 1} / {totalPages}</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }} />
          </div>
        </div>

        <button className={styles.navBtn} onClick={turnNext} disabled={currentPage >= totalPages - 1 || !!turning}>
          &#8250;
        </button>

        <button className={styles.fullscreenBtn} onClick={() => document.documentElement.requestFullscreen?.()}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
