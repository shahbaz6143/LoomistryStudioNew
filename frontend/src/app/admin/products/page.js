'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminProducts, deleteProduct, toggleProduct } from '@/services/admin.service';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await getAdminProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await toggleProduct(id);
      setProducts(products.map((p) => (p._id === id ? response.data : p)));
    } catch (error) {
      alert('Failed to toggle: ' + error.message);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Products ({products.length})</h1>
        <Link href="/admin/products/new" className={styles.addBtn}>+ Add Product</Link>
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>No products yet. Create your first product!</p>
          <Link href="/admin/products/new" className={styles.addBtn}>+ Add Product</Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price (INR)</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.title}
                      className={styles.thumb}
                    />
                  </td>
                  <td>
                    <span className={styles.productTitle}>{product.title}</span>
                    <br />
                    <span className={styles.slug}>{product.slug}</span>
                  </td>
                  <td><span className={styles.badge}>{product.category}</span></td>
                  <td>
                    {product.fixedSizes?.[0]
                      ? `₹${product.fixedSizes[0].priceINR.toLocaleString()}`
                      : '—'}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      onClick={() => handleToggle(product._id)}
                      className={`${styles.statusBadge} ${product.isActive ? styles.active : styles.inactive}`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/products/${product._id}`} className={styles.editBtn}>
                        Edit
                      </Link>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(product._id, product.title)}
                          className={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
