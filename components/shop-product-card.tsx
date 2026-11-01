'use client';

import type React from 'react';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/components/wishlist-provider';
import { formatPrice } from '@/lib/utils';

interface ShopProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug?: string;
    category?: string;
    variations?: any[];
    minPrice?: number;
    maxPrice?: number;
    templateId?: string;
  };
}

export function ShopProductCard({ product }: ShopProductCardProps) {
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
        templateId: product.templateId ?? product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category ?? 'Muebles',
      });
    }
  };

  return (
    <div className="group">
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
          {defaultVariationId && (
            <button
              // Always visible: favouriting is a first-class action in the
              // catalogue, not something hidden behind hover.
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer hover:bg-background"
              aria-label={
                inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'
              }
              aria-pressed={inWishlist}
              title={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
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
