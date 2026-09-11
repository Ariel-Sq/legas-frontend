'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShopFilters } from '@/components/shop-filters';
import { ShopProductCard } from '@/components/shop-product-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  buildPageList,
} from '@/components/ui/pagination';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  material?: string;
  color?: string;
  createdAt?: string;
}

interface FilterOptions {
  categories: string[];
  materials: string[];
  colors: { name: string; hex: string }[];
  priceRange: { min: number; max: number };
}

interface ShopContentProps {
  products: Product[];
  filterOptions: FilterOptions;
  searchQuery?: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  selectedCategories: string[];
  selectedMaterials: string[];
  selectedColor: string | null;
  minPrice?: number;
  maxPrice?: number;
  sort: string;
}

interface ShopFilterState {
  q?: string;
  page: number;
  limit?: number;
  categories?: string[];
  materials?: string[];
  color?: string | null;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

function buildShopHref(opts: ShopFilterState): string {
  const sp = new URLSearchParams();
  if (opts.q) sp.set('q', opts.q);
  if (opts.page > 1) sp.set('page', String(opts.page));
  if (opts.limit && opts.limit !== 12) sp.set('limit', String(opts.limit));
  if (opts.categories?.length) sp.set('category', opts.categories.join(','));
  if (opts.materials?.length) sp.set('material', opts.materials.join(','));
  if (opts.color) sp.set('color', opts.color);
  if (opts.minPrice !== undefined) sp.set('minPrice', String(opts.minPrice));
  if (opts.maxPrice !== undefined) sp.set('maxPrice', String(opts.maxPrice));
  if (opts.sort && opts.sort !== 'default') sp.set('sort', opts.sort);
  const qs = sp.toString();
  return qs ? `/shop?${qs}` : '/shop';
}

export function ShopContent({
  products,
  filterOptions,
  searchQuery,
  page,
  limit,
  total,
  totalPages,
  selectedCategories,
  selectedMaterials,
  selectedColor,
  minPrice,
  maxPrice,
  sort,
}: ShopContentProps) {
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters live in the URL and are applied server-side over the FULL
  // catalogue (see getShopProductsPage) — filtering the current page slice
  // client-side would wrongly report "no matches" for products that live on
  // other pages. The slider keeps local state while dragging and commits to
  // the URL on release.
  const [priceDraft, setPriceDraft] = useState<[number, number]>([
    minPrice ?? filterOptions.priceRange.min,
    maxPrice ?? filterOptions.priceRange.max,
  ]);
  useEffect(() => {
    setPriceDraft([
      minPrice ?? filterOptions.priceRange.min,
      maxPrice ?? filterOptions.priceRange.max,
    ]);
  }, [minPrice, maxPrice, filterOptions.priceRange]);

  const currentFilters: ShopFilterState = {
    q: searchQuery,
    page: 1, // any filter change goes back to page 1
    limit,
    categories: selectedCategories,
    materials: selectedMaterials,
    color: selectedColor,
    minPrice,
    maxPrice,
    sort,
  };

  const pushFilters = (next: Partial<ShopFilterState>) => {
    // Filter/category changes must not jump the page to the top — the user is
    // usually mid-list. Product links still scroll to top (Next's default for
    // <Link>), so opening a product keeps that behaviour.
    router.push(buildShopHref({ ...currentFilters, ...next }), {
      scroll: false,
    });
  };

  const handleCategoryChange = (category: string) => {
    pushFilters({
      categories: selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category],
    });
  };

  const handleMaterialChange = (material: string) => {
    pushFilters({
      materials: selectedMaterials.includes(material)
        ? selectedMaterials.filter((m) => m !== material)
        : [...selectedMaterials, material],
    });
  };

  const handleColorChange = (color: string) => {
    pushFilters({ color: selectedColor === color ? null : color });
  };

  const handlePriceRangeCommit = (range: [number, number]) => {
    pushFilters({
      minPrice: range[0] > filterOptions.priceRange.min ? range[0] : undefined,
      maxPrice: range[1] < filterOptions.priceRange.max ? range[1] : undefined,
    });
  };

