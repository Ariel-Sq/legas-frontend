import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/utils/environments';
import { getAuthHeaders } from './server-auth';
import { mapOrder, type BackendOrder, type Order } from './orders-shared';

export type {
  Order,
  OrderStatus,
  BackendImage,
  BackendOrder,
  BackendOrderItem,
} from './orders-shared';
export {
  KNOWN_STATUSES,
  STATUS_COLOR,
  STATUS_LABEL,
  getStatusIcon,
  mapOrder,
  statusFromBackend,
} from './orders-shared';

/**
 * Identity headers for order calls: the logged-in Bearer token, or the anon
 * session cookie. The cookie name must match the one cart/checkout set
 * (`legas-session-id`); reading `sessionId` here meant guests never got their
 * order history.
 */
async function customerHeaders(): Promise<Record<string, string>> {
  const auth = await getAuthHeaders();
  const headers: Record<string, string> = { ...auth };
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('legas-session-id')?.value;
  if (!('Authorization' in auth) && sessionCookie) {
    headers['x-session-id'] = sessionCookie;
  }
  return headers;
}

async function fetchOrders(): Promise<Order[]> {
  try {
    const headers = await customerHeaders();
    const resp = await fetch(`${BACKEND_URL}/api/orders`, {
      headers,
      cache: 'no-store',
    });
    if (!resp.ok) return [];
    const data: BackendOrder[] = await resp.json();
    return data.map(mapOrder);
  } catch {
    return [];
  }
}

// `userId` is kept for call-site compatibility but identity is now resolved
// server-side from the session (see fetchOrders / getAuthHeaders).
export async function getUserOrders(_userId?: string): Promise<Order[]> {
  return fetchOrders();
}

/**
 * Ask the backend to re-read this payment from MercadoPago before we show the
 * checkout result. The webhook can land after the redirect, and without this
 * a paid order would still say "confirmando el pago" for half a minute.
 */
export async function verifyOrderPayment(
  orderId: string,
  paymentId: string
): Promise<void> {
  try {
    const headers = {
      ...(await customerHeaders()),
      'Content-Type': 'application/json',
    };
    await fetch(
      `${BACKEND_URL}/api/orders/${encodeURIComponent(orderId)}/verify-payment`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ paymentId }),
        cache: 'no-store',
      }
    );
  } catch {
    // The regular polling below still picks the status up once the webhook
    // arrives; never block the confirmation screen on this call.
  }
}

export async function getOrderById(
  id: string,
  _userId?: string
): Promise<Order | null> {
  try {
    const headers = await customerHeaders();
    const resp = await fetch(
      `${BACKEND_URL}/api/orders/${encodeURIComponent(id)}`,
      { headers, cache: 'no-store' }
    );
    if (!resp.ok) return null;
    const data: BackendOrder = await resp.json();
    return mapOrder(data);
  } catch {
    return null;
  }
}
