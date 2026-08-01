'use server';

import { BACKEND_URL } from '@/utils/environments';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  level: number;
  image: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
  sortOrder: number;
  altText: string | null;
}

export interface PriceTier {
  min_quantity: number;
  max_quantity: number | null;
  price: string;
  is_active: boolean;
}

export interface ProductVariation {
  id: string;
  template_id: string;
  sku: string;
  name: string;
  price: string;
  stock: number;
  attributes: Record<string, any>;
  is_active: boolean;
  sort_order: number;
  images: ProductImage[];
  priceTiers: PriceTier[];
  reviews: any[]; // TODO: Define review structure and implement reviews in the UI
}

export interface ProductTemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specifications: Record<string, any>;
  categories: Category[];
  is_active: boolean;
  is_featured: boolean;
  variations: ProductVariation[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  /** Template slug — preferred over the uuid for product URLs (SEO). */
  slug?: string;
  material?: string;
  color?: string;
  images?: string[];
  fullDescription?: string;
  specifications?: { label: string; value: string }[];
  stock?: number;
  rating?: number;
  reviews?: number;
  templateId?: string;
  defaultVariationId?: string;
}

export interface ListProductTemplatesParams {
  sort?: 'created_at' | 'updated_at' | 'name';
  order?: 'asc' | 'desc';
  limit?: number;
  featured?: boolean;
}

export async function getProductTemplates(
  params?: ListProductTemplatesParams
): Promise<ProductTemplate[]> {
  const qs = params
    ? '?' +
      new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : '';
  // Resilient on purpose: several pages (home, shop, sitemap) prerender at
  // build time — an unreachable backend must degrade to an empty catalogue,
  // never break the deploy.
  try {
    const resp = await fetch(`${BACKEND_URL}/api/product-templates${qs}`);
    if (!resp.ok) {
      console.error(
        `getProductTemplates: backend responded ${resp.status} for ${qs || '/'}`
      );
      return [];
    }
    const data: ProductTemplate[] = await resp.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('getProductTemplates: backend unreachable', err);
    return [];
  }
}

export interface ShopDisplayProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  /** Template slug — preferred over the uuid for product URLs (SEO). */
  slug?: string;
  material?: string;
  color?: string;
  createdAt: string;
  variations: ProductVariation[];
  minPrice: number;
  maxPrice: number;
}

export interface ShopProductsPage {
  products: ShopDisplayProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filterOptions: {
    categories: string[];
    materials: string[];
    colors: { name: string; hex: string }[];
    priceRange: { min: number; max: number };
  };
}

export interface GetShopProductsPageParams {
  page?: number;
  limit?: number;
  q?: string;
  /** Category names (template category) — product matches if its category is in the list. */
  categories?: string[];
  /** Material names — product matches if ANY active variation has the material. */
  materials?: string[];
  /** Color name — product matches if ANY active variation has the color. */
  color?: string;
  /** Price range — product matches if its variation price range overlaps. */
  minPrice?: number;
  maxPrice?: number;
  sort?: ShopSortOption;
}

export type ShopSortOption = 'newest' | 'price-low' | 'price-high';

/**
 * Server-side paginated + searchable + filterable fetch for the /shop page.
 *
 * The backend's /api/product-templates endpoint does not currently expose
 * `page`/`q` query params (only `sort`, `order`, `limit`, `featured`), so we
 * fetch the active templates and apply search + filters + pagination here on
 * the server before returning to the page. Filters MUST run here (not on the
 * client) because they need to narrow the full catalogue, not the current
 * page slice. Filter options are computed from the FULL (unpaginated, but
 * search-filtered) result set so the sidebar reflects the full search space,
 * not just the current page.
 */
