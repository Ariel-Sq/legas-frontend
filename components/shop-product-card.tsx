'use client';

import type React from 'react';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useWishlist } from '@/components/wishlist-provider';
import { formatPrice } from '@/lib/utils';

interface ShopProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug?: string;
    variations?: any[];
    minPrice?: number;
    maxPrice?: number;
    templateId?: string;
  };
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const defaultVariationId = product.variations?.[0]?.id;
  const inWishlist = defaultVariationId
    ? isInWishlist(defaultVariationId)
    : false;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultVariationId) {
      toggleWishlist({
        productVariationId: defaultVariationId,
        templateId: product.templateId ?? undefined,
        name: product.name,
        price: product.price,
        image: product.image,
        category: 'Muebles',
      });
    }
  };

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug ?? product.id}`}>
        <div className="relative overflow-hidden rounded-lg">
          <div className="relative w-full aspect-square bg-muted rounded-lg">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {product.templateId && (
            <button
              // Always visible on touch (no hover); reveal on hover on desktop.
              className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center transition-opacity cursor-pointer hover:bg-background opacity-100 lg:opacity-0 ${
                isHovered ? 'lg:opacity-100' : ''
              }`}
              aria-label={
                inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'
              }
              aria-pressed={inWishlist}
              onClick={handleWishlistClick}
            >
              <Heart
                className={`h-4 w-4 ${inWishlist ? 'fill-primary text-primary' : ''}`}
              />
            </button>
          )}
        </div>
        <div className="mt-2">
          <p className="text-base font-medium">{product.name}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {formatPrice(product.price)}
            </p>
            {product.variations && product.variations.length > 1 && (
              <span className="text-xs text-muted-foreground">
                {product.variations.length} opciones
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
