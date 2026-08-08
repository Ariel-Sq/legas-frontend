'use server';

import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/utils/environments';
import { getAuthHeaders } from './server-auth';

// --- Types ---

interface BackendCartItem {
  id: string;
  cartId: string;
  productVariationId: string;
  quantity: number;
  price: number;
  productVariation: {
    id: string;
    template_id: string;
    sku: string;
    name: string;
    price: string;
    stock: number;
    attributes: Record<string, any>;
    is_active: boolean;
    images: Array<{ id: string; url: string; path?: string; isMain?: boolean }>;
  };
}

interface BackendCart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  items: BackendCartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartItem {
  id: string;
  cartItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  stock: number;
}

export interface CartData {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

// --- Helpers ---

async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('legas-session-id')?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set('legas-session-id', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      // This id is the anonymous shopper's whole identity (cart + guest
      // orders); keep it off plaintext HTTP in production.
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }
  return sessionId;
}

// Resolve identity server-side: a Bearer token for logged-in users. Anonymous
// shoppers fall back to the session id so their cart persists across requests.
async function buildHeaders(sessionId?: string): Promise<Record<string, string>> {
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

function resolveImageUrl(image: { url?: string; path?: string } | undefined): string {
  if (!image) return '';
  // The backend stores a placeholder ({{LOCAL_STORAGE}}/...) on raw responses;
  // the templates service rewrites it, but the cart endpoint does not. Build
  // the public URL from `path` when the raw url isn't usable.
  if (image.url && !image.url.startsWith('{{') && /^https?:\/\//.test(image.url)) {
    return image.url;
  }
  if (image.path && BACKEND_URL) {
    return `${BACKEND_URL}/api/images?path=${image.path}`;
  }
  return '';
}

function mapBackendCart(cart: BackendCart): CartData {
  const items: CartItem[] = cart.items.map((item) => {
    const mainImage =
      item.productVariation?.images?.find((img) => img.isMain) ||
      item.productVariation?.images?.[0];
    const unitPrice =
      item.quantity > 0 ? Number(item.price) / item.quantity : Number(item.productVariation?.price ?? 0);

    return {
      id: item.productVariationId,
      cartItemId: item.id,
      name: item.productVariation?.name || 'Product',
      price: unitPrice,
      image: resolveImageUrl(mainImage),
      quantity: item.quantity,
      category: '',
      stock: item.productVariation?.stock ?? 0,
    };
  });

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, itemCount, subtotal };
}

function emptyCart(): CartData {
  return { items: [], itemCount: 0, subtotal: 0 };
}

// --- Server Actions ---

export async function fetchCart(userId?: string): Promise<CartData> {
  try {
    const sessionId = await getSessionId();
    const res = await fetch(`${BACKEND_URL}/api/cart`, {
      headers: await buildHeaders(sessionId),
      cache: 'no-store',
    });
    if (!res.ok) return emptyCart();
    const cart: BackendCart = await res.json();
    return mapBackendCart(cart);
  } catch {
    return emptyCart();
  }
}

export async function addToCartAction(
  productId: string,
  quantity: number,
  userId?: string
): Promise<CartData> {
  const sessionId = await getSessionId();
  const res = await fetch(`${BACKEND_URL}/api/cart/items`, {
    method: 'POST',
    headers: await buildHeaders(sessionId),
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to add to cart');
  }
  const cart: BackendCart = await res.json();
  return mapBackendCart(cart);
}

export async function updateCartItemAction(
  cartItemId: string,
  quantity: number,
  userId?: string
): Promise<CartData> {
  const sessionId = await getSessionId();
  const res = await fetch(`${BACKEND_URL}/api/cart/items/${cartItemId}`, {
    method: 'PATCH',
    headers: await buildHeaders(sessionId),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update cart');
  }
  const cart: BackendCart = await res.json();
  return mapBackendCart(cart);
}

export async function removeFromCartAction(
  cartItemId: string,
  userId?: string
): Promise<CartData> {
  const sessionId = await getSessionId();
  const res = await fetch(`${BACKEND_URL}/api/cart/items/${cartItemId}`, {
    method: 'DELETE',
    headers: await buildHeaders(sessionId),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to remove from cart');
  }
  const cart: BackendCart = await res.json();
  return mapBackendCart(cart);
}

export async function clearCartAction(userId?: string): Promise<void> {
  const sessionId = await getSessionId();
  await fetch(`${BACKEND_URL}/api/cart/clear`, {
    method: 'DELETE',
    headers: await buildHeaders(sessionId),
  });
}
