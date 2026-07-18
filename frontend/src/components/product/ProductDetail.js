'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProductBySlug } from '@/services/product.service';
import styles from './ProductDetail.module.css';

export default function ProductDetail({ slug }) {
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await getProductBySlug(slug);
        const prod = response.data;
        setProduct(prod);
        if (prod.fixedSizes?.length > 0) setSelectedSize(prod.fixedSizes[0]);
        if (prod.colors?.length > 0) setSelectedColor(prod.colors[0]);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton} style={{ height: '500px' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={product.images?.[activeImage] || '/placeholder.jpg'}
              alt={product.title}
            />
          </div>
          <div className={styles.thumbnails}>
            {product.images?.map((img, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt={`${product.title} - ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.info}>
          <p className={styles.category}>{product.category} &middot; {product.material}</p>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.rating}>
            <span className={styles.stars}>{'★'.repeat(Math.round(product.avgRating))}</span>
            <span className={styles.ratingText}>
              {product.avgRating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className={styles.price}>
            {selectedSize && (
              <>
                <span className={styles.priceAmount}>
                  &#8377;{selectedSize.priceINR.toLocaleString()}
                </span>
                <span className={styles.priceUsd}>
                  (${selectedSize.priceUSD})
                </span>
              </>
            )}
          </div>

          {/* Size Selection */}
          <div className={styles.option}>
            <label>Size</label>
            <div className={styles.sizes}>
              {product.fixedSizes?.map((size) => (
                <button
                  key={size.label}
                  className={`${styles.sizeBtn} ${selectedSize?.label === size.label ? styles.sizeBtnActive : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className={styles.option}>
            <label>Color</label>
            <div className={styles.colors}>
              {product.colors?.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorBtn} ${selectedColor === color ? styles.colorBtnActive : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Size */}
          {product.customSizePrice && (
            <div className={styles.customSize}>
              <p>
                Custom size available: &#8377;{product.customSizePrice.pricePerSqFtINR}/sq ft
                (${product.customSizePrice.pricePerSqFtUSD}/sq ft)
              </p>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.addToCart} onClick={() => {
              if (!user) { router.push(`/auth/login?redirect=/products/${slug}`); return; }
              alert('Added to cart!');
            }}>Add to Cart</button>
            <button className={styles.wishlistBtn} onClick={() => {
              if (!user) { router.push(`/auth/login?redirect=/products/${slug}`); return; }
              alert('Added to wishlist!');
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
