import type { Product } from '@/lib/products';
import { ProductCard } from './product-card';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Productos destacados
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Nuestras piezas más queridas, elegidas por vos.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="featured"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
