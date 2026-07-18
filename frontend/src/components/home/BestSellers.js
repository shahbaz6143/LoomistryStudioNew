'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/services/product.service';
import ProductCard from '@/components/product/ProductCard';
import styles from './BestSellers.module.css';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const response = await getProducts({ collection: 'bestsellers', limit: 4 });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch bestsellers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <section className={`container section`}>
        <h2 className="section-title">Our Bestsellers</h2>
        <div className={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`container section`}>
      <h2 className="section-title">Our Bestsellers</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
