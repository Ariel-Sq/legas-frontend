import { getCurrentUser } from '@/lib/user';
import { getCategories } from '@/lib/categories-admin';
import { redirect } from 'next/navigation';
import { CategoriesClient } from './CategoriesClient';

export default async function CategoriesAdminPage() {
  // Check if user is admin on server
  const user = await getCurrentUser();
  if (!user.isAdmin) {
    redirect('/');
  }

  // Fetch initial data on server
  const categories = await getCategories();

  // Pass data to Client Component
  return <CategoriesClient initialCategories={categories} />;
}
