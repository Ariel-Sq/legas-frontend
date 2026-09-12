'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  getStatusIcon,
  type Order,
  type OrderStatus,
} from '@/lib/orders-shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatPrice } from '@/lib/utils';
import { whatsappOrderUrl } from '@/lib/whatsapp';

interface OrderDetailClientProps {
  order: Order;
}

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'processing_payment', label: 'Procesando pago' },
  { status: 'paid_preparing', label: 'Preparando' },
  { status: 'paid_ready_to_ship', label: 'Listo para enviar' },
  { status: 'paid_shipped', label: 'En camino' },
  { status: 'paid_delivered', label: 'Entregado' },
];

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const hideTimeline =
    order.status === 'cancelled' ||
    order.status === 'refunded' ||
    order.status === 'expired' ||
    order.status === 'pending_transfer' ||
    order.status === 'processing_payment';
  const currentIndex = TIMELINE_STEPS.findIndex(
    (s) => s.status === order.status
  );

  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis pedidos
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Pedido #{order.orderNumber}
            </h1>
            <Badge variant="outline" className={STATUS_COLOR[order.status]}>
              <span className="flex items-center gap-1">
                {getStatusIcon(order.status)}
                {STATUS_LABEL[order.status]}
              </span>
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Realizado el{' '}
            {new Date(order.date).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {!hideTimeline && (
          <Card className="mb-8">
            <CardContent className="py-6">
              <ol className="flex items-start justify-between gap-2">
                {TIMELINE_STEPS.map((step, index) => {
                  const isDone = index < currentIndex;
                  const isCurrent = index === currentIndex;
                  return (
                    <li
                      key={step.status}
                      className="flex-1 flex flex-col items-center text-center"
                    >
                      <div className="flex items-center w-full">
                        <div
                          className={cn(
                            'h-0.5 flex-1',
                            index === 0
                              ? 'bg-transparent'
                              : isDone || isCurrent
                                ? 'bg-primary'
                                : 'bg-muted'
                          )}
                        />
                        <div
                          className={cn(
                            'h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold shrink-0',
                            isDone &&
                              'bg-primary border-primary text-primary-foreground',
                            isCurrent &&
                              'bg-background border-primary text-primary',
                            !isDone &&
                              !isCurrent &&
                              'bg-background border-muted text-muted-foreground'
                          )}
                        >
                          {index + 1}
                        </div>
                        <div
                          className={cn(
                            'h-0.5 flex-1',
                            index === TIMELINE_STEPS.length - 1
                              ? 'bg-transparent'
                              : isDone
                                ? 'bg-primary'
                                : 'bg-muted'
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          'mt-2 text-xs md:text-sm',
                          isCurrent
                            ? 'text-foreground font-medium'
                            : isDone
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                        )}
                      >
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} c/u
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4 flex items-center justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(order.total)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button
            asChild
            className="w-full bg-[#0F7A3D] text-white hover:bg-[#0F7A3D]/90"
            size="lg"
          >
            <a
              href={whatsappOrderUrl(order)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Coordinar este pedido por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
