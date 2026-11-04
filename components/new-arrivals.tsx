import type { Product } from '@/lib/products';
import { ProductCard } from './product-card';

interface NewArrivalsProps {
  products: Product[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  return (
    <section className="bg-muted/30 py-10 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground">
            Recién llegados
          </h2>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            Directo del taller, pensados para vos.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
