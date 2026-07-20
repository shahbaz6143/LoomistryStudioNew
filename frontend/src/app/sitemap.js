const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const SITE_URL = 'https://loomistrystudio.com';

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/auth/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Category pages
  const categories = ['hand-knotted', 'hand-tufted', 'flatweave', 'persian', 'abstract', 'traditional', 'modern'];
  const categoryPages = categories.map(cat => ({
    url: `${SITE_URL}/products?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Product pages (fetch from API)
  let productPages = [];
  try {
    const res = await fetch(`${API_URL}/products?limit=100`);
    const data = await res.json();
    if (data.data) {
      productPages = data.data.map(product => ({
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || product.createdAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch products');
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
