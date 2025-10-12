'use client';

import { useState } from 'react';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { ProductCard } from '@/components/product-card';
import { ProductTemplate, ProductVariation } from '@/lib/data';
import { Star, Truck, Check } from 'lucide-react';
import { AddToCartSection } from '@/components/add-to-cart-section';
import { ProductReviews } from '@/components/product-reviews';

interface ProductDetailClientProps {
  initialTemplate: ProductTemplate;
  initialVariation: ProductVariation;
  initialRelatedProducts: any[];
  initialReviews: any[];
  initialRatingSummary: any;
  initialUser: any;
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

  const images = selectedVariation.images
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => img.url);

  const handleVariationChange = (variationId: string) => {
    const variation = initialTemplate.variations.find(
      (v) => v.id === variationId
    );
    if (variation) {
      setSelectedVariation(variation);
    }
  };

  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery
              images={images}
              productName={selectedVariation.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {initialTemplate.categories[0]?.name || 'Uncategorized'}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {initialTemplate.name}
              </h1>

              {/* Variations Selector */}
              {initialTemplate.variations.length > 1 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Color
                  </h3>
                  <div className="flex gap-2">
                    {initialTemplate.variations
                      .filter((v) => v.is_active)
                      .map((variation) => (
                        <button
                          key={variation.id}
                          onClick={() => handleVariationChange(variation.id)}
                          className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                            selectedVariation.id === variation.id
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          style={{
                            backgroundColor:
                              variation.attributes?.color === 'red'
                                ? '#dc2626'
                                : variation.attributes?.color === 'white'
                                  ? '#ffffff'
                                  : variation.attributes?.color === 'black'
                                    ? '#000000'
                                    : '#6b7280',
                          }}
                          title={`${variation.attributes?.color} - $${parseFloat(variation.price).toFixed(2)}`}
                        >
                          {selectedVariation.id === variation.id && (
                            <Check
                              className={`w-4 h-4 absolute inset-0 m-auto ${
                                variation.attributes?.color === 'white'
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {selectedVariation.attributes?.color} - Stock:{' '}
                    {selectedVariation.stock}
                  </p>
                </div>
              )}

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
                ${parseFloat(selectedVariation.price).toFixed(2)}
              </p>
            </div>

            <div className="border-t border-b py-6 space-y-4">
              <p className="text-foreground leading-relaxed">
                {initialTemplate.description || 'Descripción del producto'}
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
                id: Number(selectedVariation.id),
                name: selectedVariation.name,
                price: parseFloat(selectedVariation.price),
                image:
                  selectedVariation.images.find((img) => img.isMain)?.url ||
                  selectedVariation.images[0]?.url ||
                  '',
                category:
                  initialTemplate.categories[0]?.name || 'Uncategorized',
                stock: selectedVariation.stock,
              }}
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
                    ([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">{key}:</dt>
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
