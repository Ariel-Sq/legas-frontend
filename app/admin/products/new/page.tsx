'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  type ProductTemplateFormData,
  type ProductVariationFormData,
  type ProductImageFormData,
  type ProductPriceTierFormData,
  createProductTemplate,
  createProductVariation,
  createProductImage,
  createProductPriceTier,
} from '@/lib/products-admin';
import { getCategories, type Category } from '@/lib/categories-admin';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Step 1: Product Template
  const [templateData, setTemplateData] = useState<ProductTemplateFormData>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    category_id: 1,
    specifications: {},
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_active: true,
  });

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Category accordion handlers
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Category selection handlers
  const handleCategoryToggle = (
    categoryId: string,
    event?: React.MouseEvent
  ) => {
    // Prevent accordion toggle when clicking checkbox
    if (event) {
      event.stopPropagation();
    }

    const id = parseInt(categoryId);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const renderCategoryTree = (cats: Category[], depth = 0) => {
    return cats.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isSelected = selectedCategories.includes(parseInt(category.id));
      const isExpanded = expandedCategories.has(category.id);

      return (
        <div key={category.id}>
          <div
            className="group flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
            onClick={(e) => {
              e.stopPropagation();
              toggleCategoryExpansion(category.id);
            }}
          >
            {/* Expand/Collapse button for parent categories */}
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategoryExpansion(category.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            )}

            {/* Checkbox */}
            <Checkbox
              id={`category-${category.id}`}
              checked={isSelected}
              onCheckedChange={() => handleCategoryToggle(category.id)}
            />

            {/* Category info */}
            <div className="flex items-center gap-2 flex-1">
              {category.icon && (
                <span className="text-lg">{category.icon}</span>
              )}
              <div className="flex-1">
                <Label
                  htmlFor={`category-${category.id}`}
                  className="font-medium cursor-pointer"
                >
                  {category.name}
                </Label>
                {category.description && (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {/* Status badge */}
            {!category.is_active && (
              <Badge variant="secondary" className="text-xs">
                Inactiva
              </Badge>
            )}
          </div>

          {/* Children categories (accordion style) */}
          {hasChildren && isExpanded && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              {renderCategoryTree(category.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const handleSubmitTemplate = async () => {
    try {
      const template = await createProductTemplate(templateData);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Crear Template de Producto
                </h1>
                <p className="text-muted-foreground">
                  Información básica del producto
                </p>
              </div>
            </div>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/admin">
                <X className="h-4 w-4" />
                Cancelar
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
              <CardDescription>
                Datos básicos del template del producto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={templateData.name}
                    onChange={(e) =>
                      setTemplateData({
                        ...templateData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Ej: Sofá Moderno"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={templateData.slug}
                    onChange={(e) =>
                      setTemplateData({
                        ...templateData,
                        slug: e.target.value,
                      })
                    }
                    placeholder="sofa-moderno"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Descripción Corta *</Label>
                <Input
                  id="short_description"
                  value={templateData.short_description}
                  onChange={(e) =>
                    setTemplateData({
                      ...templateData,
                      short_description: e.target.value,
                    })
                  }
                  placeholder="Descripción breve del producto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción Completa *</Label>
                <Textarea
                  id="description"
                  value={templateData.description}
                  onChange={(e) =>
                    setTemplateData({
                      ...templateData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descripción detallada del producto"
                  rows={5}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-base font-medium">
                    Categorías del Producto *
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Selecciona las categorías donde aparecerá este producto
                  </p>
                  {loadingCategories ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-sm text-muted-foreground">
                        Cargando categorías...
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border rounded-lg max-h-80 overflow-y-auto bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="p-3">
                          {renderCategoryTree(categories)}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedCategories.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Categorías seleccionadas ({selectedCategories.length}
                        ):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((categoryId) => {
                          const findCategoryName = (
                            cats: Category[]
                          ): string => {
                            for (const cat of cats) {
                              if (parseInt(cat.id) === categoryId)
                                return cat.name;
                              if (cat.children) {
                                const found = findCategoryName(cat.children);
                                if (found) return found;
                              }
                            }
                            return '';
                          };
                          const categoryName = findCategoryName(categories);
                          return (
                            <Badge key={categoryId} variant="secondary">
                              {categoryName}
                              <button
                                type="button"
                                // onClick={() =>
                                //   handleCategoryToggle(categoryId.toString())
                                // }
                                className="ml-2 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Section */}
              <div className="border-t pt-6 space-y-6">
                <h3 className="text-lg font-semibold">SEO (Opcional)</h3>

                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={templateData.meta_title}
                    onChange={(e) =>
                      setTemplateData({
                        ...templateData,
                        meta_title: e.target.value,
                      })
                    }
                    placeholder="Título para motores de búsqueda"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={templateData.meta_description}
                    onChange={(e) =>
                      setTemplateData({
                        ...templateData,
                        meta_description: e.target.value,
                      })
                    }
                    placeholder="Descripción para motores de búsqueda"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={templateData.meta_keywords}
                    onChange={(e) =>
                      setTemplateData({
                        ...templateData,
                        meta_keywords: e.target.value,
                      })
                    }
                    placeholder="palabras, clave, separadas, por, comas"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={templateData.is_active}
                  onCheckedChange={(checked) =>
                    setTemplateData({
                      ...templateData,
                      is_active: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="is_active">Producto activo</Label>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSubmitTemplate} size="lg">
                  Crear Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
