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
import {
  ArrowLeft,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  type ProductTemplateFormData,
  updateProductTemplate,
} from '@/lib/products-admin';
import { getCategories, type Category } from '@/lib/categories-admin';
import { getProductTemplateById, type ProductTemplate } from '@/lib/products';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [specifications, setSpecifications] = useState<
    Array<{ id: string; key: string; value: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Product Template
  const [templateData, setTemplateData] = useState<ProductTemplateFormData>({
    name: '',
    slug: '',
    description: '',
    category_ids: [],
    specifications: {},
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

  // Load template data for editing
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) return;

      try {
        const template = await getProductTemplateById(templateId);
        if (template) {
          setTemplateData({
            name: template.name,
            slug: template.slug,
            description: template.description || '',
            category_ids: template.categories.map((cat) => cat.id),
            specifications: template.specifications || {},
            is_active: template.is_active,
          });
          setSelectedCategories(template.categories.map((cat) => cat.id));
          // Convert specifications object to array format for editing
          const specsArray = template.specifications
            ? Object.entries(template.specifications).map(([key, value]) => ({
                id: `spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${key}`,
                key,
                value: String(value),
              }))
            : [];
          setSpecifications(specsArray);
        }
      } catch (error) {
        console.error('Error loading template:', error);
        setError('Error loading template data');
      } finally {
        setLoadingTemplate(false);
      }
    };
    loadTemplate();
  }, [templateId]);

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

  // Helper function to find a category by ID in the tree
  const findCategoryById = (
    categoryId: string,
    categories: Category[]
  ): Category | null => {
    for (const category of categories) {
      if (category.id === categoryId) return category;
      if (category.children) {
        const found = findCategoryById(categoryId, category.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to get all parent IDs of a category
  const getParentIds = (
    categoryId: string,
    categories: Category[]
  ): string[] => {
    const parents: string[] = [];
    const category = findCategoryById(categoryId, categories);

    if (category?.parentId) {
      parents.push(category.parentId);
      // Recursively get grandparents
      const grandparents = getParentIds(category.parentId, categories);
      parents.push(...grandparents);
    }

    return parents;
  };

  // Helper function to get all children in the same branch as a category
  const getChildrenInBranch = (
    categoryId: string,
    categories: Category[]
  ): string[] => {
    const category = findCategoryById(categoryId, categories);
    if (!category) return [];

    const children: string[] = [];

    // If this category has children, get all descendants in this branch
    if (category.children) {
      const getAllDescendants = (cats: Category[]): string[] => {
        const descendants: string[] = [];
        for (const cat of cats) {
          descendants.push(cat.id);
          if (cat.children) {
            descendants.push(...getAllDescendants(cat.children));
          }
        }
        return descendants;
      };
      children.push(...getAllDescendants(category.children));
    }

    return children;
  };

  // Category selection handlers with hierarchical logic
  const handleCategoryToggle = (
    categoryId: string,
    event?: React.MouseEvent
  ) => {
    // Prevent accordion toggle when clicking checkbox
    if (event) {
      event.stopPropagation();
    }

    setSelectedCategories((prev) => {
      const isCurrentlySelected = prev.includes(categoryId);
      const category = findCategoryById(categoryId, categories);

      if (isCurrentlySelected) {
        // Deselecting a category
        let newSelection = prev.filter((id) => id !== categoryId);

        // Check if parents should remain selected
        const parentIds = getParentIds(categoryId, categories);
        for (const parentId of parentIds) {
          const parent = findCategoryById(parentId, categories);
          if (parent?.children) {
            // Check if parent has other selected children
            const hasOtherSelectedChildren = parent.children.some(
              (child) =>
                newSelection.includes(child.id) ||
                child.children?.some((grandchild) =>
                  newSelection.includes(grandchild.id)
                )
            );
            if (!hasOtherSelectedChildren) {
              newSelection = newSelection.filter((id) => id !== parentId);
            }
          }
        }

        return newSelection;
      } else {
        // Selecting a category
        let newSelection = [...prev];

        // Get all categories in the same branch (including descendants)
        const branchCategories = getChildrenInBranch(categoryId, categories);

        // Remove all categories in the same branch from selection
        newSelection = newSelection.filter(
          (id) => !branchCategories.includes(id) && id !== categoryId
        );

        // Add the selected category
        newSelection.push(categoryId);

        // Add all parents
        const parentIds = getParentIds(categoryId, categories);
        newSelection.push(
          ...parentIds.filter((id) => !newSelection.includes(id))
        );

        return newSelection;
      }
    });

    setTemplateData((prev) => {
      const isCurrentlySelected = prev.category_ids.includes(categoryId);
      const category = findCategoryById(categoryId, categories);

      if (isCurrentlySelected) {
        // Deselecting a category
        let newCategoryIds = prev.category_ids.filter(
          (id) => id !== categoryId
        );

        // Check if parents should remain selected
        const parentIds = getParentIds(categoryId, categories);
        for (const parentId of parentIds) {
          const parent = findCategoryById(parentId, categories);
          if (parent?.children) {
            // Check if parent has other selected children
            const hasOtherSelectedChildren = parent.children.some(
              (child) =>
                newCategoryIds.includes(child.id) ||
                child.children?.some((grandchild) =>
                  newCategoryIds.includes(grandchild.id)
                )
            );
            if (!hasOtherSelectedChildren) {
              newCategoryIds = newCategoryIds.filter((id) => id !== parentId);
            }
          }
        }

        return { ...prev, category_ids: newCategoryIds };
      } else {
        // Selecting a category
        let newCategoryIds = [...prev.category_ids];

        // Get all categories in the same branch (including descendants)
        const branchCategories = getChildrenInBranch(categoryId, categories);

        // Remove all categories in the same branch from selection
        newCategoryIds = newCategoryIds.filter(
          (id) => !branchCategories.includes(id) && id !== categoryId
        );

        // Add the selected category
        newCategoryIds.push(categoryId);

        // Add all parents
        const parentIds = getParentIds(categoryId, categories);
        newCategoryIds.push(
          ...parentIds.filter((id) => !newCategoryIds.includes(id))
        );

        return { ...prev, category_ids: newCategoryIds };
      }
    });
  };

  const renderCategoryTree = (cats: Category[], depth = 0) => {
    return cats.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isSelected = selectedCategories.includes(category.id);
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
              onCheckedChange={(checked) => {
                const event = { stopPropagation: () => {} } as React.MouseEvent;
                handleCategoryToggle(category.id, event);
              }}
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

  // Specifications management
  const addSpecification = () => {
    const newId = `spec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSpecifications((prev) => [...prev, { id: newId, key: '', value: '' }]);
  };

  const removeSpecification = (id: string) => {
    setSpecifications((prev) => prev.filter((spec) => spec.id !== id));
  };

  const updateSpecification = (
    id: string,
    field: 'key' | 'value',
    newValue: string
  ) => {
    setSpecifications((prev) =>
      prev.map((spec) =>
        spec.id === id ? { ...spec, [field]: newValue } : spec
      )
    );
  };

  // Update templateData when specifications change
  useEffect(() => {
    const specsObject = specifications.reduce(
      (acc, spec) => {
        if (spec.key.trim()) {
          acc[spec.key] = spec.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
    setTemplateData((prev) => ({
      ...prev,
      specifications: specsObject,
    }));
  }, [specifications]);

  const handleSubmitTemplate = async () => {
    if (!templateId) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Calculate only changed fields for PATCH request (like Categories implementation)
      const originalTemplate = await getProductTemplateById(templateId);
      if (!originalTemplate) {
        throw new Error('Template not found');
      }

      const changedFields: Partial<ProductTemplateFormData> = {};
      const originalData = {
        name: originalTemplate.name,
        slug: originalTemplate.slug,
        description: originalTemplate.description || '',
        category_ids: originalTemplate.categories.map((cat) => cat.id),
        specifications: originalTemplate.specifications || {},
        is_active: originalTemplate.is_active,
      };

      Object.keys(templateData).forEach((key) => {
        const formKey = key as keyof ProductTemplateFormData;
        if (
          JSON.stringify(templateData[formKey]) !==
          JSON.stringify(originalData[formKey])
        ) {
          (changedFields as any)[formKey] = templateData[formKey];
        }
      });

      await updateProductTemplate(templateId, changedFields);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating template:', error);
      setError('Error updating template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingTemplate) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-muted-foreground">
                Cargando template...
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/products">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Editar Template de Producto
                </h1>
                <p className="text-muted-foreground">
                  Modificar información del template del producto
                </p>
              </div>
            </div>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/admin/products">
                <X className="h-4 w-4" />
                Cancelar
              </Link>
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
              <CardDescription>
                Modificar los datos básicos del template del producto
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
                <Label htmlFor="description">Descripción *</Label>
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
                    Modificar las categorías donde aparecerá este producto
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
                              if (cat.id === categoryId) return cat.name;
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

              {/* Specifications Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Especificaciones del Producto
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSpecification}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Especificación
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Modifica las características técnicas del producto (material,
                  dimensiones, color, etc.)
                </p>

                {specifications.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-gray-400 dark:text-gray-500 mb-2">
                      <Plus className="h-8 w-8 mx-auto" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      No hay especificaciones agregadas
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Haz clic en "Agregar Especificación" para comenzar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {specifications.map((spec) => (
                      <div key={spec.id} className="flex gap-3 items-center">
                        <div className="flex-1">
                          <Input
                            placeholder="Nombre de la especificación (ej: Material)"
                            value={spec.key}
                            onChange={(e) =>
                              updateSpecification(
                                spec.id,
                                'key',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="Valor (ej: Madera de roble)"
                            value={spec.value}
                            onChange={(e) =>
                              updateSpecification(
                                spec.id,
                                'value',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeSpecification(spec.id)}
                          className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
                <Button
                  onClick={handleSubmitTemplate}
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
