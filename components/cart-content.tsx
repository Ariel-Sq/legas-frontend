'use client';

import { useCart } from '@/components/cart-provider';
import { CartItemRow } from '@/components/cart-item-row';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatPriceDecimal } from '@/lib/utils';
import {
  LIST_PRICE_MARKUP,
  listPrice,
} from '@/lib/pricing';

export function CartContent() {
  const { items, itemCount, subtotal, loading } = useCart();

  // Skeleton while the cart is still being fetched, so a slow mobile
  // connection doesn't flash "tu carrito está vacío" before the items load.
  if (loading) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="h-9 w-64 rounded bg-muted animate-pulse mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
            <div className="h-56 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">
              Todavía no agregaste productos a tu carrito.
            </p>
            <Button asChild size="lg" className="cursor-pointer">
              <Link href="/shop">Seguir comprando</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Carrito de compras
          </h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu
            carrito
          </p>
        </div>

        {/* Cart Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Continue Shopping Button */}
            <div className="mt-6">
              <Button
                variant="outline"
                asChild
                className="cursor-pointer bg-transparent"
              >
                <Link href="/shop">Seguir comprando</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>

                <p className="text-sm text-foreground">
                  Precio de lista{' '}
                  <span className="font-semibold">
                    {formatPriceDecimal(listPrice(subtotal))}
                  </span>
                </p>
                <p className="text-sm font-semibold text-primary">
                  {formatPriceDecimal(subtotal)} Precio con descuento en
                  efectivo o transferencia
                </p>

                <Separator />

                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <Truck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    El envío se coordina con el vendedor después de la compra.
                  </span>
                </div>

                <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                  Transferencia o efectivo: precio de contado sin recargo. Con
                  MercadoPago: recargo del{' '}
                  {Math.round(LIST_PRICE_MARKUP * 100)}% sobre el precio de contado. Con
                </p>

                <Button size="lg" className="w-full cursor-pointer" asChild>
                  <Link href="/checkout">Ir a pagar</Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Pago seguro procesado por Mercado Pago
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
