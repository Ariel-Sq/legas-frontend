import type { Metadata } from 'next';
import { ProductDetailClient } from '@/components/product-detail-client';
import {
  getProductTemplateBySlugOrId,
  getRelatedProducts,
} from '@/lib/products';
import { getProductReviews, getProductRatingSummary } from '@/lib/reviews';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/utils/environments';

interface ProductPageProps {
  // Accepts the template slug (canonical, SEO-friendly) or the uuid
  // (legacy links from cart items / old bookmarks).
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const template = await getProductTemplateBySlugOrId(id);
  if (!template) return {};

  const variation =
    template.variations.find((v) => v.is_active) || template.variations[0];
  const image =
    variation?.images?.find((img) => img.isMain)?.url ||
    variation?.images?.[0]?.url;
  const description =
    template.description ??
    `${template.name} — muebles de madera artesanales Legas.`;

  return {
    title: template.name,
    description,
    alternates: { canonical: `${SITE_URL}/product/${template.slug}` },
    openGraph: {
      title: template.name,
      description,
      url: `${SITE_URL}/product/${template.slug}`,
      type: 'website',
      ...(image ? { images: [{ url: image, alt: template.name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const foundTemplate = await getProductTemplateBySlugOrId(id);

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

  const session = await getServerSession(authOptions);
  const user = session?.user
    ? {
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image,
      }
    : null;

  const reviews = await getProductReviews(foundTemplate.id, user?.id);
  const ratingSummary = await getProductRatingSummary(foundTemplate.id);

  // Product structured data (schema.org) so Google can show rich results
  // (price, availability) for product pages.
  const activeVariations = foundTemplate.variations.filter(
    (v) => v.is_active
  );
  const prices = activeVariations.map((v) => parseFloat(v.price));
  const inStock = activeVariations.some((v) => v.stock > 0);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: foundTemplate.name,
    description: foundTemplate.description ?? undefined,
    image:
      foundVariation.images?.find((img) => img.isMain)?.url ||
      foundVariation.images?.[0]?.url,
    sku: foundVariation.sku,
    brand: { '@type': 'Brand', name: 'Legas Muebles' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'ARS',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: activeVariations.length,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/product/${foundTemplate.slug}`,
    },
    ...(ratingSummary && ratingSummary.totalReviews > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: ratingSummary.averageRating,
            reviewCount: ratingSummary.totalReviews,
          },
        }
      : {}),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // Escape `<` so a product name/description containing `</script>`
        // can't break out of the JSON-LD block (stored XSS). JSON.stringify
        // alone does not escape it.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
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