export async function getShopProductsPage(
  params: GetShopProductsPageParams = {}
): Promise<ShopProductsPage> {
  const page = Math.max(1, Math.floor(params.page ?? 1));
  const limit = Math.max(1, Math.min(100, Math.floor(params.limit ?? 12)));
  const q = (params.q ?? '').trim();

  const templates = await getProductTemplates();

  // Convert each template into one display product (first active variation
  // drives the card). Templates without active variations are skipped.
  const displayProducts: ShopDisplayProduct[] = [];
  for (const template of templates) {
    if (!template.is_active) continue;
    const activeVariations = (template.variations || []).filter(
      (v) => v.is_active
    );
    if (activeVariations.length === 0) continue;

    const defaultVariation = activeVariations[0];
    const mainImage =
      defaultVariation.images?.find((img) => img.isMain) ||
      defaultVariation.images?.[0];

    const prices = activeVariations.map((v) => parseFloat(v.price));
    displayProducts.push({
      id: template.id,
      name: template.name,
      price: parseFloat(defaultVariation.price),
      image: mainImage?.url || '',
      category: template.categories[0]?.name || 'Sin categoría',
      slug: template.slug,
      material: defaultVariation.attributes?.material,
      color: defaultVariation.attributes?.color,
      createdAt: template.created_at,
      variations: activeVariations,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    });
  }

  // Apply search filter on the server so pagination math is consistent with
  // what the user typed. Match against name, category, material, and color so
  // queries like "mesa", "alacena", or "roble" all work.
  const searchedProducts = q
    ? displayProducts.filter((p) => {
        const haystack = [p.name, p.category, p.material, p.color]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q.toLowerCase());
      })
    : displayProducts;

  // Facet filters, also over the full (searched) set — before pagination.
  const { categories, materials, color, minPrice, maxPrice } = params;
  const matchedProducts = searchedProducts.filter((p) => {
    if (categories?.length && !categories.includes(p.category)) return false;
    if (
      materials?.length &&
      !p.variations.some(
        (v) =>
          typeof v.attributes?.material === 'string' &&
          materials.includes(v.attributes.material)
      )
    )
      return false;
    if (color && !p.variations.some((v) => v.attributes?.color === color))
      return false;
    if (minPrice !== undefined && p.maxPrice < minPrice) return false;
    if (maxPrice !== undefined && p.minPrice > maxPrice) return false;
    return true;
  });

  // Sort over the full matched set — sorting the page slice client-side
  // would only reorder the 12 visible products. Price sorts use the
  // variation range (min for ascending, max for descending) so a product
  // whose top variation is the most expensive ranks first.
  const sort = params.sort ?? 'newest';
  switch (sort) {
    case 'price-low':
      matchedProducts.sort((a, b) => a.minPrice - b.minPrice);
      break;
    case 'price-high':
      matchedProducts.sort((a, b) => b.maxPrice - a.maxPrice);
      break;
    case 'newest':
    default:
      matchedProducts.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
      break;
  }

  const total = matchedProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const pageProducts = matchedProducts.slice(start, start + limit);

  // Compute filter options from the search-filtered (but NOT facet-filtered,
  // NOT paginated) set so the sidebar keeps showing every available option
  // instead of collapsing to the current selection.
  const filterTemplates = q
    ? templates.filter((t) => searchedProducts.some((p) => p.id === t.id))
    : templates;
  const filterOptions = await getFilterOptions(filterTemplates);

  return {
    products: pageProducts,
    total,
    page: safePage,
    limit,
    totalPages,
    filterOptions,
  };
}

export async function getProductTemplateById(
  id: string
): Promise<ProductTemplate | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const productTemplates = await getProductTemplates();
  return productTemplates.find((template) => template.id === id) || null;
}

/**
 * Resolve a template by slug (preferred, SEO-friendly URL) or by uuid
 * (legacy links: cart items, old bookmarks). Both keep working; canonical
 * URLs always use the slug.
 */
export async function getProductTemplateBySlugOrId(
  slugOrId: string
): Promise<ProductTemplate | null> {
  const productTemplates = await getProductTemplates();
  return (
    productTemplates.find(
      (template) => template.slug === slugOrId || template.id === slugOrId
    ) || null
  );
}

export async function getShopProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const productTemplates = await getProductTemplates();

  // Flatten variations from templates into products
  const products: Product[] = [];
  for (const template of productTemplates) {
    for (const variation of template.variations) {
      if (variation.is_active) {
        const mainImage =
          variation.images.find((img) => img.isMain) || variation.images[0];
        products.push({
          id: variation.id,
          name: variation.name,
          description: template.description || '',
          price: parseFloat(variation.price),
          image: mainImage?.url || '',
          category: template.categories[0]?.name || 'Uncategorized',
          slug: template.slug,
          material: variation.attributes?.material,
          color: variation.attributes?.color,
          images: variation.images.map((img) => img.url),
          stock: variation.stock,
          templateId: template.id,
          defaultVariationId: variation.id,
        });
      }
    }
  }

  // Add legacy products if needed
  if (products.length === 0) {
    products.push(
      {
        id: '1',
        name: 'The Willow Sofa',
        description: 'Comfortable three-seater sofa with premium upholstery',
        price: 799,
        image:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
        category: 'Sofas',
        material: 'Oak',
        color: 'Brown',
      }
      // ... other legacy products
    );
  }

  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const productTemplates = await getProductTemplates();

  // First try to find as variation id
  for (const template of productTemplates) {
    const variation = template.variations.find((v) => v.id === id);
    if (variation) {
      // Return flattened product for backward compatibility
      const mainImage =
        variation.images.find((img) => img.isMain) || variation.images[0];
      return {
        id: variation.id,
        name: variation.name,
        description: template.description || '',
        price: parseFloat(variation.price),
        image: mainImage?.url || '',
        category: template.categories[0]?.name || 'Uncategorized',
          slug: template.slug,
        material: variation.attributes?.material,
        color: variation.attributes?.color,
        images: variation.images.map((img) => img.url),
        fullDescription: template.description || '',
        specifications: Object.entries(template.specifications || {}).map(
          ([label, value]) => ({
            label,
            value: String(value),
          })
        ),
        stock: variation.stock,
        rating: 4.5, // Mock rating
        reviews: 10, // Mock reviews
      };
    }
  }

  // Fallback to old products
  const allProducts = await getAllProducts();
  return allProducts.find((p) => p.id === id) || null;
}

