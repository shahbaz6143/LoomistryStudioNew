'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { getProductBySlug, getProducts } from '@/services/product.service';
import ProductCard from './ProductCard';
import styles from './ProductDetail.module.css';

export default function ProductDetail({ slug }) {
  const { user } = useAuth();
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
  const { getPrice, getCustomPrice, formatPrice, currency } = useCurrency();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Custom size state
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await getProductBySlug(slug);
        const prod = response.data;
        setProduct(prod);
        if (prod.fixedSizes?.length > 0) setSelectedSize(prod.fixedSizes[0]);
        if (prod.colors?.length > 0) setSelectedColor(prod.colors[0]);
        if (prod.variations?.length > 0) setSelectedVariation(prod.variations[0]);

        // Fetch related products (same category)
        const related = await getProducts({ category: prod.category, limit: 4 });
        setRelatedProducts((related.data || []).filter(p => p._id !== prod._id).slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  // Calculate custom size price
  const customPrice = product?.customSizePrice && customWidth && customHeight
    ? Number(customWidth) * Number(customHeight) * getCustomPrice(product.customSizePrice)
    : 0;

  // Current display price
  const currentPrice = useCustomSize ? customPrice : (selectedSize ? getPrice(selectedSize) : 0);

  const handleAddToCart = async () => {
    if (!user) { router.push(`/auth/login?redirect=/products/${slug}`); return; }

    const success = await addToCart({
      productId: product._id,
      size: useCustomSize ? `Custom ${customWidth}x${customHeight} ft` : selectedSize?.label,
      color: selectedColor || '',
      quantity,
      isCustomSize: useCustomSize,
      customDimensions: useCustomSize ? { width: Number(customWidth), height: Number(customHeight) } : undefined,
    });

    if (success) alert('Added to cart!');
  };

  const handleWishlist = async () => {
    if (!user) { router.push(`/auth/login?redirect=/products/${slug}`); return; }
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

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

  const wishlisted = product && isInWishlist(product._id);

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">Shop</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span className={styles.current}>{product.title}</span>
      </nav>

      <div className={styles.grid}>
        {/* Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={product.images?.[activeImage] || '/placeholder.jpg'}
              alt={product.title}
            />
          </div>
          {product.video && (
            <div className={styles.videoTag}>Video Available</div>
          )}
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
            <span className={styles.stars}>{'★'.repeat(Math.round(product.avgRating))}{'☆'.repeat(5 - Math.round(product.avgRating))}</span>
            <span className={styles.ratingText}>
              {product.avgRating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className={styles.price}>
            <span className={styles.priceAmount}>{formatPrice(currentPrice)}</span>
            <span className={styles.currencyNote}>
              Showing prices in {currency.code}
            </span>
          </div>

          {/* Size Selection */}
          <div className={styles.option}>
            <label>Size {useCustomSize && '(Custom)'}</label>
            <div className={styles.sizes}>
              {product.fixedSizes?.map((size) => (
                <button
                  key={size.label}
                  className={`${styles.sizeBtn} ${!useCustomSize && selectedSize?.label === size.label ? styles.sizeBtnActive : ''}`}
                  onClick={() => { setSelectedSize(size); setUseCustomSize(false); }}
                >
                  {size.label} — {formatPrice(getPrice(size))}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Size Calculator */}
          {product.customSizePrice && (
            <div className={styles.customSizeSection}>
              <button
                className={`${styles.customToggle} ${useCustomSize ? styles.customToggleActive : ''}`}
                onClick={() => setUseCustomSize(!useCustomSize)}
              >
                {useCustomSize ? '✓ Custom Size Selected' : 'Need a custom size?'}
              </button>
              {useCustomSize && (
                <div className={styles.customInputs}>
                  <div className={styles.customRow}>
                    <div className={styles.customField}>
                      <label>Width (ft)</label>
                      <input
                        type="number"
                        min={product.customSizePrice.minWidth}
                        max={product.customSizePrice.maxWidth}
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        placeholder={`${product.customSizePrice.minWidth}-${product.customSizePrice.maxWidth}`}
                      />
                    </div>
                    <span className={styles.customX}>×</span>
                    <div className={styles.customField}>
                      <label>Height (ft)</label>
                      <input
                        type="number"
                        min={product.customSizePrice.minHeight}
                        max={product.customSizePrice.maxHeight}
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        placeholder={`${product.customSizePrice.minHeight}-${product.customSizePrice.maxHeight}`}
                      />
                    </div>
                  </div>
                  <p className={styles.customCalc}>
                    Rate: {formatPrice(getCustomPrice(product.customSizePrice))}/sq ft
                    {customWidth && customHeight && (
                      <> &middot; Area: {(Number(customWidth) * Number(customHeight)).toFixed(1)} sq ft &middot; <strong>Total: {formatPrice(customPrice)}</strong></>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div className={styles.option}>
              <label>Color: <strong>{selectedColor}</strong></label>
              <div className={styles.colors}>
                {product.colors.map((color) => (
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
          )}

          {/* Variations */}
          {product.variations?.length > 0 && (
            <div className={styles.option}>
              <label>Variation</label>
              <div className={styles.colors}>
                {product.variations.map((v) => (
                  <button
                    key={v}
                    className={`${styles.colorBtn} ${selectedVariation === v ? styles.colorBtnActive : ''}`}
                    onClick={() => setSelectedVariation(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className={styles.option}>
            <label>Quantity</label>
            <div className={styles.quantityControl}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          {/* Actions — hidden for admin (admin manages products from CMS) */}
          {(!user || user.role === 'buyer') && (
            <div className={styles.actions}>
              <button className={styles.addToCart} onClick={handleAddToCart}>
                Add to Cart — {formatPrice(currentPrice * quantity)}
              </button>
              <button
                className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
                onClick={handleWishlist}
              >
                <svg width="20" height="20" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          )}

          {/* Description */}
          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Product Details */}
          <div className={styles.details}>
            <h3>Product Details</h3>
            <table>
              <tbody>
                <tr><td>Material</td><td>{product.material}</td></tr>
                <tr><td>Category</td><td style={{ textTransform: 'capitalize' }}>{product.category?.replace('-', ' ')}</td></tr>
                <tr><td>Shape</td><td style={{ textTransform: 'capitalize' }}>{product.shape}</td></tr>
                <tr><td>Available Colors</td><td>{product.colors?.join(', ')}</td></tr>
                {product.stock > 0 && <tr><td>In Stock</td><td>{product.stock} units</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className={styles.related}>
          <h2>You May Also Like</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            image: product.images,
            brand: { '@type': 'Brand', name: 'LoomistryStudio' },
            category: product.category,
            material: product.material,
            aggregateRating: product.reviewCount > 0 ? {
              '@type': 'AggregateRating',
              ratingValue: product.avgRating,
              reviewCount: product.reviewCount,
            } : undefined,
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'INR',
              lowPrice: Math.min(...(product.fixedSizes || []).map(s => s.priceINR)),
              highPrice: Math.max(...(product.fixedSizes || []).map(s => s.priceINR)),
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
    </div>
  );
}
