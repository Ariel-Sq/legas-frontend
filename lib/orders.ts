import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/utils/environments';
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

async function fetchOrders(userId?: string): Promise<Order[]> {
  try {
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    // Forward the sessionId cookie when there is no logged-in user, so the
    // backend can scope orders to the anon shopper that created them.
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('sessionId')?.value;
    if (!userId && sessionCookie) {
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

export async function getUserOrders(userId?: string): Promise<Order[]> {
  return fetchOrders(userId);
}

export async function getOrderById(
  id: string,
  userId?: string,
): Promise<Order | null> {
  const orders = await fetchOrders(userId);
  return orders.find((o) => o.id === id) ?? null;
}
