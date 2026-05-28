'use server';

import { BACKEND_URL } from '@/utils/environments';
import { getAuthHeaders } from './server-auth';
import type { WishlistItem } from './wishlist';

interface BackendImage {
  url?: string;
  path?: string;
  isMain?: boolean;
}

interface BackendWishlistItem {
  id: string;
  userId: string;
  productVariationId: string;
  createdAt: string;
  productVariation: {
    id: string;
    template_id: string;
    name: string;
    price: string | number;
    attributes?: Record<string, string>;
    images?: BackendImage[];
  } | null;
}

// Identity is resolved server-side from the session; wishlist requires auth.
async function buildHeaders(): Promise<Record<string, string>> {
  return {
    'Content-Type': 'application/json',
    ...(await getAuthHeaders()),
  };
}

function mapItem(b: BackendWishlistItem): WishlistItem {
  const variation = b.productVariation;
  const mainImg =
    variation?.images?.find((i) => i.isMain) || variation?.images?.[0];
  return {
    wishlistItemId: b.id,
    productVariationId: b.productVariationId,
    templateId: variation?.template_id ?? '',
    name: variation?.name ?? 'Producto',
    price: Number(variation?.price ?? 0),
    image: mainImg?.url ?? '',
    category: '',
    addedAt: new Date(b.createdAt),
  };
}

export async function fetchWishlist(_userId?: string): Promise<WishlistItem[]> {
  try {
    const resp = await fetch(`${BACKEND_URL}/api/wishlist`, {
      headers: await buildHeaders(),
      cache: 'no-store',
    });
    if (!resp.ok) return [];
    const data: BackendWishlistItem[] = await resp.json();
    return data.map(mapItem);
  } catch {
    return [];
  }
}

export async function addToWishlistAction(
  _userId: string,
  productVariationId: string,
): Promise<WishlistItem | null> {
  const resp = await fetch(`${BACKEND_URL}/api/wishlist`, {
    method: 'POST',
    headers: await buildHeaders(),
    body: JSON.stringify({ productVariationId }),
    cache: 'no-store',
  });
  if (!resp.ok) return null;
  const data: BackendWishlistItem = await resp.json();
  return mapItem(data);
}

export async function removeFromWishlistAction(
  _userId: string,
  productVariationId: string,
): Promise<boolean> {
  const resp = await fetch(
    `${BACKEND_URL}/api/wishlist/${productVariationId}`,
    {
      method: 'DELETE',
      headers: await buildHeaders(),
      cache: 'no-store',
    },
  );
  return resp.ok || resp.status === 404;
}
