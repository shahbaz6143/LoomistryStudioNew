import ProductDetail from '@/components/product/ProductDetail';

export default function ProductPage({ params }) {
  return <ProductDetail slug={params.slug} />;
}
