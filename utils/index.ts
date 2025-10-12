import { Category } from '@/lib/categories-admin';

// Flatten the category tree into a flat array for forms and other uses
export function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];

  const flatten = (cats: Category[]) => {
    cats.forEach((category) => {
      result.push(category);
      if (category.children && category.children.length > 0) {
        flatten(category.children);
      }
    });
  };

  flatten(categories);
  return result;
}
