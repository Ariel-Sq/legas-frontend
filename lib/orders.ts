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

async function fetchOrders(): Promise<Order[]> {
  try {
    const auth = await getAuthHeaders();
    const headers: Record<string, string> = { ...auth };
    // Forward the anon session cookie when there is no logged-in user, so the
    // backend can scope orders to the anon shopper that created them. The
    // cookie name must match the one cart/checkout set (`legas-session-id`);
    // reading `sessionId` here meant guests never got their order history.
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('legas-session-id')?.value;
    if (!('Authorization' in auth) && sessionCookie) {
      headers['x-session-id'] = sessionCookie;
    }
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

export async function getOrderById(
  id: string,
  _userId?: string
): Promise<Order | null> {
  try {
    const auth = await getAuthHeaders();
    const headers: Record<string, string> = { ...auth };
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('legas-session-id')?.value;
    if (!('Authorization' in auth) && sessionCookie) {
      headers['x-session-id'] = sessionCookie;
    }
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
