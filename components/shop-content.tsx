'use client';

import { useState, useMemo } from 'react';
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
}

function buildShopHref(opts: {
  q?: string;
  page: number;
  limit?: number;
}): string {
  const sp = new URLSearchParams();
  if (opts.q) sp.set('q', opts.q);
  if (opts.page > 1) sp.set('page', String(opts.page));
  if (opts.limit && opts.limit !== 12) sp.set('limit', String(opts.limit));
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
}: ShopContentProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filterOptions.priceRange.min,
    filterOptions.priceRange.max,
  ]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters and sort operate on the visible page slice. Pagination + search
  // happen server-side; these client-side filters narrow what was returned
  // for the current page.
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (categoryFilter !== 'All') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(
        (p) => p.material && selectedMaterials.includes(p.material)
      );
    }

    if (selectedColor) {
      filtered = filtered.filter((p) => p.color === selectedColor);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [
    products,
    selectedCategories,
    selectedMaterials,
    selectedColor,
    priceRange,
    categoryFilter,
    sortBy,
  ]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColor((prev) => (prev === color ? null : color));
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (selectedColor) count += 1;
    if (
      priceRange[0] !== filterOptions.priceRange.min ||
      priceRange[1] !== filterOptions.priceRange.max
    )
      count += 1;
    return count;
  }, [
    selectedCategories,
    selectedMaterials,
    selectedColor,
    priceRange,
    filterOptions.priceRange,
  ]);

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
          priceRange={priceRange}
          onCategoryChange={handleCategoryChange}
          onMaterialChange={handleMaterialChange}
          onColorChange={handleColorChange}
          onPriceRangeChange={setPriceRange}
        />
      </div>

      <div className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : categoryFilter !== 'All'
                  ? categoryFilter
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
                    priceRange={priceRange}
                    onCategoryChange={handleCategoryChange}
                    onMaterialChange={handleMaterialChange}
                    onColorChange={handleColorChange}
                    onPriceRangeChange={setPriceRange}
                    hideTitle={true}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              Ordenar por:
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] cursor-pointer">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
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
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/20 hover:bg-primary/30'
                }`}
              >
                {cat === 'All' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
              <p className="text-lg text-muted-foreground">
                No hay productos que coincidan con los filtros.
              </p>
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
                      q: searchQuery,
                      page: Math.max(1, page - 1),
                      limit,
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
                          q: searchQuery,
                          page: entry,
                          limit,
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
                      q: searchQuery,
                      page: Math.min(totalPages, page + 1),
                      limit,
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
