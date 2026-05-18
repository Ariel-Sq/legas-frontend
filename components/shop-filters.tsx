'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FilterOptions {
  categories: string[];
  materials: string[];
  colors: { name: string; hex: string }[];
  priceRange: { min: number; max: number };
}

interface ShopFiltersProps {
  filterOptions: FilterOptions;
  selectedCategories: string[];
  selectedMaterials: string[];
  selectedColor: string | null;
  priceRange: [number, number];
  onCategoryChange: (category: string) => void;
  onMaterialChange: (material: string) => void;
  onColorChange: (color: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  hideTitle?: boolean;
}

export function ShopFilters({
  filterOptions,
  selectedCategories,
  selectedMaterials,
  selectedColor,
  priceRange,
  onCategoryChange,
  onMaterialChange,
  onColorChange,
  onPriceRangeChange,
  hideTitle = false,
}: ShopFiltersProps) {
  return (
    <div className="space-y-8">
      {!hideTitle && <h2 className="text-2xl font-bold">Filtros</h2>}

      <div>
        <h3 className="text-lg font-bold mb-4">Rango de precio</h3>
        <div className="space-y-4">
          <Slider
            min={filterOptions.priceRange.min}
            max={filterOptions.priceRange.max}
            step={10}
            value={priceRange}
            onValueChange={(value) =>
              onPriceRangeChange(value as [number, number])
            }
            className="cursor-pointer"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Categoría</h3>
        <div className="space-y-3">
          {filterOptions.categories.map((category) => (
            <div key={category} className="flex items-center gap-x-3">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryChange(category)}
                className="cursor-pointer"
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-medium cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Material</h3>
        <div className="space-y-3">
          {filterOptions.materials.map((material) => (
            <div key={material} className="flex items-center gap-x-3">
              <Checkbox
                id={`material-${material}`}
                checked={selectedMaterials.includes(material)}
                onCheckedChange={() => onMaterialChange(material)}
                className="cursor-pointer"
              />
              <Label
                htmlFor={`material-${material}`}
                className="text-sm font-medium cursor-pointer"
              >
                {material}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {filterOptions.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color.name)}
              className={`h-8 w-8 rounded-full border border-border ring-offset-2 ring-offset-background cursor-pointer transition-all ${
                selectedColor === color.name ? 'ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Filtrar por ${color.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
