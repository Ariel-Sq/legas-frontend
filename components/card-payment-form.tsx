'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CardPayment,
  StatusScreen,
  initMercadoPago,
} from '@mercadopago/sdk-react';
import { Loader2 } from 'lucide-react';
import {
  getCardOrderStatus,
  payWithCard,
  type BrickCardFormData,
} from '@/lib/checkout';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

/** Order statuses that mean the money is in. */
const PAID_STATUSES = new Set([
  'paid_preparing',
  'paid_ready_to_ship',
  'paid_shipped',
  'paid_delivered',
]);

/** `initMercadoPago` must run once, client-side only. */
let mpInitialized = false;

// The card form is only rendered after a click (never during SSR), so the
// SDK can be initialized at module load on the client without touching
// `window` on the server.
if (typeof window !== 'undefined' && PUBLIC_KEY && !mpInitialized) {
  initMercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
  mpInitialized = true;
}

export interface CardPaymentFormProps {
  /** Order hold created by /payments/card/intent. */
  orderId: string;
  /** Amount computed by the backend (never trusted from the client). */
  amount: number;
  /** Pre-fills the card form. */
  email: string;
  /** DNI digits, pre-filled into the payer identification field. */
  dni: string;
  maxInstallments: number;
  /** Must be stable (useCallback) — a new reference re-mounts the brick. */
  onApproved: (orderId: string) => void;
  onPending: (orderId: string) => void;
}

/**
 * On-site card payment: MercadoPago's Card Payment Brick tokenizes the card
 * (raw numbers never touch our servers) and the backend charges the token.
 *
 * IMPORTANT: the Brick's `useEffect` depends on `initialization`,
 * `customization` and every callback BY REFERENCE. A new object/function on
 * any parent re-render (a session refetch on window focus is enough) unmounts
 * and re-creates the iframe, wiping whatever the shopper had typed. Hence the
 * memoized props here and `memo()` on the component.
 *
 * When the issuer requires 3-D Secure, the response carries `three_ds_info`
 * and we swap the card form for the Status Screen Brick, which renders the
 * bank challenge inline. The order status is polled while the shopper
 * completes it.
 */
function CardPaymentFormBase({
  orderId,
  amount,
  email,
  dni,
  maxInstallments,
  onApproved,
  onPending,
}: CardPaymentFormProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [challenge, setChallenge] = useState<{
    paymentId: string;
    externalResourceUrl: string;
    creq: string;
  } | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable props for the Brick — new references would re-mount it.
  const initialization = useMemo(
    () => ({
      amount,
      payer: {
        email,
        ...(dni ? { identification: { type: 'DNI', number: dni } } : {}),
      },
    }),
    [amount, email, dni]
  );

  const customization = useMemo(
    () => ({ paymentMethods: { minInstallments: 1, maxInstallments } }),
    [maxInstallments]
  );

  const handleReady = useCallback(() => setError(''), []);
  const handleBrickError = useCallback(
    () => setError('Revisá los datos de la tarjeta.'),
    []
  );

  const handleSubmit = useCallback(
    async (formData: BrickCardFormData) => {
      setBusy(true);
      setError('');
      const result = await payWithCard(orderId, formData);
      setBusy(false);

      if (result.error) {
        setError(result.error);
        // Rejecting re-enables the Brick's button so the shopper can retry.
        throw new Error(result.error);
      }

      if (result.threeDs && result.paymentId) {
        setChallenge({
          paymentId: result.paymentId,
          externalResourceUrl: result.threeDs.externalResourceUrl,
          creq: result.threeDs.creq,
        });
        return;
      }

      if (result.status === 'approved') {
        onApproved(orderId);
        return;
      }
      if (result.status === 'pending' || result.status === 'in_process') {
        onPending(orderId);
        return;
      }

      setError(result.statusMessage || 'El pago fue rechazado.');
      throw new Error(result.statusMessage || 'payment-rejected');
    },
    [orderId, onApproved, onPending]
  );

  // While the bank challenge is open, watch the order until it settles.
  useEffect(() => {
    if (!challenge) return;
    pollRef.current = setInterval(async () => {
      const { status } = await getCardOrderStatus(orderId);
      if (!status) return;
      if (PAID_STATUSES.has(status)) {
        if (pollRef.current) clearInterval(pollRef.current);
        onApproved(orderId);
      } else if (status === 'cancelled' || status === 'expired') {
        if (pollRef.current) clearInterval(pollRef.current);
        setChallenge(null);
        setError('La verificación no se completó. Probá con otra tarjeta.');
      }
    }, 4000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [challenge, orderId, onApproved]);

  if (!PUBLIC_KEY) {
    return (
      <p className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
        Falta configurar `NEXT_PUBLIC_MP_PUBLIC_KEY` para mostrar el formulario
        de tarjeta.
      </p>
    );
  }

  if (challenge) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Tu banco pide una verificación adicional. Completala acá abajo y no
          cierres esta página.
        </p>
        <StatusScreen
          initialization={{
            paymentId: challenge.paymentId,
            additionalInfo: {
              externalResourceURL: challenge.externalResourceUrl,
              creq: challenge.creq,
            },
          }}
          locale="es-AR"
          onError={() =>
            setError('No pudimos mostrar la verificación del banco.')
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {busy && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Procesando el pago...
        </div>
      )}
      <CardPayment
        initialization={initialization}
        customization={customization}
        locale="es-AR"
        onSubmit={handleSubmit}
        onReady={handleReady}
        onError={handleBrickError}
      />
    </div>
  );
}

export const CardPaymentForm = memo(CardPaymentFormBase);
