import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAdminProduct,
  listAdminCategories,
} from '@/lib/admin-api';
import { ProductEditor } from '@/components/admin/product-editor';
import { BACKEND_URL } from '@/utils/environments';

export const dynamic = 'force-dynamic';

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product;
  let categories;
  try {
    [product, categories] = await Promise.all([
      getAdminProduct(id),
      listAdminCategories(),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-primary hover:underline">
          ← Volver a productos
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-muted-foreground">
          {product.slug} · {product.variations.length} variantes
        </p>
      </div>

      <ProductEditor
        product={product}
        categories={categories}
        imageBase={BACKEND_URL ?? ''}
      />
    </div>
  );
}
