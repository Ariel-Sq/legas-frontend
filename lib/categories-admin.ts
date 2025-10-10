export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  level: number;
  mpath: string;
  sort_order: number;
  image_url: string | null;
  icon: string | null;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  parent_id: number | null;
  image_url: string;
  icon: string;
  is_active: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

// Mock categories for now - will be replaced with API calls
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Muebles',
    slug: 'muebles',
    description: 'Muebles para el hogar',
    parent_id: null,
    level: 0,
    mpath: '1',
    sort_order: 1,
    image_url: '/assorted-living-room-furniture.png',
    icon: '🪑',
    is_active: true,
    meta_title: 'Muebles para el hogar',
    meta_description: 'Encuentra los mejores muebles para tu hogar',
    meta_keywords: 'muebles, hogar, decoración',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Sillones',
    slug: 'sillones',
    description: 'Sillones cómodos y elegantes',
    parent_id: 1,
    level: 1,
    mpath: '1.2',
    sort_order: 1,
    image_url: '/cozy-armchair.png',
    icon: '🛋️',
    is_active: true,
    meta_title: 'Sillones',
    meta_description: 'Sillones cómodos para tu sala',
    meta_keywords: 'sillones, sala, confort',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Mesas',
    slug: 'mesas',
    description: 'Mesas para comedor y sala',
    parent_id: 1,
    level: 1,
    mpath: '1.3',
    sort_order: 2,
    image_url: '/wooden-dining-table.png',
    icon: '🪑',
    is_active: true,
    meta_title: 'Mesas',
    meta_description: 'Mesas de comedor y centro',
    meta_keywords: 'mesas, comedor, sala',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// TODO: Replace with actual API calls
export async function getCategories(): Promise<Category[]> {
  return mockCategories;
}

export async function createCategory(
  data: CategoryFormData
): Promise<Category> {
  // Calculate level and mpath based on parent
  let level = 0;
  let mpath = '';

  if (data.parent_id) {
    const parent = mockCategories.find((c) => c.id === data.parent_id);
    if (parent) {
      level = parent.level + 1;
      mpath = `${parent.mpath}.${mockCategories.length + 1}`;
    }
  } else {
    mpath = `${mockCategories.length + 1}`;
  }

  const newCategory: Category = {
    id: mockCategories.length + 1,
    ...data,
    level,
    mpath,
    sort_order: mockCategories.length + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('[v0] Creating category:', newCategory);
  // TODO: API call to create category
  mockCategories.push(newCategory);

  return newCategory;
}

export function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<number, Category & { children?: Category[] }>();
  const rootCategories: (Category & { children?: Category[] })[] = [];

  // Create a map of all categories
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Build the tree structure
  categories.forEach((category) => {
    const node = categoryMap.get(category.id)!;
    if (category.parent_id === null) {
      rootCategories.push(node);
    } else {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      }
    }
  });

  return rootCategories;
}
