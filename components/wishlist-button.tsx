'use client';

import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/components/wishlist-provider';
import Link from 'next/link';

export function WishlistButton() {
  const { itemCount } = useWishlist();

  return (
    <Link
      href="/wishlist"
      aria-label="Favoritos"
      className="relative p-2 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <Heart className="h-5 w-5" aria-hidden="true" />
      {itemCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
          {itemCount}
        </Badge>
      )}
    </Link>
  );
}
