'use client';

import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart-provider';
import Link from 'next/link';

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="Carrito"
      className="relative p-2 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      {itemCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
          suppressHydrationWarning
        >
          {itemCount}
        </Badge>
      )}
    </Link>
  );
}
