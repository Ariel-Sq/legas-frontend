'use server';

import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/utils/environments';
import { getAuthHeaders } from './server-auth';

async function getSessionId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('legas-session-id')?.value;
}

async function buildHeaders(
  sessionId?: string
): Promise<Record<string, string>> {
  const auth = await getAuthHeaders();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...auth,
  };
  if (!('Authorization' in auth) && sessionId) {
    headers['x-session-id'] = sessionId;
  }
  return headers;
}

// `userId` is kept for call-site compatibility; identity is resolved
// server-side from the session (Bearer) or the anon session id.
// - mercadopago: pay online now (list price, any MP method; buyer picks
//   installments financed by MP), returns a preference id.
// - offline: transfer/cash, coordinated by WhatsApp, returns an order id.
export type CheckoutPaymentMethod = 'mercadopago' | 'offline';

export interface CheckoutPreferenceResult {
  /** MercadoPago preference id (mercadopago mode). */
  id?: string;
  /** Placed order id (offline mode). */
  orderId?: string;
  mode?: 'mercadopago' | 'offline';
  /** URL to redirect the shopper to (Checkout Pro). */
  checkoutUrl?: string;
  /**
   * Human-readable failure (e.g. insufficient stock). Returned instead of
   * thrown: Next.js masks thrown Server Action errors in production, which
   * turned real messages into an opaque "Server Components render" error.
   */
  error?: string;
}

export async function createCheckoutPreference(
  _userId?: string,
  contact?: {
    customerEmail?: string;
    customerPhone?: string;
    customerDni?: string;
    deliveryMethod?: 'delivery' | 'pickup';
    deliveryAddress?: string;
  },
  paymentMethod?: CheckoutPaymentMethod,
  idempotencyKey?: string
): Promise<CheckoutPreferenceResult> {
  try {
    const sessionId = await getSessionId();

    const body: Record<string, string> = {};
    if (contact?.customerEmail) body.customerEmail = contact.customerEmail;
    if (contact?.customerPhone) body.customerPhone = contact.customerPhone;
    if (contact?.customerDni) body.customerDni = contact.customerDni;
    if (contact?.deliveryMethod) body.deliveryMethod = contact.deliveryMethod;
    if (contact?.deliveryAddress)
      body.deliveryAddress = contact.deliveryAddress;
    if (paymentMethod) body.paymentMethod = paymentMethod;
    if (idempotencyKey) body.idempotencyKey = idempotencyKey;

    const response = await fetch(
      `${BACKEND_URL}/api/payments/mercadopago/checkout`,
      {
        method: 'POST',
        headers: await buildHeaders(sessionId),
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (error?.error === 'INSUFFICIENT_STOCK') {
        return {
          error:
            'No hay stock suficiente de alguno de los productos del carrito. Ajustá las cantidades e intentá de nuevo.',
        };
      }
      return {
        error:
          typeof error?.message === 'string'
            ? error.message
            : 'No pudimos iniciar el pago. Intentá de nuevo en unos minutos.',
      };
    }

    const data = await response.json();
    return {
      id: data.id,
      orderId: data.orderId,
      mode: data.mode,
      checkoutUrl: data.checkoutUrl,
    };
  } catch (err) {
    console.error('createCheckoutPreference failed', err);
    return {
      error: 'No pudimos iniciar el pago. Intentá de nuevo en unos minutos.',
    };
  }
}
