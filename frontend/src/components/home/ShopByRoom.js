'use client';

import Link from 'next/link';
import styles from './ShopByRoom.module.css';

const ROOMS = [
  {
    name: 'Living Room',
    slug: 'living-room',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=700&fit=crop',
  },
  {
    name: 'Bedroom',
    slug: 'bedroom',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=700&fit=crop',
  },
  {
    name: 'Dining Room',
    slug: 'dining-room',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=700&fit=crop',
  },
  {
    name: 'Kids Room',
    slug: 'kids-room',
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&h=700&fit=crop',
  },
];

export default function ShopByRoom() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {ROOMS.map((room) => (
          <Link key={room.slug} href={`/products?collection=${room.slug}`} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={room.image} alt={room.name} className={styles.image} />
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{room.name.toUpperCase()}</h3>
              <span className={styles.sub}>RUGS</span>
              <span className={styles.viewAll}>VIEW ALL</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
