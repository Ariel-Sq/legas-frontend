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
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  url: string;
  path: string | null;
  isMain: boolean;
  sortOrder: number;
  altText: string | null;
  variation_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariation {
  id: string;
  template_id: string;
  sku: string;
  name: string;
  price: string; // Backend returns as string
  stock: number;
  attributes: Record<string, any>;
  is_active: boolean;
  sort_order: number;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}

// Legacy interface for backward compatibility
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
}

// Mock categories
const mockCategories: Category[] = [
  {
    id: 'fc87140c-eee4-4d9c-883d-d7643f5940ed',
    name: 'B',
    slug: 'b',
    description: null,
    parentId: null,
    level: 1,
    image: null,
    icon: null,
    is_active: true,
    sort_order: 0,
    meta_title: null,
    meta_description: null,
    created_at: '2025-10-06T00:44:06.192Z',
    updated_at: '2025-10-06T00:44:06.192Z',
  },
  {
    id: '7d6c7e50-635f-4c0e-8ea7-b278295e5766',
    name: 'A-3',
    slug: 'a-3',
    description: null,
    parentId: 'ecbe29e1-13a8-4275-88e0-4ef45a1ecbbd',
    level: 3,
    image: null,
    icon: null,
    is_active: true,
    sort_order: 0,
    meta_title: null,
    meta_description: null,
    created_at: '2025-10-06T00:45:06.635Z',
    updated_at: '2025-10-06T00:45:06.635Z',
  },
];

// Mock product templates with variations
const mockProductTemplates: ProductTemplate[] = [
  {
    id: '604cad7c-d7a9-42d0-a905-682f700d78a3',
    name: 'Modern Sofa Collection',
    slug: 'modern-sofa-collection',
    description:
      'Elegant and comfortable sofa perfect for modern living spaces. Available in multiple colors and configurations.',
    specifications: {
      height: '75cm',
      width: '220cm',
      depth: '95cm',
      material: 'Premium fabric upholstery',
      weight: '45kg',
    },
    categories: mockCategories,
    is_active: true,
    variations: [
      {
        id: '96c0f08d-b769-44f6-8e89-fbcdf7113d00',
        template_id: '604cad7c-d7a9-42d0-a905-682f700d78a3',
        sku: 'SOFA-RED-001',
        name: 'Modern Sofa - Red',
        price: '899.00',
        stock: 5,
        attributes: {
          color: 'red',
          size: 'standard',
        },
        is_active: true,
        sort_order: 1,
        images: [
          {
            id: '6ef23d29-abb4-41fc-a378-3b43cb006219',
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
            path: 'products/96c0f08d-b769-44f6-8e89-fbcdf7113d00/1759713296754_ggduqwc5hcp.jpg',
            isMain: true,
            sortOrder: 1,
            altText: 'Modern Sofa in Red',
            variation_id: '96c0f08d-b769-44f6-8e89-fbcdf7113d00',
            createdAt: '2025-10-06T01:14:58.255Z',
            updatedAt: '2025-10-06T01:14:58.255Z',
          },
          {
            id: '4b846e3e-4009-4f10-bb36-a943bdd2ce7e',
            url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
            path: 'products/96c0f08d-b769-44f6-8e89-fbcdf7113d00/1759712790384_9z4w7lfq8vk.webp',
            isMain: false,
            sortOrder: 2,
            altText: 'Red Sofa Detail View',
            variation_id: '96c0f08d-b769-44f6-8e89-fbcdf7113d00',
            createdAt: '2025-10-06T01:06:31.881Z',
            updatedAt: '2025-10-06T01:14:56.769Z',
          },
        ],
        created_at: '2025-10-06T01:06:29.304Z',
        updated_at: '2025-10-06T01:06:29.304Z',
      },
      {
        id: '536ea89e-5cf4-4073-87ba-8de58ae47c25',
        template_id: '604cad7c-d7a9-42d0-a905-682f700d78a3',
        sku: 'SOFA-WHITE-001',
        name: 'Modern Sofa - White',
        price: '899.00',
        stock: 8,
        attributes: {
          color: 'white',
          size: 'standard',
        },
        is_active: true,
        sort_order: 2,
        images: [
          {
            id: 'deb67ee7-a2a0-407c-b9e5-3095b06bcb20',
            url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop',
            path: 'products/536ea89e-5cf4-4073-87ba-8de58ae47c25/1759712921625_texzjim9yuq.webp',
            isMain: false,
            sortOrder: 2,
            altText: 'White Sofa Detail View',
            variation_id: '536ea89e-5cf4-4073-87ba-8de58ae47c25',
            createdAt: '2025-10-06T01:08:42.320Z',
            updatedAt: '2025-10-06T01:08:42.320Z',
          },
          {
            id: '12e26191-2fd4-42e5-b83d-88f2bb0eeeca',
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
            path: 'products/536ea89e-5cf4-4073-87ba-8de58ae47c25/1759712920467_trgudln2oo.webp',
            isMain: true,
            sortOrder: 1,
            altText: 'Modern Sofa in White',
            variation_id: '536ea89e-5cf4-4073-87ba-8de58ae47c25',
            createdAt: '2025-10-06T01:08:41.195Z',
            updatedAt: '2025-10-06T01:08:41.195Z',
          },
        ],
        created_at: '2025-10-06T01:08:39.419Z',
        updated_at: '2025-10-06T01:08:39.419Z',
      },
      {
        id: '7c4f2a8e-9d1b-4e5f-8a2c-6b9f3d7e5a1c',
        template_id: '604cad7c-d7a9-42d0-a905-682f700d78a3',
        sku: 'SOFA-BLACK-001',
        name: 'Modern Sofa - Black',
        price: '949.00',
        stock: 3,
        attributes: {
          color: 'black',
          size: 'standard',
        },
        is_active: true,
        sort_order: 3,
        images: [
          {
            id: '8d5e6f7g-4h3i-2j1k-9l8m-7n6o5p4q3r2s',
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
            path: 'products/7c4f2a8e-9d1b-4e5f-8a2c-6b9f3d7e5a1c/main.jpg',
            isMain: true,
            sortOrder: 1,
            altText: 'Modern Sofa in Black',
            variation_id: '7c4f2a8e-9d1b-4e5f-8a2c-6b9f3d7e5a1c',
            createdAt: '2025-10-06T01:10:00.000Z',
            updatedAt: '2025-10-06T01:10:00.000Z',
          },
        ],
        created_at: '2025-10-06T01:10:00.000Z',
        updated_at: '2025-10-06T01:10:00.000Z',
      },
    ],
    created_at: '2025-10-06T00:57:14.097Z',
    updated_at: '2025-10-06T00:57:14.097Z',
  },
];

export async function getServerData() {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    message: 'Hola, desde el servidor',
    timestamp: new Date().toISOString(),
  };
}

export async function getProductTemplates(): Promise<ProductTemplate[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProductTemplates;
}

export async function getProductTemplateById(
  id: string
): Promise<ProductTemplate | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProductTemplates.find((template) => template.id === id) || null;
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

export async function getShopProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Flatten variations from templates into products
  const products: Product[] = [];
  for (const template of mockProductTemplates) {
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

export async function getFilterOptions() {
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
    priceRange: { min: 0, max: 2000 },
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // First try to find as variation id
  for (const template of mockProductTemplates) {
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

  // Flatten variations from templates into products
  const products: Product[] = [];
  for (const template of mockProductTemplates) {
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
