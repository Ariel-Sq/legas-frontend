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
  priceTiers: PriceTier[]; // TODO: Implement price tiers in the UI
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
  variations: ProductVariation[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  material?: string;
  color?: string;
  images?: string[];
  fullDescription?: string;
  specifications?: { label: string; value: string }[];
  stock?: number;
  rating?: number;
  reviews?: number;
  templateId?: string; // For wishlist functionality
}

export async function getProductTemplates(): Promise<ProductTemplate[]> {
  const resp = await fetch(`${BACKEND_URL}/api/product-templates`);
  const data: ProductTemplate[] = await resp.json();
  return data;
}

export async function getProductTemplateById(
  id: string
): Promise<ProductTemplate | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const productTemplates = await getProductTemplates();
  return productTemplates.find((template) => template.id === id) || null;
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
          material: variation.attributes?.material,
          color: variation.attributes?.color,
          images: variation.images.map((img) => img.url),
          stock: variation.stock,
          templateId: template.id, // Add template ID for wishlist
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
          templateId: template.id, // Add template ID for wishlist
        });
      }
    }
  }

  return products;
}

export async function getRelatedProducts(
  productId: string,
  category: string
): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const allProducts = await getAllProducts();
  return allProducts
    .filter((p) => p.id !== productId && p.category === category)
    .slice(0, 4);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: '1',
      name: 'Artisan Dining Table',
      description: 'Handcrafted dining table for family gatherings.',
      price: 1250,
      image:
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop',
      category: 'featured',
    },
    {
      id: '2',
      name: 'Rustic Bed Frame',
      description:
        "Comfortable and stylish bed frame for a good night's sleep.",
      price: 980,
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop',
      category: 'featured',
    },
    {
      id: '3',
      name: 'Modern Bookshelf',
      description: 'Elegant bookshelf to organize your collection.',
      price: 650,
      image:
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop',
      category: 'featured',
    },
  ];
}

export async function getNewArrivals(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: '4',
      name: 'Minimalist Coffee Table',
      description: 'Sleek coffee table for modern living rooms.',
      price: 490,
      image:
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=800&fit=crop',
      category: 'new-arrival',
    },
    {
      id: '5',
      name: 'Scandinavian Chair',
      description: 'Comfortable chair with a Scandinavian design.',
      price: 320,
      image:
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop',
      category: 'new-arrival',
    },
    {
      id: '6',
      name: 'Contemporary Desk',
      description: 'Functional desk for home offices.',
      price: 850,
      image:
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop',
      category: 'new-arrival',
    },
    {
      id: '7',
      name: 'Oakwood Sideboard',
      description: 'Spacious and stylish storage solution.',
      price: 1100,
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop',
      category: 'new-arrival',
    },
  ];
}

export async function getFilterOptions(maxPrice: number) {
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    categories: ['Sofas', 'Chairs', 'Tables', 'Beds', 'Storage'],
    materials: ['Oak', 'Maple', 'Walnut', 'Pine'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#8b4513' },
      { name: 'Natural', hex: '#a0522d' },
    ],
    priceRange: { min: 0, max: maxPrice },
  };
}
