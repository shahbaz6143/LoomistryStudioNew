export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/checkout', '/cart', '/orders'],
      },
    ],
    sitemap: 'https://loomistrystudio.com/sitemap.xml',
  };
}