  // The quick tags toggle categories over the same URL param the sidebar
  // checkboxes use — multi-select, "Todos" clears the selection.
  const handleTagClick = (cat: string) => {
    if (cat === 'All') {
      pushFilters({ categories: [] });
      return;
    }
    handleCategoryChange(cat);
  };

  const activeFiltersCount = useMemo(() => {
    let count = selectedCategories.length + selectedMaterials.length;
    if (selectedColor) count += 1;
    if (minPrice !== undefined || maxPrice !== undefined) count += 1;
    return count;
  }, [selectedCategories, selectedMaterials, selectedColor, minPrice, maxPrice]);

  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);
  const pageList = useMemo(
    () => buildPageList(page, totalPages),
    [page, totalPages]
  );

  return (
    <main className="flex flex-1">
      {/* Desktop Filters */}
      <div className="hidden lg:block p-6 pr-0">
        <ShopFilters
          filterOptions={filterOptions}
          selectedCategories={selectedCategories}
          selectedMaterials={selectedMaterials}
          selectedColor={selectedColor}
          priceRange={priceDraft}
          onCategoryChange={handleCategoryChange}
          onMaterialChange={handleMaterialChange}
          onColorChange={handleColorChange}
          onPriceRangeChange={setPriceDraft}
          onPriceRangeCommit={handlePriceRangeCommit}
        />
      </div>

      <div className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : selectedCategories.length === 1
                  ? selectedCategories[0]
                  : 'Todos los productos'}
            </h1>
            {searchQuery && (
              <button
                onClick={() => router.push('/shop')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
                Limpiar
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden cursor-pointer relative bg-transparent"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto p-6">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ShopFilters
                    filterOptions={filterOptions}
                    selectedCategories={selectedCategories}
                    selectedMaterials={selectedMaterials}
                    selectedColor={selectedColor}
                    priceRange={priceDraft}
                    onCategoryChange={handleCategoryChange}
                    onMaterialChange={handleMaterialChange}
                    onColorChange={handleColorChange}
                    onPriceRangeChange={setPriceDraft}
                    onPriceRangeCommit={handlePriceRangeCommit}
                    hideTitle={true}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              Ordenar por:
            </span>
            <Select
              value={sort}
              onValueChange={(value) => pushFilters({ sort: value })}
            >
              <SelectTrigger className="w-full sm:w-[180px] cursor-pointer">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" className="cursor-pointer">
                  Por default
                </SelectItem>
                <SelectItem value="newest" className="cursor-pointer">
                  Más recientes
                </SelectItem>
                <SelectItem value="price-low" className="cursor-pointer">
                  Precio: menor a mayor
                </SelectItem>
                <SelectItem value="price-high" className="cursor-pointer">
                  Precio: mayor a menor
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {total === 0
            ? 'Mostrando 0 productos'
            : `Mostrando ${rangeStart}-${rangeEnd} de ${total} ${
                total === 1 ? 'producto' : 'productos'
              }`}
        </p>

        {!searchQuery && filterOptions.categories.length > 0 && (
          <div className="flex gap-3 mb-6 flex-wrap">
            {['All', ...filterOptions.categories].map((cat) => (
              <button
                key={cat}
                onClick={() => handleTagClick(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  (cat === 'All' && selectedCategories.length === 0) ||
                  selectedCategories.includes(cat)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/20 hover:bg-primary/30'
                }`}
              >
                {cat === 'All' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <p className="text-lg text-muted-foreground">
                  No encontramos productos para &ldquo;{searchQuery}&rdquo;.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Probá con otra palabra o revisá la ortografía.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg text-muted-foreground">
                  No hay productos que coincidan con los filtros.
                </p>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push('/shop')}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={buildShopHref({
                      ...currentFilters,
                      page: Math.max(1, page - 1),
                    })}
                    disabled={page <= 1}
                  />
                </PaginationItem>
                {pageList.map((entry, idx) =>
                  entry === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={entry}>
                      <PaginationLink
                        href={buildShopHref({
                          ...currentFilters,
                          page: entry,
                        })}
                        isActive={entry === page}
                      >
                        {entry}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href={buildShopHref({
                      ...currentFilters,
                      page: Math.min(totalPages, page + 1),
                    })}
                    disabled={page >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  );
}
