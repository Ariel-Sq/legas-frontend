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
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  image: string;
  icon: string;
  is_active: boolean;
  meta_title: string;
  meta_description: string;
}

import { BACKEND_URL } from '@/utils/environments';

export async function getCategories(): Promise<Category[]> {
  const resp = await fetch(`${BACKEND_URL}/api/categories/tree`);
  const data: Category[] = await resp.json();
  return data;
}

export async function createCategory(
  data: CategoryFormData
): Promise<Category> {
  'use server';

  const resp = await fetch(`${BACKEND_URL}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('resp: ', resp);

  if (!resp.ok) {
    throw new Error('Failed to create category');
  }

  const newCategory: Category = await resp.json();
  return newCategory;
}
