'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

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
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="text-2xl mb-2">
                  ¡Pago exitoso!
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground">
                <p>
                  Gracias por tu compra. En breve te llega un email de
                  confirmación.
                </p>
                {paymentId && (
                  <p className="mt-2">ID de pago: {paymentId}</p>
                )}
                {status && <p>Estado: {status}</p>}
                {externalReference && (
                  <p>Referencia de pedido: {externalReference}</p>
                )}
              </div>
              <div className="flex justify-center mt-6">
                <Button asChild>
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
