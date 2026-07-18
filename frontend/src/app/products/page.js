'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductList from '@/components/product/ProductList';
import FilterSidebar from '@/components/product/FilterSidebar';
import styles from './page.module.css';

const CATEGORY_NAMES = {
  'hand-knotted': 'Hand Knotted Rugs',
  'hand-tufted': 'Hand Tufted Rugs',
  'flatweave': 'Flatweave Rugs',
  'persian': 'Persian Rugs',
  'abstract': 'Abstract Rugs',
  'traditional': 'Traditional Rugs',
  'modern': 'Modern Rugs',
  'runner': 'Runners',
};

const COLLECTION_NAMES = {
  'bestsellers': 'Bestsellers',
  'new-arrivals': 'New Arrivals',
  'living-room': 'Living Room Collection',
  'bedroom': 'Bedroom Collection',
  'dining-room': 'Dining Room Collection',
  'deal-of-the-week': 'Deal of the Week',
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const collection = searchParams.get('collection');

  let title = 'Our Collection';
  if (category && CATEGORY_NAMES[category]) {
    title = CATEGORY_NAMES[category];
  } else if (collection && COLLECTION_NAMES[collection]) {
    title = COLLECTION_NAMES[collection];
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.layout}>
        <FilterSidebar />
        <div className={styles.main}>
          <ProductList />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container section"><p>Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
