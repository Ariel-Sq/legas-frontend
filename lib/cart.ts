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

/**
 * Outcome of a cart mutation. Failures are returned instead of thrown: Next
 * masks thrown Server Action errors behind a full-page dev overlay (and an
 * opaque digest in production), so an expected case like "your session is
 * stale" would look like a crash.
 */
export interface CartActionResult {
  cart?: CartData;
  /** `session` → the login is stale and the caller should sign out. */
  error?: 'session' | 'generic';
  message?: string;
}

async function runCartMutation(
  path: string,
  init: RequestInit,
  actionLabel: string
): Promise<CartActionResult> {
  try {
    const cart = await mutateCart(path, init, actionLabel);
    return { cart: mapBackendCart(cart) };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'SESSION_STALE') return { error: 'session' };
    return { error: 'generic', message };
  }
}

export async function addToCartAction(
  productId: string,
  quantity: number,
  userId?: string
): Promise<CartActionResult> {
  return runCartMutation(
    '/api/cart/items',
    { method: 'POST', body: JSON.stringify({ productId, quantity }) },
    'agregar el producto al carrito'
  );
}

/**
 * Cart mutation against the backend.
 *
 * Retries once on network errors and 5xx: the backend restarts on every deploy
 * (and on `start:dev` file saves), and a request that lands mid-restart used to
 * surface as a hard "no se pudo agregar" with no way to recover. Anything else
 * (4xx) is a real answer and is reported as-is.
 */
async function mutateCart(
  path: string,
  init: RequestInit,
  actionLabel: string
): Promise<BackendCart> {
  const sessionId = await getSessionId();
  const headers = await buildHeaders(sessionId);
  const url = `${BACKEND_URL}${path}`;
  const pause = () => new Promise((resolve) => setTimeout(resolve, 400));

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let res: Response;
    try {
      res = await fetch(url, { ...init, headers });
    } catch (error) {
      // Transport failure (backend restarting, DNS, etc.) — retry once.
      console.error(`cart: ${actionLabel} transport error`, error);
      if (attempt === 1) throw error;
      await pause();
      continue;
    }

    if (res.ok) return (await res.json()) as BackendCart;

    if (res.status < 500) {
      const err = await res.json().catch(() => ({}));
      const detail = Array.isArray(err.message)
        ? err.message.join(', ')
        : err.message;
      // Stale session: the JWT is valid but its user no longer exists, so the
      // backend refuses to attach a cart. Signalling it lets the provider drop
      // the session and send the shopper through login again.
      if (res.status === 401) throw new Error('SESSION_STALE');
      throw new Error(detail || `No se pudo ${actionLabel}`);
    }

    // Only gateway/availability codes are safe to retry: a generic 500 may have
    // already committed the mutation, and retrying a POST would double it.
    const retryable = [502, 503, 504].includes(res.status);
    console.error(`cart: ${actionLabel} failed with ${res.status}`);
    if (!retryable || attempt === 1) break;
    await pause();
  }

  throw new Error(`No se pudo ${actionLabel}. Probá de nuevo.`);
}

export async function updateCartItemAction(
  cartItemId: string,
  quantity: number,
  userId?: string
): Promise<CartActionResult> {
  return runCartMutation(
    `/api/cart/items/${cartItemId}`,
    { method: 'PATCH', body: JSON.stringify({ quantity }) },
    'actualizar el carrito'
  );
}

export async function removeFromCartAction(
  cartItemId: string,
  userId?: string
): Promise<CartActionResult> {
  return runCartMutation(
    `/api/cart/items/${cartItemId}`,
    { method: 'DELETE' },
    'quitar el producto'
  );
}

export async function clearCartAction(userId?: string): Promise<void> {
  const sessionId = await getSessionId();
  await fetch(`${BACKEND_URL}/api/cart/clear`, {
    method: 'DELETE',
    headers: await buildHeaders(sessionId),
  });
}
