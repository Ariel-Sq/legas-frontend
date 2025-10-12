'use client';

import type React from 'react';
import { useState, useOptimistic, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, ChevronRight, ChevronDown, Edit, Trash2 } from 'lucide-react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
  type CategoryFormData,
} from '@/lib/categories-admin';
import { flattenCategories } from '@/utils';

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const [optimisticCategories, addOptimisticCategory] = useOptimistic(
    categories,
    (state, newCategory: Category) => [...state, newCategory]
  );

  // Helper function to recursively remove a category from the tree
  const removeCategoryFromTree = (
    tree: Category[],
    categoryId: string
  ): Category[] => {
    return tree
      .filter((cat) => cat.id !== categoryId)
      .map((cat) => ({
        ...cat,
        children: cat.children
          ? removeCategoryFromTree(cat.children, categoryId)
          : [],
      }));
  };

  const [optimisticDelete, removeOptimisticCategory] = useOptimistic(
    categories,
    (state, categoryId: string) => removeCategoryFromTree(state, categoryId)
  );

  // Helper function to recursively update a category in the tree
  const updateCategoryInTree = (
    tree: Category[],
    categoryId: string,
    updatedData: Partial<Category>
  ): Category[] => {
    return tree.map((cat) => {
      if (cat.id === categoryId) {
        return { ...cat, ...updatedData };
      }
      if (cat.children) {
        return {
          ...cat,
          children: updateCategoryInTree(cat.children, categoryId, updatedData),
        };
      }
      return cat;
    });
  };

  const [optimisticUpdate, updateOptimisticCategory] = useOptimistic(
    categories,
    (
      state,
      {
        categoryId,
        updatedData,
      }: { categoryId: string; updatedData: Partial<Category> }
    ) => updateCategoryInTree(state, categoryId, updatedData)
  );

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parentId: null,
    image: '',
    icon: '',
    is_active: true,
    meta_title: '',
    meta_description: '',
  });

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId,
      image: category.image || '',
      icon: category.icon || '',
      is_active: category.is_active,
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    startTransition(async () => {
      setError('');

      // Add optimistic update
      removeOptimisticCategory(categoryId);

      try {
        await deleteCategory(categoryId);
        await loadCategories(); // Refresh with real data
      } catch (err) {
        setError('Failed to delete category. Please try again.');
        console.error(err);
        // Optimistic update will be automatically reverted
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    startTransition(async () => {
      setError('');

      try {
        if (editingCategory) {
          // Calculate only changed fields for PATCH request
          const changedFields: Partial<CategoryFormData> = {};
          const originalData = {
            name: editingCategory.name,
            slug: editingCategory.slug,
            description: editingCategory.description || '',
            parentId: editingCategory.parentId,
            image: editingCategory.image || '',
            icon: editingCategory.icon || '',
            is_active: editingCategory.is_active,
            meta_title: editingCategory.meta_title || '',
            meta_description: editingCategory.meta_description || '',
          };

          Object.keys(formData).forEach((key) => {
            const formKey = key as keyof CategoryFormData;
            if (formData[formKey] !== originalData[formKey]) {
              (changedFields as any)[formKey] = formData[formKey];
            }
          });

          // Update existing category with only changed fields
          const updatedCategory = await updateCategory(
            editingCategory.id,
            changedFields
          );
          // Optimistic update for update
          updateOptimisticCategory({
            categoryId: editingCategory.id,
            updatedData: updatedCategory,
          });
          setEditingCategory(null);
        } else {
          // Create new category
          const newCategory = await createCategory(formData);
          // Optimistic update for creation
          addOptimisticCategory(newCategory);
        }

        await loadCategories(); // Refresh with real data
        setShowForm(false);
        // Reset form
        setFormData({
          name: '',
          slug: '',
          description: '',
          parentId: null,
          image: '',
          icon: '',
          is_active: true,
          meta_title: '',
          meta_description: '',
        });
      } catch (err) {
        setError(
          `Failed to ${editingCategory ? 'update' : 'create'} category. Please try again.`
        );
        console.error(err);
      }
    });
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    });
  };

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

  // Since getCategories now returns tree structure directly, use it as is
  const categoryTree = editingCategory ? optimisticUpdate : optimisticDelete;

  const renderCategoryTree = (
    cats: (Category & { children?: Category[] })[],
    depth = 0
  ) => {
    return cats.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategories.has(category.id);

      return (
        <div key={category.id}>
          <div
            className="group flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            style={{ paddingLeft: `${depth * 20 + 16}px` }}
            onClick={() => toggleCategoryExpansion(category.id)}
          >
            {/* Expand/Collapse Button */}
            {hasChildren ? (
              <button
                onClick={() => toggleCategoryExpansion(category.id)}
                className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={
                  isExpanded ? 'Contraer categoría' : 'Expandir categoría'
                }
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            {/* Icon */}
            {category.icon && (
              <span className="text-lg flex-shrink-0">{category.icon}</span>
            )}

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white truncate">
                  {category.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {category.slug}
                </span>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {category.description}
                </p>
              )}
            </div>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                category.is_active
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {category.is_active ? 'Activa' : 'Inactiva'}
            </span>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(category);
                }}
                className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Editar categoría"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(category.id);
                }}
                className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                aria-label="Eliminar categoría"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div className="ml-4 border-l border-gray-200 dark:border-gray-700">
              {renderCategoryTree(category.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Categorías
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gestiona la estructura de categorías de productos
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingCategory(null);
              setShowForm(!showForm);
              if (!showForm) {
                setFormData({
                  name: '',
                  slug: '',
                  description: '',
                  parentId: null,
                  image: '',
                  icon: '',
                  is_active: true,
                  meta_title: '',
                  meta_description: '',
                });
              }
            }}
            disabled={isPending}
            className="hover:cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-5">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Nombre *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                        disabled={isPending}
                        className="mt-1"
                        placeholder="Ej: Muebles de Sala"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="slug"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Slug *
                      </Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        required
                        disabled={isPending}
                        className="mt-1"
                        placeholder="muebles-de-sala"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Descripción
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        disabled={isPending}
                        className="mt-1"
                        placeholder="Describe la categoría..."
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="parent"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Categoría Padre
                      </Label>
                      <Select
                        value={formData.parentId || 'none'}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            parentId: value === 'none' ? null : value,
                          })
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleccionar categoría padre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            Sin categoría padre (Raíz)
                          </SelectItem>
                          {flattenCategories(categories).map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {'  '.repeat(cat.level || 1)}
                              {cat.icon} {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Media & SEO */}
                  <div className="space-y-5">
                    <div>
                      <Label
                        htmlFor="image"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        URL de Imagen
                      </Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image: e.target.value,
                          })
                        }
                        placeholder="/placeholder.svg?height=100&width=100"
                        disabled={isPending}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="icon"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Icono (Emoji)
                      </Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                        placeholder="🪑"
                        disabled={isPending}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="meta_title"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Meta Título (SEO)
                      </Label>
                      <Input
                        id="meta_title"
                        value={formData.meta_title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_title: e.target.value,
                          })
                        }
                        disabled={isPending}
                        className="mt-1"
                        placeholder="Título para motores de búsqueda"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="meta_description"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Meta Descripción (SEO)
                      </Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_description: e.target.value,
                          })
                        }
                        rows={2}
                        disabled={isPending}
                        className="mt-1"
                        placeholder="Descripción para motores de búsqueda"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            is_active: checked as boolean,
                          })
                        }
                        disabled={isPending}
                      />
                      <Label
                        htmlFor="is_active"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Categoría Activa
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="hover:cursor-pointer"
                  >
                    {isPending
                      ? editingCategory
                        ? 'Actualizando...'
                        : 'Creando...'
                      : editingCategory
                        ? 'Actualizar Categoría'
                        : 'Crear Categoría'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCategory(null);
                    }}
                    disabled={isPending}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Categorías ({optimisticDelete.length})
              </h2>
            </div>
          </div>
          <div className="p-6">
            {optimisticDelete.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <Plus className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  No hay categorías creadas aún
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Crea tu primera categoría para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {renderCategoryTree(categoryTree)}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
