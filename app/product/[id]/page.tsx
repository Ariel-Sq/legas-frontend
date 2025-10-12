import { ProductDetailClient } from '@/components/product-detail-client';
import { Footer } from '@/components/footer';
import { getProductTemplates, getRelatedProducts } from '@/lib/data';
import { getProductReviews, getProductRatingSummary } from '@/lib/reviews';
import { getCurrentUser } from '@/lib/user';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Find template containing this variation
  const templates = await getProductTemplates();
  let foundTemplate = null;
  let foundVariation = null;

  // First check if it's a template ID
  foundTemplate = templates.find((t) => t.id === id) || null;
  if (foundTemplate) {
    // If it's a template ID, use the first active variation
    foundVariation =
      foundTemplate.variations.find((v) => v.is_active) ||
      foundTemplate.variations[0];
  } else {
    // Check if it's a variation ID
    for (const temp of templates) {
      const variation = temp.variations.find((v) => v.id === id);
      if (variation) {
        foundTemplate = temp;
        foundVariation = variation;
        break;
      }
    }
  }

  if (!foundTemplate || !foundVariation) {
    notFound();
  }

  // Load related products
  const relatedProducts = await getRelatedProducts(
    foundVariation.id,
    foundTemplate.categories[0]?.name || 'Uncategorized'
  );

  // Load reviews
  const reviews = await getProductReviews(id);
  const ratingSummary = await getProductRatingSummary(id);
  const user = await getCurrentUser();

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
      <Footer />
    </div>
  );
}
