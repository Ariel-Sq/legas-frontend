'use server';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  level?: number;
  image: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  children: Category[];
}

import { BACKEND_URL } from '@/utils/environments';
import { frontendKeyHeaders } from '@/utils/frontend-key';

export async function getCategories(): Promise<Category[]> {
  const resp = await fetch(`${BACKEND_URL}/api/categories/tree`, {
    headers: frontendKeyHeaders(),
  });
  const data: Category[] = await resp.json();
  return data;
}
