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

/**
 * What the checkout UI can offer. `card` is the on-site card form (Card
 * Payment Brick) — it never goes through `createCheckoutPreference`.
 */
export type CheckoutPaymentOption = CheckoutPaymentMethod | 'card';

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

// ----- On-site card payment (Card Payment Brick) -----

export interface CardIntentResult {
  orderId?: string;
  /** Amount the Brick must tokenize (always the backend-computed total). */
  amount?: number;
  error?: string;
}

/**
 * Step 1: create the order hold and get the amount to charge. The Brick is
 * only rendered after this resolves, so the amount never comes from the
 * client.
 */
export async function createCardIntent(
  contact?: {
    customerEmail?: string;
    customerPhone?: string;
    customerDni?: string;
    deliveryMethod?: 'delivery' | 'pickup';
    deliveryAddress?: string;
  },
  idempotencyKey?: string
): Promise<CardIntentResult> {
  try {
    const sessionId = await getSessionId();

    const body: Record<string, string> = {};
    if (contact?.customerEmail) body.customerEmail = contact.customerEmail;
    if (contact?.customerPhone) body.customerPhone = contact.customerPhone;
    if (contact?.customerDni) body.customerDni = contact.customerDni;
    if (contact?.deliveryMethod) body.deliveryMethod = contact.deliveryMethod;
    if (contact?.deliveryAddress)
      body.deliveryAddress = contact.deliveryAddress;
    if (idempotencyKey) body.idempotencyKey = idempotencyKey;

    const response = await fetch(`${BACKEND_URL}/api/payments/card/intent`, {
      method: 'POST',
      headers: await buildHeaders(sessionId),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        error:
          typeof error?.message === 'string'
            ? error.message
            : 'No pudimos preparar el pago con tarjeta.',
      };
    }

    const data = await response.json();
    return { orderId: data.orderId, amount: Number(data.amount) };
  } catch (err) {
    console.error('createCardIntent failed', err);
    return { error: 'No pudimos preparar el pago con tarjeta.' };
  }
}

export interface CardPaymentResult {
  orderId?: string;
  paymentId?: string;
  status?: string;
  statusDetail?: string;
  statusMessage?: string;
  threeDs?: { externalResourceUrl: string; creq: string };
  error?: string;
}

/** Card data produced by MercadoPago's Brick (already tokenized). */
export interface BrickCardFormData {
  payment_method_id: string;
  issuer_id?: string;
  token: string;
  installments: number;
  payer?: {
    email?: string;
    identification?: { type: string; number: string };
    first_name?: string;
    last_name?: string;
  };
}

/** Step 2: charge the token. The backend reads the amount from the order. */
export async function payWithCard(
  orderId: string,
  formData: BrickCardFormData
): Promise<CardPaymentResult> {
  try {
    const sessionId = await getSessionId();

    const body = {
      orderId,
      token: formData.token,
      paymentMethodId: formData.payment_method_id,
      installments: Number(formData.installments) || 1,
      ...(formData.issuer_id ? { issuerId: String(formData.issuer_id) } : {}),
      payer: {
        email: formData.payer?.email ?? '',
        ...(formData.payer?.identification
          ? { identification: formData.payer.identification }
          : {}),
        ...(formData.payer?.first_name
          ? { firstName: formData.payer.first_name }
          : {}),
        ...(formData.payer?.last_name
          ? { lastName: formData.payer.last_name }
          : {}),
      },
    };

    const response = await fetch(`${BACKEND_URL}/api/payments/card/pay`, {
      method: 'POST',
      headers: await buildHeaders(sessionId),
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        error:
          typeof data?.message === 'string'
            ? data.message
            : 'No pudimos procesar el pago con tarjeta.',
      };
    }

    return {
      orderId: data.orderId,
      paymentId: data.paymentId,
      status: data.status,
      statusDetail: data.statusDetail,
      statusMessage: data.statusMessage,
      threeDs: data.threeDs,
    };
  } catch (err) {
    console.error('payWithCard failed', err);
    return { error: 'No pudimos procesar el pago con tarjeta.' };
  }
}

/** Poll the order while the 3DS challenge completes. */
export async function getCardOrderStatus(
  orderId: string
): Promise<{ status?: string; error?: string }> {
  try {
    const sessionId = await getSessionId();
    const response = await fetch(
      `${BACKEND_URL}/api/payments/card/order/${orderId}`,
      { headers: await buildHeaders(sessionId), cache: 'no-store' }
    );
    if (!response.ok) return { error: 'No pudimos consultar el pedido.' };
    const data = await response.json();
    return { status: data.status };
  } catch (err) {
    console.error('getCardOrderStatus failed', err);
    return { error: 'No pudimos consultar el pedido.' };
  }
}
