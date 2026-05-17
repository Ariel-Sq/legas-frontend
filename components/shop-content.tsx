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
}

export function ShopContent({
  products,
  filterOptions,
  searchQuery,
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

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category buttons
    if (categoryFilter !== 'All') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Filter by sidebar categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // Filter by materials
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(
        (p) => p.material && selectedMaterials.includes(p.material)
      );
    }

    // Filter by color
    if (selectedColor) {
      filtered = filtered.filter((p) => p.color === selectedColor);
    }

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort products
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
    searchQuery,
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : categoryFilter !== 'All'
                  ? categoryFilter
                  : 'All Products'}
            </h1>
            {searchQuery && (
              <button
                onClick={() => router.push('/shop')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="h-4 w-4" />
                Clear
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
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto p-6">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
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
              Sort by:
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] cursor-pointer">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest" className="cursor-pointer">
                  Newest Arrivals
                </SelectItem>
                <SelectItem value="price-low" className="cursor-pointer">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high" className="cursor-pointer">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchQuery
                ? `No products found for "${searchQuery}". Try a different search term.`
                : 'No products found matching your filters.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