export async function getAllProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const productTemplates = await getProductTemplates();

  // Flatten variations from templates into products
  const products: Product[] = [];
  for (const template of productTemplates) {
    for (const variation of template.variations) {
      if (variation.is_active) {
        const mainImage =
          variation.images.find((img) => img.isMain) || variation.images[0];
        products.push({
          id: variation.id,
          name: variation.name,
          description: template.description || '',
          fullDescription: template.description || '',
          price: parseFloat(variation.price),
          image: mainImage?.url || '',
          images: variation.images
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((img) => img.url),
          category: template.categories[0]?.name || 'Uncategorized',
          slug: template.slug,
          material: variation.attributes?.material,
          color: variation.attributes?.color,
          specifications: Object.entries(template.specifications || {}).map(
            ([label, value]) => ({
              label,
              value: String(value),
            })
          ),
          stock: variation.stock,
          rating: 4.5, // Mock rating
          reviews: 10, // Mock reviews
          templateId: template.id,
          defaultVariationId: variation.id,
        });
      }
    }
  }

  return products;
}

export async function getRelatedProducts(
  templateId: string,
  category: string
): Promise<Product[]> {
  const allProducts = await getAllProducts();
  // Dedupe by templateId: show only one card per template (the first active
  // variation) so the current product's siblings (e.g. T-Shirt M when viewing
  // T-Shirt L) don't masquerade as "related". Card id is the template id so
  // the link points at /product/<templateId> (the route expects template ids).
  const seen = new Set<string>([templateId]);
  const related: Product[] = [];
  for (const p of allProducts) {
    if (p.category !== category) continue;
    if (!p.templateId || seen.has(p.templateId)) continue;
    seen.add(p.templateId);
    related.push({ ...p, id: p.templateId });
    if (related.length >= 4) break;
  }
  return related;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const templates = await getProductTemplates({
    featured: true,
    limit: 3,
  });

  const products: Product[] = [];
  for (const template of templates) {
    const variation = template.variations.find((v) => v.is_active);
    if (!variation) continue;
    const mainImage =
      variation.images.find((img) => img.isMain) || variation.images[0];
    products.push({
      id: template.id,
      name: template.name,
      description: template.description || '',
      price: parseFloat(variation.price),
      image: mainImage?.url || '',
      category: template.categories[0]?.name || 'featured',
      slug: template.slug,
      material: variation.attributes?.material,
      color: variation.attributes?.color,
      images: variation.images.map((img) => img.url),
      stock: variation.stock,
      templateId: template.id,
      defaultVariationId: variation.id,
    });
  }
  return products;
}

export async function getNewArrivals(): Promise<Product[]> {
  const templates = await getProductTemplates({
    sort: 'created_at',
    order: 'desc',
    limit: 4,
  });

  const products: Product[] = [];
  for (const template of templates) {
    const variation = template.variations.find((v) => v.is_active);
    if (!variation) continue;
    const mainImage =
      variation.images.find((img) => img.isMain) || variation.images[0];
    products.push({
      id: template.id,
      name: template.name,
      description: template.description || '',
      price: parseFloat(variation.price),
      image: mainImage?.url || '',
      category: template.categories[0]?.name || 'Uncategorized',
          slug: template.slug,
      material: variation.attributes?.material,
      color: variation.attributes?.color,
      images: variation.images.map((img) => img.url),
      stock: variation.stock,
      templateId: template.id,
      defaultVariationId: variation.id,
    });
  }
  return products;
}

const COLOR_HEX: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  brown: '#8b4513',
  natural: '#a0522d',
  silver: '#c0c0c0',
  gray: '#808080',
  grey: '#808080',
  red: '#e11d48',
  blue: '#2563eb',
  green: '#16a34a',
  yellow: '#facc15',
  beige: '#f5f5dc',
};

export async function getFilterOptions(templates: ProductTemplate[]) {
  const categories = new Set<string>();
  const materials = new Set<string>();
  const colors = new Map<string, string>();
  let maxPrice = 0;

  for (const t of templates) {
    for (const c of t.categories || []) {
      if (c?.name) categories.add(c.name);
    }
    for (const v of t.variations || []) {
      if (!v.is_active) continue;
      const price = parseFloat(v.price);
      if (Number.isFinite(price) && price > maxPrice) maxPrice = price;
      const mat = v.attributes?.material;
      if (typeof mat === 'string' && mat.trim()) materials.add(mat);
      const col = v.attributes?.color;
      if (typeof col === 'string' && col.trim()) {
        const key = col.toLowerCase();
        if (!colors.has(col)) {
          colors.set(col, COLOR_HEX[key] ?? key);
        }
      }
    }
  }

  return {
    categories: Array.from(categories).sort(),
    materials: Array.from(materials).sort(),
    colors: Array.from(colors, ([name, hex]) => ({ name, hex })),
    priceRange: { min: 0, max: Math.ceil(maxPrice) },
  };
}
