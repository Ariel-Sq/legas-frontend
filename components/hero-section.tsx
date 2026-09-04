'use client';

import Link from 'next/link';
import type { Product } from '@/lib/products';

interface HeroSectionProps {
  featuredProduct?: Product;
}

export function HeroSection({ featuredProduct }: HeroSectionProps) {
  const linkHref = featuredProduct
    ? `/product/${featuredProduct.slug ?? featuredProduct.templateId ?? featuredProduct.id}`
    : '/shop';
  const imageUrl =
    featuredProduct?.image ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=900&fit=crop';
  const caption = featuredProduct?.name ?? 'Hecho para tu comodidad';

  return (
    <section className="bg-primary/20 py-12 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight text-balance">
            Muebles de Madera Artesanales
          </h1>
          <p className="mt-4 max-w-xl mx-auto md:mx-0 text-lg text-muted-foreground text-pretty">
            Descubrí piezas atemporales que aportan calidez y elegancia a tu
            hogar
          </p>
          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <Link
              href="/shop"
              className="inline-block bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all shadow-lg"
            >
              Ver Colección
            </Link>
            <Link
              href="/about"
              className="inline-block bg-card text-card-foreground font-bold py-3 px-8 rounded-lg hover:bg-muted/50 transition-all border border-border"
            >
              Saber Más
            </Link>
          </div>
        </div>
        <Link href={linkHref} className="block group cursor-pointer">
          <div className="relative h-64 md:h-auto md:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-shadow duration-300">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url('${imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="text-white text-2xl font-bold tracking-tight">
                {caption}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
