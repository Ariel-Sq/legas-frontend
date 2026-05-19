import { ShopContent } from '@/components/shop-content';
import { getShopProductsPage } from '@/lib/products';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const params = await searchParams;
  // Accept both `q` (new) and `search` (legacy) so any older bookmarks keep
  // working. `q` wins if both are present.
  const query = (params.q ?? params.search ?? '').trim();
  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(
    parsePositiveInt(params.limit, DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  );

  const { products, total, page: safePage, totalPages, filterOptions } =
    await getShopProductsPage({ page, limit, q: query });

  return (
    <div className="flex flex-col min-h-screen">
      <ShopContent
        products={products}
        filterOptions={filterOptions}
        searchQuery={query || undefined}
        page={safePage}
        limit={limit}
        total={total}
        totalPages={totalPages}
      />
    </div>
  );
}
