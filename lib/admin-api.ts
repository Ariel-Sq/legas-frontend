'use server';

import { revalidatePath } from 'next/cache';
import { BACKEND_URL } from '@/utils/environments';
import { getAuthHeaders } from './server-auth';
import { frontendKeyHeaders } from '@/utils/frontend-key';

/**
 * Thin server-side client for /api/admin. Every call forwards the signed-in
 * user's backend JWT, and the backend re-checks the role from the database —
 * hiding the UI is never the security boundary.
 */

async function adminFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...frontendKeyHeaders(),
    ...(await getAuthHeaders()),
  };
  if (!(init.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BACKEND_URL}/api/admin${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers as Record<string, string>) },
    cache: 'no-store',
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const message = Array.isArray(detail.message)
      ? detail.message.join(', ')
      : detail.message;
    throw new Error(message || `Error ${res.status}`);
  }
  return (await res.json()) as T;
}

export interface AdminMe {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'customer';
  isOwner: boolean;
}

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  is_featured: boolean;
  category: string | null;
  variations: number;
  minPrice: number;
  mainImage: string | null;
}

export interface AdminImage {
  id: string;
  url: string;
  path: string;
  isMain: boolean;
  sortOrder: number;
  altText: string | null;
}

export interface AdminVariation {
  id: string;
  sku: string;
  name: string;
  price: string | number;
  stock: number;
  is_active: boolean;
  sort_order: number;
  attributes: Record<string, string> | null;
  images: AdminImage[];
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specifications: Record<string, string> | null;
  is_active: boolean;
  is_featured: boolean;
  categories: AdminCategory[];
  variations: AdminVariation[];
}

export interface AdminUserRow {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
}

export async function getAdminMe(): Promise<AdminMe> {
  return adminFetch<AdminMe>('/me');
}

export async function listAdminProducts(q?: string): Promise<AdminProductRow[]> {
  const qs = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : '';
  return adminFetch<AdminProductRow[]>(`/products${qs}`);
}

export async function getAdminProduct(id: string): Promise<AdminProduct> {
  return adminFetch<AdminProduct>(`/products/${id}`);
}

export async function listAdminCategories(): Promise<AdminCategory[]> {
  return adminFetch<AdminCategory[]>('/categories');
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    specifications?: Record<string, string>;
    is_active?: boolean;
    is_featured?: boolean;
    categoryIds?: string[];
  }
): Promise<void> {
  await adminFetch(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  revalidatePath('/admin');
  revalidatePath(`/admin/products/${id}`);
  revalidatePath('/shop');
}

export async function updateVariation(
  id: string,
  data: { name?: string; price?: number; stock?: number; is_active?: boolean }
): Promise<void> {
  await adminFetch(`/variations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  revalidatePath('/admin');
}

export async function uploadVariationImage(
  variationId: string,
  formData: FormData
): Promise<void> {
  await adminFetch(`/variations/${variationId}/images`, {
    method: 'POST',
    body: formData,
  });
  revalidatePath('/admin');
}

export async function setMainImage(imageId: string, productId: string) {
  await adminFetch(`/images/${imageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isMain: true }),
  });
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteImage(imageId: string, productId: string) {
  await adminFetch(`/images/${imageId}`, { method: 'DELETE' });
  revalidatePath(`/admin/products/${productId}`);
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  return adminFetch<AdminUserRow[]>('/users');
}

export async function updateUserRole(id: string, role: string): Promise<void> {
  await adminFetch(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
  revalidatePath('/admin/users');
}

export interface AuditRow {
  actorEmail: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  payload: Record<string, unknown> | null;
  createdAt: string;
}

export async function listAudit(): Promise<AuditRow[]> {
  return adminFetch<AuditRow[]>('/audit?limit=100');
}
