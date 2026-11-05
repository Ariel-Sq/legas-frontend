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
  // MercadoPago appends payment_id/status to the back_url; the id lets the
  // backend reconcile the payment without waiting for the webhook.
  const paymentId = searchParams.get('payment_id') ?? undefined;
  const shortId = externalReference?.slice(0, 8).toUpperCase();
  const waText = encodeURIComponent(
    `Hola Legas! Acabo de hacer el pedido${shortId ? ` ${shortId}` : ''}. ¿Coordinamos la entrega?`
  );

  // undefined = consultando, null = no encontramos el pedido
  const [status, setStatus] = useState<string | null | undefined>(
    externalReference ? undefined : null
  );

  useEffect(() => {
    clearCart();
    if (!externalReference) return;

    let active = true;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // The webhook may land a few seconds after the redirect, so poll a bit
    // instead of trusting the first read. Never leave the visitor spinning: if
    // the order is not found after a few tries, fall back to a neutral state.
    const check = async () => {
      attempts += 1;
      try {
        const result = await getOrderStatusAction(
          externalReference,
          // Only ask MP once: later polls just read the order.
          attempts === 1 ? paymentId : undefined
        );
        if (!active) return;

        if (result) {
          setStatus(result.status);
          const settled = [
            ...PAID_STATUSES,
            'cancelled',
            'expired',
            'refunded',
          ].includes(result.status);
          if (!settled && attempts < 10) {
            timer = setTimeout(check, 3000);
          }
          return;
        }

        if (attempts < 4) {
          timer = setTimeout(check, 3000);
        } else {
          setStatus(null);
        }
      } catch {
        if (active) setStatus(null);
      }
    };

    void check();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [clearCart, externalReference, paymentId]);

  const isChecking = status === undefined;
  const isPaid = status ? PAID_STATUSES.includes(status) : false;
  const isPending = status === 'processing_payment' || status === 'pending_transfer';
  const isFailed =
    status === 'cancelled' || status === 'expired' || status === 'refunded';
  const isUnknown = status === null;

  const heading = isChecking
    ? 'Confirmando tu pago…'
    : isPaid
      ? '¡Pago confirmado!'
      : isPending
        ? 'Estamos confirmando tu pago'
        : isFailed
          ? 'El pago no se pudo confirmar'
          : 'Pedido registrado';

  const description = isChecking
    ? 'Estamos consultando el estado del pedido. Tarda unos segundos.'
    : isPaid
      ? 'Gracias por tu compra. Te enviamos un email de confirmación.'
      : isPending
        ? 'MercadoPago todavía está procesando el pago. Si ya lo hiciste, escribinos por WhatsApp con el número de pedido y lo confirmamos al instante.'
        : isFailed
          ? 'No registramos el pago. Si ya pagaste, escribinos por WhatsApp y lo revisamos.'
          : 'Si ya pagaste, en unos minutos va a figurar confirmado en Mis pedidos. Cualquier duda, escribinos.';

  const icon = isChecking ? (
    <Loader2 className="h-16 w-16 text-muted-foreground mb-4 animate-spin" />
  ) : isPaid ? (
    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
  ) : isFailed ? (
    <XCircle className="h-16 w-16 text-red-500 mb-4" />
  ) : (
    <Clock className="h-16 w-16 text-amber-500 mb-4" />
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
                {isUnknown && (
                  <p className="text-sm">
                    Si pasaron más de 10 minutos y no aparece, escribinos con el
                    número de pedido.
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
