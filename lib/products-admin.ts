// Product Template Types (matching database schema)
export interface ProductTemplate {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: number;
  brand?: string;
  specifications?: Record<string, any>; // JSONB
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: number;
  product_template_id: number;
  sku: string;
  name: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  attributes?: Record<string, any>; // JSONB - e.g., {color: "red", size: "M"}
  weight?: number;
  dimensions?: Record<string, any>; // JSONB - e.g., {length: 10, width: 5, height: 3}
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_variation_id: number;
  image_url: string;
  alt_text?: string;
  title?: string;
  sort_order: number;
  is_main: boolean;
  created_at: string;
}

export interface ProductPriceTier {
  id: number;
  product_variation_id: number;
  min_quantity: number;
  max_quantity?: number;
  price: number;
  created_at: string;
  updated_at: string;
}

// Form data types for creating products
export interface ProductTemplateFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: number;
  brand?: string;
  specifications?: Record<string, any>;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_active: boolean;
}

export interface ProductVariationFormData {
  sku: string;
  name: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  attributes?: Record<string, any>;
  weight?: number;
  dimensions?: Record<string, any>;
  is_active: boolean;
}

export interface ProductImageFormData {
  image_url: string;
  alt_text?: string;
  title?: string;
  sort_order: number;
  is_main: boolean;
}

export interface ProductPriceTierFormData {
  min_quantity: number;
  max_quantity?: number;
  price: number;
}

// TODO: Connect to real API
export async function createProductTemplate(
  data: ProductTemplateFormData
): Promise<ProductTemplate> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const template: ProductTemplate = {
    id: Date.now(),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // TODO: Save to database via API
  console.log('[v0] Creating product template:', template);

  return template;
}

export async function createProductVariation(
  templateId: number,
  data: ProductVariationFormData
): Promise<ProductVariation> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const variation: ProductVariation = {
    id: Date.now(),
    product_template_id: templateId,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('[v0] Creating product variation:', variation);

  return variation;
}

export async function createProductImage(
  variationId: number,
  data: ProductImageFormData
): Promise<ProductImage> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const image: ProductImage = {
    id: Date.now(),
    product_variation_id: variationId,
    ...data,
    created_at: new Date().toISOString(),
  };

  console.log('[v0] Creating product image:', image);

  return image;
}

export async function createProductPriceTier(
  variationId: number,
  data: ProductPriceTierFormData
): Promise<ProductPriceTier> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const priceTier: ProductPriceTier = {
    id: Date.now(),
    product_variation_id: variationId,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('[v0] Creating price tier:', priceTier);

  return priceTier;
}

// Mock categories for now
export async function getCategories() {
  return [
    { id: 1, name: 'Sofas' },
    { id: 2, name: 'Chairs' },
    { id: 3, name: 'Tables' },
    { id: 4, name: 'Beds' },
    { id: 5, name: 'Storage' },
  ];
}
