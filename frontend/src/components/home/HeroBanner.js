'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HeroBanner.module.css';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=1920&q=85',
    title: 'Timeless, In White',
    cta: 'Explore Now',
    link: '/products?collection=bestsellers',
  },
  {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=85',
    title: 'The Modern Weave',
    cta: 'Shop Collection',
    link: '/products?category=modern',
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85',
    title: 'Artisan Heritage',
    cta: 'Discover More',
    link: '/products?category=hand-knotted',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero}>
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === current ? styles.active : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>{SLIDES[current].title}</h1>
          <Link href={SLIDES[current].link} className={styles.cta}>
            {SLIDES[current].cta}
          </Link>
        </div>
      </div>

      {/* Slide indicators */}
      <div className={styles.indicators}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}
