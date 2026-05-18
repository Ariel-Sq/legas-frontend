'use server';

import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/utils/environments';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    method: 'standard' | 'express';
    cost: number;
  };
  subtotal: number;
  shippingCost: number;
  total: number;
}

interface BackendImage {
  url?: string;
  path?: string;
}

interface BackendOrderItem {
  id: string;
  productVariationId: string;
  title: string;
  quantity: number;
  unitPrice: string | number;
  productVariation?: {
    images?: BackendImage[];
  } | null;
}

interface BackendOrder {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  status: string;
  totalAmount: string | number;
  createdAt: string;
  items: BackendOrderItem[];
}

const statusFromBackend = (s: string): Order['status'] => {
  switch (s) {
    case 'completed':
      return 'delivered';
    case 'cancelled':
    case 'refunded':
      return 'delivered';
    case 'processing':
      return 'processing';
    case 'pending':
    default:
      return 'pending';
  }
};

function mapOrder(o: BackendOrder): Order {
  const items = (o.items || []).map((it) => {
    const img =
      it.productVariation?.images?.find?.((i) => (i as any).isMain) ||
      it.productVariation?.images?.[0];
    return {
      id: it.id,
      name: it.title,
      price: Number(it.unitPrice),
      quantity: it.quantity,
      image: img?.url || '',
    };
  });
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = Number(o.totalAmount ?? subtotal);
  return {
    id: o.id,
    orderNumber: o.id.slice(0, 8).toUpperCase(),
    date: o.createdAt,
    status: statusFromBackend(o.status),
    items,
    shipping: {
      name: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
      method: 'standard',
      cost: 0,
    },
    subtotal,
    shippingCost: 0,
    total,
  };
}

export async function getUserOrders(userId?: string): Promise<Order[]> {
  try {
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    // Forward the sessionId cookie when there is no logged-in user, so the
    // backend can scope orders to the anon shopper that created them.
    const sessionCookie = cookies().get('sessionId')?.value;
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
