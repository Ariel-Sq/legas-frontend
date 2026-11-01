'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  Loader2,
  MessageCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { getOrderStatusAction } from '@/lib/order-actions';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

const PAID_STATUSES = [
  'paid_preparing',
  'paid_ready_to_ship',
  'paid_shipped',
  'paid_delivered',
];

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const externalReference = searchParams.get('external_reference');
  const shortId = externalReference?.slice(0, 8).toUpperCase();
  const waText = encodeURIComponent(
    `Hola Legas! Acabo de hacer el pedido${shortId ? ` ${shortId}` : ''}. ¿Coordinamos la entrega?`
  );

  // undefined = loading, null = not found
  const [status, setStatus] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    clearCart();
    if (!externalReference) {
      setStatus(null);
      return;
    }
    let active = true;
    getOrderStatusAction(externalReference).then((r) => {
      if (active) setStatus(r?.status ?? null);
    });
    return () => {
      active = false;
    };
  }, [clearCart, externalReference]);

  const isPaid = status ? PAID_STATUSES.includes(status) : false;
  const isPending =
    status === 'processing_payment' || status === 'pending_transfer';
  const isFailed =
    status === 'cancelled' || status === 'expired' || status === 'refunded';

  const heading = isPaid
    ? '¡Pago confirmado!'
    : isPending
      ? 'Estamos confirmando tu pago'
      : isFailed
        ? 'El pago no se pudo confirmar'
        : 'Pedido recibido';

  const description = isPaid
    ? 'Gracias por tu compra. Te enviamos un email de confirmación.'
    : isPending
      ? 'MercadoPago todavía está procesando el pago. Te avisamos cuando se acredite.'
      : isFailed
        ? 'No registramos el pago. Si ya pagaste, escribinos por WhatsApp y lo revisamos.'
        : 'Te vamos a contactar para coordinar.';

  const icon = isPaid ? (
    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
  ) : isPending ? (
    <Clock className="h-16 w-16 text-amber-500 mb-4" />
  ) : isFailed ? (
    <XCircle className="h-16 w-16 text-red-500 mb-4" />
  ) : (
    <Loader2 className="h-16 w-16 text-muted-foreground mb-4 animate-spin" />
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                {icon}
                <CardTitle className="text-2xl mb-2">{heading}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-muted-foreground space-y-1">
                <p>{description}</p>
                {shortId && (
                  <p>
                    Tu número de pedido es{' '}
                    <strong className="text-foreground">{shortId}</strong>.
                  </p>
                )}
                {isPaid && (
                  <p>
                    Ahora coordinamos la fabricación y la entrega por WhatsApp.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Coordinar entrega por WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/orders">Ver mis pedidos</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/shop">Seguir comprando</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
