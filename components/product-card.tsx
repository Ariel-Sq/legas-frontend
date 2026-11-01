'use client';

import type React from 'react';

import type { Product } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/components/wishlist-provider';
import { formatPrice, getMainDescription } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'featured' | 'compact';
}

export function ProductCard({
  product,
  variant = 'featured',
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = product.defaultVariationId
    ? isInWishlist(product.defaultVariationId)
    : false;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.defaultVariationId) return;
    toggleWishlist({
      productVariationId: product.defaultVariationId,
      templateId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  const href = `/product/${product.slug ?? product.id}`;
  // Cards show only the main copy — the repeated "INFORMACION IMPORTANTE"
  // block stays on the product page, where the visitor opted in by clicking.
  const teaser = getMainDescription(product.description);

  const wishlistButton = (
    <button
      // Always visible: favouriting is a first-class action, not a hover easter egg.
      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer hover:bg-background"
      aria-label={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={inWishlist}
      title={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      onClick={handleWishlistClick}
    >
      <Heart
        className={`h-4 w-4 ${inWishlist ? 'fill-primary text-primary' : ''}`}
      />
    </button>
  );

  if (variant === 'compact') {
    return (
      <div className="group relative flex flex-col gap-3">
        <Link href={href}>
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {teaser}
            </p>
            <p className="mt-2 font-bold text-primary text-xl">
              {formatPrice(product.price)}
            </p>
          </div>
        </Link>
        {wishlistButton}
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-card shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* The whole card opens the product — that is where the rest of the
          description (shipping, tints, care) is read. */}
      <Link href={href} className="flex flex-col flex-grow">
        <div className="relative w-full aspect-square">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground flex-grow line-clamp-3">
            {teaser}
          </p>
          <p className="mt-4 font-bold text-primary text-xl">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
      {wishlistButton}
    </div>
  );
}
