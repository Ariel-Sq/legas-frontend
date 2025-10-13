'use server';

import { BACKEND_URL } from '@/utils/environments';

// Import types from products.ts
import type {
  ProductTemplate,
  ProductVariation,
  ProductImage,
  Category,
} from '@/lib/products';

// Additional types for admin functionality
export interface ProductPriceTier {
  id: string;
  product_variation_id: string;
  min_quantity: number;
  max_quantity?: number;
  price: number;
  created_at: string;
  updated_at: string;
}

// Re-export types for compatibility
export type { ProductTemplate, ProductVariation, ProductImage, Category };

// Admin-specific types for form data
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

// Product Template CRUD operations
export async function createProductTemplate(
  data: ProductTemplateFormData
): Promise<ProductTemplate> {
  const resp = await fetch(`${BACKEND_URL}/api/product-templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    throw new Error('Failed to create product template');
  }

  const newTemplate: ProductTemplate = await resp.json();
  return newTemplate;
}

export async function updateProductTemplate(
  id: string,
  data: Partial<ProductTemplateFormData>
): Promise<ProductTemplate> {
  const resp = await fetch(`${BACKEND_URL}/api/product-templates/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    throw new Error('Failed to update product template');
  }

  const updatedTemplate: ProductTemplate = await resp.json();
  return updatedTemplate;
}

export async function deleteProductTemplate(id: string): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/api/product-templates/${id}`, {
    method: 'DELETE',
  });

  if (!resp.ok) {
    throw new Error('Failed to delete product template');
  }
}

// Product Variation CRUD operations
export async function createProductVariation(
  templateId: string,
  data: ProductVariationFormData
): Promise<ProductVariation> {
  const resp = await fetch(
    `${BACKEND_URL}/api/product-templates/${templateId}/variations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!resp.ok) {
    throw new Error('Failed to create product variation');
  }

  const newVariation: ProductVariation = await resp.json();
  return newVariation;
}

export async function updateProductVariation(
  id: string,
  data: Partial<ProductVariationFormData>
): Promise<ProductVariation> {
  const resp = await fetch(`${BACKEND_URL}/api/product-variations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    throw new Error('Failed to update product variation');
  }

  const updatedVariation: ProductVariation = await resp.json();
  return updatedVariation;
}

export async function deleteProductVariation(id: string): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/api/product-variations/${id}`, {
    method: 'DELETE',
  });

  if (!resp.ok) {
    throw new Error('Failed to delete product variation');
  }
}

// Product Image CRUD operations
export async function createProductImage(
  variationId: string,
  data: ProductImageFormData
): Promise<ProductImage> {
  const resp = await fetch(
    `${BACKEND_URL}/api/product-variations/${variationId}/images`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!resp.ok) {
    throw new Error('Failed to create product image');
  }

  const newImage: ProductImage = await resp.json();
  return newImage;
}

export async function updateProductImage(
  id: string,
  data: Partial<ProductImageFormData>
): Promise<ProductImage> {
  const resp = await fetch(`${BACKEND_URL}/api/product-images/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    throw new Error('Failed to update product image');
  }

  const updatedImage: ProductImage = await resp.json();
  return updatedImage;
}

export async function deleteProductImage(id: string): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/api/product-images/${id}`, {
    method: 'DELETE',
  });

  if (!resp.ok) {
    throw new Error('Failed to delete product image');
  }
}

// Product Price Tier CRUD operations
export async function createProductPriceTier(
  variationId: string,
  data: ProductPriceTierFormData
): Promise<ProductPriceTier> {
  const resp = await fetch(
    `${BACKEND_URL}/api/product-variations/${variationId}/price-tiers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!resp.ok) {
    throw new Error('Failed to create product price tier');
  }

  const newPriceTier: ProductPriceTier = await resp.json();
  return newPriceTier;
}

export async function updateProductPriceTier(
  id: string,
  data: Partial<ProductPriceTierFormData>
): Promise<ProductPriceTier> {
  const resp = await fetch(`${BACKEND_URL}/api/product-price-tiers/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    throw new Error('Failed to update product price tier');
  }

  const updatedPriceTier: ProductPriceTier = await resp.json();
  return updatedPriceTier;
}

export async function deleteProductPriceTier(id: string): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/api/product-price-tiers/${id}`, {
    method: 'DELETE',
  });

  if (!resp.ok) {
    throw new Error('Failed to delete product price tier');
  }
}
