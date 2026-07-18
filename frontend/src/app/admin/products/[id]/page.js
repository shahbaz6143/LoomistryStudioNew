import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }) {
  return <ProductForm mode="edit" productId={params.id} />;
}
