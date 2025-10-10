'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getOrderById, type Order } from '@/lib/orders';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        router.push('/shop');
        return;
      }

      const orderData = await getOrderById(orderId);

      if (!orderData) {
        router.push('/shop');
        return;
      }

      setOrder(orderData);
      setLoading(false);
    }

    loadOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Success Message */}
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Thank you for your purchase
            </p>
            <p className="text-sm text-muted-foreground">
              Order Number:{' '}
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
                    Order Items
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
                            Quantity: {item.quantity}
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
                    Shipping Information
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{' '}
                      {order.shipping.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {order.shipping.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{' '}
                      {order.shipping.phone}
                    </p>
                    <Separator className="my-3" />
                    <p>
                      <span className="font-medium">Address:</span>{' '}
                      {order.shipping.address}
                    </p>
                    <p>
                      {order.shipping.city}, {order.shipping.postalCode}
                    </p>
                    <p>{order.shipping.country}</p>
                    <Separator className="my-3" />
                    <p>
                      <span className="font-medium">Shipping Method:</span>{' '}
                      {order.shipping.method === 'express'
                        ? 'Express Shipping'
                        : 'Standard Shipping'}
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
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {order.shippingCost === 0
                          ? 'Free'
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
                  <h2 className="text-lg font-semibold mb-3">What's Next?</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      We've sent a confirmation email to{' '}
                      <span className="font-medium text-foreground">
                        {order.shipping.email}
                      </span>
                    </p>
                    <p>
                      Your order will be processed within 1-2 business days.
                    </p>
                    <p>
                      Estimated delivery:{' '}
                      <span className="font-medium text-foreground">
                        {order.shipping.method === 'express'
                          ? '2-3 business days'
                          : '5-7 business days'}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/shop">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
