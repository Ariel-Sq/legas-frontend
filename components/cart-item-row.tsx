'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart-provider';
import type { CartItem } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (!item.stock || item.quantity < item.stock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex gap-4 py-6 border-b border-border">
      <Link href={`/product/${item.id}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted">
          <Image
            src={item.image || '/placeholder.svg'}
            alt={item.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="flex-grow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-grow">
          <Link href={`/product/${item.id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
              {item.name}
            </h3>
          </Link>
          {item.category && (
            <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
          )}
          <p className="text-lg font-semibold text-primary mt-2">
            {formatPrice(item.price)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="h-10 w-10 cursor-pointer"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncrease}
              disabled={!!item.stock && item.quantity >= item.stock}
              className="h-10 w-10 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-right md:w-24">
          <p className="font-semibold text-lg">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
