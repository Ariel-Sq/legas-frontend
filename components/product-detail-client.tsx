'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { formatPrice, formatPriceDecimal } from '@/lib/utils';
import {
  listPrice,
} from '@/lib/pricing';

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
  const [quantity, setQuantity] = useState(1);

  // Always land at the top when opening a product (and when switching from
  // one product to another, which reuses this component instead of remounting).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [initialTemplate.id]);

  const activeVariations = initialTemplate.variations.filter(
    (v) => v.is_active
  );

  const activeTiers = (selectedVariation.priceTiers ?? [])
    .filter((t) => t.is_active)
    .sort((a, b) => a.min_quantity - b.min_quantity);

  const basePrice = parseFloat(selectedVariation.price);
  const matchedTier = [...activeTiers]
    .reverse()
    .find(
      (t) =>
        quantity >= t.min_quantity &&
        (t.max_quantity == null || quantity <= t.max_quantity)
    );
  const unitPrice = matchedTier ? parseFloat(matchedTier.price) : basePrice;
  const lineTotal = unitPrice * quantity;

  // Pick attribute keys whose values differ across variations — these are what
  // the buyer needs to choose between. e.g. two t-shirts both color=white but
  // sizes M/L → label by size; two laptops both ram=16GB but colors differ →
  // label by color. Stable order: by first appearance.
  const distinguishingKeys = (() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const v of activeVariations) {
      for (const k of Object.keys(v.attributes || {})) {
        if (!seen.has(k)) {
          seen.add(k);
          ordered.push(k);
        }
      }
    }
    return ordered.filter((k) => {
      const values = new Set(activeVariations.map((v) => v.attributes?.[k]));
      return values.size > 1;
    });
  })();

  const labelForVariation = (v: ProductVariation) =>
    distinguishingKeys
      .map((k) => v.attributes?.[k])
      .filter((val) => val !== undefined && val !== null && val !== '')
      .join(' · ');

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
                {initialTemplate.name}
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

              <div className="mb-6">
                <p className="text-4xl font-bold text-primary">
                  {formatPrice(unitPrice)}
                </p>
                <p className="mt-0.5 text-base text-muted-foreground">
                  Precio con descuento en efectivo o transferencia
                </p>
                <p className="mt-1 text-lg text-primary font-semibold">
                  {formatPriceDecimal(unitPrice)}
                </p>
                <p className="mt-0.5 text-sm text-foreground">
                  Precio de lista{' '}
                  {formatPriceDecimal(listPrice(unitPrice))}
                </p>
                {quantity > 1 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {quantity} × {formatPrice(unitPrice)} ={' '}
                    <span className="font-semibold text-foreground">
                      {formatPrice(lineTotal)}
                    </span>
                    {matchedTier && (
                      <span className="ml-2 text-primary">
                        (ahorrás{' '}
                        {formatPrice((basePrice - unitPrice) * quantity)})
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Volume Pricing */}
            {activeTiers.length > 0 && (
              <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-semibold">Descuento por cantidad</p>
                <ul className="space-y-1 text-sm">
                  {(() => {
                    const rows: {
                      key: string;
                      label: string;
                      price: number;
                      isActive: boolean;
                    }[] = [
                      {
                        key: 'base',
                        label: `1–${activeTiers[0].min_quantity - 1}`,
                        price: basePrice,
                        isActive: !matchedTier,
                      },
                      ...activeTiers.map((t) => ({
                        key: `${t.min_quantity}-${t.max_quantity ?? '∞'}`,
                        label: `${t.min_quantity}${t.max_quantity ? `–${t.max_quantity}` : '+'}`,
                        price: parseFloat(t.price),
                        isActive: matchedTier?.min_quantity === t.min_quantity,
                      })),
                    ];
                    return rows.map((row) => (
                      <li
                        key={row.key}
                        className={`flex justify-between rounded px-2 py-0.5 ${
                          row.isActive
                            ? 'bg-primary/15 font-semibold text-primary'
                            : ''
                        }`}
                      >
                        <span>{row.label}</span>
                        <span
                          className={row.key === 'base' ? '' : 'text-primary'}
                        >
                          {formatPrice(row.price)} / unidad
                        </span>
                      </li>
                    ));
                  })()}
                </ul>
              </div>
            )}

            {/* Variation Selection */}
            {activeVariations.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium capitalize">
                  {distinguishingKeys.length > 0
                    ? `${distinguishingKeys.join(' / ')}:`
                    : 'Opciones:'}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {activeVariations.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => handleVariationChange(variation)}
                      aria-pressed={selectedVariation.id === variation.id}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors capitalize ${
                        selectedVariation.id === variation.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      {labelForVariation(variation) || variation.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-b py-6 space-y-4">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {initialTemplate.description || selectedVariation.name}
              </p>

              {/* Availability — made-to-order, so no misleading "N en stock". */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    selectedVariation.stock > 0
                      ? 'bg-green-500'
                      : 'bg-amber-500'
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {selectedVariation.stock > 0
                    ? 'Disponible — fabricación y entrega a coordinar por WhatsApp'
                    : 'Se fabrica a pedido — consultanos el plazo por WhatsApp'}
                </span>
              </div>

              {/* Buyer-confidence line: legal rights, always visible. */}
              <p className="text-xs text-muted-foreground">
                Garantía de 6 meses · 10 días de arrepentimiento sin costo.
              </p>
            </div>

            {/* Quantity Selector */}
            <AddToCartSection
              product={{
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: unitPrice,
                image: selectedProduct.image,
                category: selectedProduct.category,
                stock: selectedProduct.stock,
              }}
              wishlistId={initialTemplate.id}
              wishlistVariationId={selectedVariation.id}
              quantity={quantity}
              onQuantityChange={setQuantity}
              key={selectedProduct.id}
            />

            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Envío</p>
                <p className="text-sm text-muted-foreground">
                  Se coordina con el vendedor después de la compra.
                </p>
              </div>
            </div>

            {/* Specifications */}
            {Object.keys(initialTemplate.specifications || {}).length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Especificaciones</h2>
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
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
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
