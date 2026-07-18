'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/services/product.service';
import ProductCard from './ProductCard';
import styles from './ProductList.module.css';

export default function ProductList() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const filters = {
          category: searchParams.get('category') || undefined,
          collection: searchParams.get('collection') || undefined,
          color: searchParams.get('color') || undefined,
          material: searchParams.get('material') || undefined,
          shape: searchParams.get('shape') || undefined,
          sort: searchParams.get('sort') || undefined,
          minPrice: searchParams.get('minPrice') || undefined,
          maxPrice: searchParams.get('maxPrice') || undefined,
        };

        const response = await getProducts(filters);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No products found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
