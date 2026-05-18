import { ProductDetailClient } from '@/components/product-detail-client';
import { getProductTemplates, getRelatedProducts } from '@/lib/products';
import { getProductReviews, getProductRatingSummary } from '@/lib/reviews';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Find template containing this variation
  const templates = await getProductTemplates();
  const foundTemplate = templates.find((t) => t.id === id) || null;

  const foundVariation =
    foundTemplate?.variations.find((v) => v.is_active) ||
    foundTemplate?.variations[0];

  if (!foundVariation || !foundTemplate) {
    notFound();
  }

  // Load related products
  const relatedProducts = await getRelatedProducts(
    foundTemplate.id,
    foundTemplate.categories[0]?.name || 'Uncategorized'
  );

  // Load reviews and session
  const reviews = await getProductReviews(id);
  const ratingSummary = await getProductRatingSummary(id);
  const session = await getServerSession(authOptions);

  const user = session?.user
    ? {
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image,
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <ProductDetailClient
        initialTemplate={foundTemplate}
        initialVariation={foundVariation}
        initialRelatedProducts={relatedProducts}
        initialReviews={reviews}
        initialRatingSummary={ratingSummary}
        initialUser={user}
      />
    </div>
  );
}
