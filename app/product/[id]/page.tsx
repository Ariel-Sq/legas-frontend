import { ProductImageGallery } from '@/components/product-image-gallery';
import { ProductCard } from '@/components/product-card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getProductById, getRelatedProducts } from '@/lib/data';
import { Star, Truck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AddToCartSection } from '@/components/add-to-cart-section';
import { ProductReviews } from '@/components/product-reviews';
import { getProductReviews, getProductRatingSummary } from '@/lib/reviews';
import { getCurrentUser } from '@/lib/user';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category
  );
  const images = product.images || [product.image];

  const reviews = await getProductReviews(id);
  const ratingSummary = await getProductRatingSummary(id);
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Product Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image Gallery */}
            <div>
              <ProductImageGallery images={images} productName={product.name} />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                {ratingSummary ? (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(ratingSummary.averageRating)
                              ? 'fill-primary text-primary'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {ratingSummary.averageRating.toFixed(1)} (
                      {ratingSummary.totalReviews} reseñas)
                    </span>
                  </div>
                ) : product.rating ? (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating!)
                              ? 'fill-primary text-primary'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                ) : null}

                <p className="text-4xl font-bold text-primary mb-6">
                  ${product.price}
                </p>
              </div>

              <div className="border-t border-b py-6 space-y-4">
                <p className="text-foreground leading-relaxed">
                  {product.fullDescription || product.description}
                </p>

                {/* Stock Status */}
                {product.stock !== undefined && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <AddToCartSection
                product={{
                  id: Number(product.id),
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                  stock: product.stock,
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
              {product.specifications && product.specifications.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                  <dl className="space-y-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">{spec.label}:</dt>
                        <dd className="font-medium text-foreground">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          <div className="mb-16">
            <ProductReviews
              productId={id}
              reviews={reviews}
              ratingSummary={ratingSummary}
              userId={user?.id}
            />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
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
      <Footer />
    </div>
  );
}
