import { ShopContent } from '@/components/shop-content';
import {
  getProductTemplates,
  getFilterOptions,
  ProductTemplate,
} from '@/lib/products';

// Convert templates to display products for shop
function templatesToDisplayProducts(templates: ProductTemplate[]) {
  return templates
    .filter(
      (template) =>
        template.is_active &&
        template.variations &&
        template.variations.length > 0
    )
    .map((template) => {
      // Use the first active variation as default for display
      const defaultVariation =
        template.variations.find((v) => v.is_active) || template.variations[0];
      const mainImage =
        defaultVariation.images?.find((img) => img.isMain) ||
        defaultVariation.images?.[0];

      return {
        id: template.id, // Use template ID for navigation
        name: template.name,
        price: parseFloat(defaultVariation.price),
        image: mainImage?.url || '',
        category: template.categories[0]?.name || 'Uncategorized',
        material: defaultVariation.attributes?.material,
        color: defaultVariation.attributes?.color,
        // Add variation info for display
        variations: template.variations.filter((v) => v.is_active),
        minPrice: Math.min(
          ...template.variations.map((v) => parseFloat(v.price))
        ),
        maxPrice: Math.max(
          ...template.variations.map((v) => parseFloat(v.price))
        ),
      };
    });
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const templates = await getProductTemplates();
  const products = templatesToDisplayProducts(templates);
  const filterOptions = await getFilterOptions(templates);
  const params = await searchParams;

  return (
    <div className="flex flex-col min-h-screen">
      <ShopContent
        products={products}
        filterOptions={filterOptions}
        searchQuery={params.search}
      />
    </div>
  );
}
