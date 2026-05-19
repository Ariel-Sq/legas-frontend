'use client';

import type React from 'react';

import type { Product } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '@/components/wishlist-provider';

interface ProductCardProps {
  product: Product;
  variant?: 'featured' | 'compact';
}

export function ProductCard({
  product,
  variant = 'featured',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
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

  if (variant === 'compact') {
    return (
      <div
        className="group flex flex-col gap-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`}>
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center transition-opacity cursor-pointer hover:bg-background ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              aria-label="Agregar a favoritos"
              onClick={handleWishlistClick}
            >
              <Heart
                className={`h-4 w-4 ${inWishlist ? 'fill-primary text-primary' : ''}`}
              />
            </button>
          </div>
        </Link>
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <p className="mt-2 font-bold text-primary text-xl">
            ${product.price}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group flex flex-col gap-4 rounded-xl overflow-hidden bg-card shadow-md hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full aspect-square">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center transition-opacity cursor-pointer hover:bg-background ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Agregar a favoritos"
            onClick={handleWishlistClick}
          >
            <Heart
              className={`h-4 w-4 ${inWishlist ? 'fill-primary text-primary' : ''}`}
            />
          </button>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-card-foreground">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground flex-grow">
          {product.description}
        </p>
        <p className="mt-4 font-bold text-primary text-xl">${product.price}</p>
      </div>
    </div>
  );
}
