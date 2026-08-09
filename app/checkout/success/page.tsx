'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const WHATSAPP_NUMBER = '5491173666370';

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <CheckCircle className="h-8 w-8 animate-spin" />
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
    `Hola Legas! Acabo de pagar mi pedido${shortId ? ` ${shortId}` : ''}. ¿Coordinamos la entrega?`
  );

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="text-2xl mb-2">
                  ¡Pago confirmado!
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-muted-foreground space-y-1">
                <p>Gracias por tu compra. Te enviamos un email de confirmación.</p>
                {shortId && (
                  <p>
                    Tu número de pedido es{' '}
                    <strong className="text-foreground">{shortId}</strong>.
                  </p>
                )}
                <p>
                  Ahora coordinamos la fabricación y la entrega por WhatsApp.
                </p>
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
