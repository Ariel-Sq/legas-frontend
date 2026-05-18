'use client';

import { useCart } from '@/components/cart-provider';
import { CartItemRow } from '@/components/cart-item-row';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartContent() {
  const { items, itemCount, subtotal } = useCart();

  const shippingCost = subtotal > 0 ? (subtotal >= 500 ? 0 : 50) : 0;
  const finalTotal = subtotal + shippingCost;

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Carrito de compras</h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito
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
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                {subtotal > 0 && subtotal < 500 && (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    Agregá ${(500 - subtotal).toFixed(2)} más para que tu envío sea
                    gratis.
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>

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
