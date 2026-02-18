'use client';

import { useState, useMemo } from 'react';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { ProductCard } from '@/components/product-card';
import { AddToCartSection } from '@/components/add-to-cart-section';
import { ProductReviews } from '@/components/product-reviews';
import { Star, Truck } from 'lucide-react';
import type {
  ProductTemplate,
  ProductVariation,
  Product,
} from '@/lib/products';
import type { Review, ProductRatingSummary } from '@/lib/reviews';

interface ProductUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface ProductDetailClientProps {
  initialTemplate: ProductTemplate;
  initialVariation: ProductVariation;
  initialRelatedProducts: Product[];
  initialReviews: Review[];
  initialRatingSummary: ProductRatingSummary | null;
  initialUser: ProductUser | null;
}

export function ProductDetailClient({
  initialTemplate,
  initialVariation,
  initialRelatedProducts,
  initialReviews,
  initialRatingSummary,
  initialUser,
}: ProductDetailClientProps) {
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation>(initialVariation);

  // Group variations by attribute type
  const colorVariations = initialTemplate.variations.filter(
    (v) => v.attributes?.color && v.is_active
  );

  const handleVariationChange = (variation: ProductVariation) => {
    setSelectedVariation(variation);
  };

  // Get images for selected variation
  const variationImages = useMemo(
    () =>
      selectedVariation.images
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((img) => img.url),
    [selectedVariation.images]
  );

  // Convert variation to product format for compatibility
  const selectedProduct = useMemo(
    (): Product => ({
      id: selectedVariation.id,
      name: selectedVariation.name,
      description: initialTemplate.description || '',
      price: parseFloat(selectedVariation.price),
      image:
        selectedVariation.images.find((img) => img.isMain)?.url ||
        selectedVariation.images[0]?.url ||
        '',
      category: initialTemplate.categories[0]?.name || 'Uncategorized',
      material: selectedVariation.attributes?.material,
      color: selectedVariation.attributes?.color,
      images: variationImages,
      fullDescription: initialTemplate.description || '',
      specifications: Object.entries(initialTemplate.specifications || {}).map(
        ([label, value]) => ({
          label,
          value: String(value),
        })
      ),
      stock: selectedVariation.stock,
      rating: 4.5, // Mock rating
      reviews: 10, // Mock reviews
    }),
    [selectedVariation, initialTemplate, variationImages]
  );

  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery
              images={variationImages}
              productName={selectedVariation.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {initialTemplate.categories
                  .sort((a, b) => a.level - b.level)
                  .map((cat) => cat.name)
                  .join(' > ')}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {selectedVariation.name}
              </h1>

              {/* Rating */}
              {initialRatingSummary ? (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(initialRatingSummary.averageRating)
                            ? 'fill-primary text-primary'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {initialRatingSummary.averageRating.toFixed(1)} (
                    {initialRatingSummary.totalReviews} reseñas)
                  </span>
                </div>
              ) : null}

              <p className="text-4xl font-bold text-primary mb-6">
                ${selectedVariation.price}
              </p>
            </div>

            {/* Color Selection */}
            {colorVariations.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Color:</label>
                <div className="flex gap-2">
                  {colorVariations.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => handleVariationChange(variation)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                        selectedVariation.id === variation.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      {variation.attributes?.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-b py-6 space-y-4">
              <p className="text-foreground leading-relaxed">
                {initialTemplate.description || selectedVariation.name}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    selectedVariation.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {selectedVariation.stock > 0
                    ? `${selectedVariation.stock} in stock`
                    : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <AddToCartSection
              product={{
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                image: selectedProduct.image,
                category: selectedProduct.category,
                stock: selectedProduct.stock,
              }}
              wishlistId={Number(initialTemplate.id)}
              key={selectedProduct.id}
            />

            {/* Shipping Info */}
            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-sm text-muted-foreground">
                  On orders over $500. Delivery in 5-7 business days.
                </p>
              </div>
            </div>

            {/* Specifications */}
            {Object.keys(initialTemplate.specifications || {}).length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <dl className="space-y-3">
                  {Object.entries(initialTemplate.specifications || {}).map(
                    ([label, value]) => (
                      <div key={label} className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">{label}:</dt>
                        <dd className="font-medium text-foreground">
                          {String(value)}
                        </dd>
                      </div>
                    )
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        <div className="mb-16">
          <ProductReviews
            productId={selectedVariation.id}
            reviews={initialReviews}
            ratingSummary={initialRatingSummary}
            userId={initialUser?.id}
          />
        </div>

        {/* Related Products */}
        {initialRelatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {initialRelatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
