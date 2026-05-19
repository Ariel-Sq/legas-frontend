'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, MessageCircle, Package, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Order } from '@/lib/orders-shared';
import { whatsappOrderUrl } from '@/lib/whatsapp';

interface OrderConfirmationClientProps {
  order: Order;
}

export function OrderConfirmationClient({
  order,
}: OrderConfirmationClientProps) {
  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Success Message */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            ¡Pedido confirmado!
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Gracias por tu compra
          </p>
          <p className="text-sm text-muted-foreground">
            Número de pedido:{' '}
            <span className="font-semibold text-foreground">
              {order.orderNumber}
            </span>
          </p>
        </div>

        <div className="mx-auto max-w-4xl grid gap-8 lg:grid-cols-3">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos del pedido
                </h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${(item.price * item.quantity).toFixed(2)} total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Información de envío
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Nombre:</span>{' '}
                    {order.shipping.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    {order.shipping.email}
                  </p>
                  <p>
                    <span className="font-medium">Teléfono:</span>{' '}
                    {order.shipping.phone}
                  </p>
                  <Separator className="my-3" />
                  <p>
                    <span className="font-medium">Dirección:</span>{' '}
                    {order.shipping.address}
                  </p>
                  <p>
                    {order.shipping.city}, {order.shipping.postalCode}
                  </p>
                  <p>{order.shipping.country}</p>
                  <Separator className="my-3" />
                  <p>
                    <span className="font-medium">Método de envío:</span>{' '}
                    {order.shipping.method === 'express'
                      ? 'Envío express'
                      : 'Envío estándar'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Next Steps */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span>
                      {order.shippingCost === 0
                        ? 'Gratis'
                        : `$${order.shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">¿Qué sigue?</h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Te enviamos un email de confirmación a{' '}
                    <span className="font-medium text-foreground">
                      {order.shipping.email}
                    </span>
                  </p>
                  <p>Procesamos tu pedido en 1 o 2 días hábiles.</p>
                  <p>
                    Entrega estimada:{' '}
                    <span className="font-medium text-foreground">
                      {order.shipping.method === 'express'
                        ? '2 a 3 días hábiles'
                        : '5 a 7 días hábiles'}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-[#25D366] text-white hover:bg-[#25D366]/90"
                size="lg"
              >
                <a
                  href={whatsappOrderUrl(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Coordinar por WhatsApp
                </a>
              </Button>
              <Button asChild className="w-full" size="lg" variant="outline">
                <Link href="/shop">
                  Seguir comprando
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
