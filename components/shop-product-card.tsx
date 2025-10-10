'use client';

import type React from 'react';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useWishlist } from '@/components/wishlist-provider';

interface ShopProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(Number(product.id));

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      category: 'Furniture',
    });
  };

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg">
          <div className="relative w-full aspect-square bg-muted rounded-lg">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <button
            className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center transition-opacity cursor-pointer hover:bg-background ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Add to wishlist"
            onClick={handleWishlistClick}
          >
            <Heart
              className={`h-4 w-4 ${inWishlist ? 'fill-primary text-primary' : ''}`}
            />
          </button>
          <button
            className={`absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-sm font-bold py-2 transition-transform duration-300 cursor-pointer hover:bg-primary ${
              isHovered ? 'translate-y-0' : 'translate-y-full'
            }`}
            onClick={(e) => {
              e.preventDefault();
              // Navigate to product page (Link handles this)
            }}
          >
            Quick View
          </button>
        </div>
        <div className="mt-2">
          <p className="text-base font-medium">{product.name}</p>
          <p className="text-sm font-medium text-muted-foreground">
            ${product.price}
          </p>
        </div>
      </Link>
    </div>
  );
}
