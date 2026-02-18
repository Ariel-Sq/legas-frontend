'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Clock className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <PendingContent />
    </Suspense>
  );
}

function PendingContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <Clock className="h-16 w-16 text-yellow-500 mb-4" />
                <CardTitle className="text-2xl mb-2">
                  Payment Pending
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground">
                <p>
                  Your payment is being processed. We'll notify you once it's
                  confirmed.
                </p>
                {paymentId && (
                  <p className="mt-2">Payment ID: {paymentId}</p>
                )}
                {status && <p>Status: {status}</p>}
                {externalReference && (
                  <p>Order Reference: {externalReference}</p>
                )}
              </div>
              <div className="flex justify-center mt-6">
                <Button asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
