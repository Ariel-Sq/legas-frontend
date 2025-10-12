'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Footer } from '@/components/footer';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ChevronRight, Edit, Trash2 } from 'lucide-react';
import {
  getCategories,
  createCategory,
  buildCategoryTree,
  type Category,
  type CategoryFormData,
} from '@/lib/categories-admin';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/user';

export default function CategoriesAdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parent_id: null,
    image_url: '',
    icon: '',
    is_active: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  useEffect(() => {
    // Check if user is admin
    getUser().then((user) => {
      if (!user?.isAdmin) {
        router.push('/');
      }
    });

    // Load categories
    loadCategories();
  }, [router]);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory(formData);
    await loadCategories();
    setShowForm(false);
    // Reset form
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: null,
      image_url: '',
      icon: '',
      is_active: true,
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    });
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    });
  };

  const categoryTree = buildCategoryTree(categories);

  const renderCategoryTree = (
    cats: (Category & { children?: Category[] })[],
    depth = 0
  ) => {
    return cats.map((category) => (
      <div key={category.id}>
        <div
          className="flex items-center gap-2 p-3 hover:bg-accent rounded-lg cursor-pointer"
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
        >
          {category.children && category.children.length > 0 && (
            <ChevronRight className="h-4 w-4" />
          )}
          {category.icon && <span className="text-xl">{category.icon}</span>}
          <span className="flex-1 font-medium">{category.name}</span>
          <span className="text-sm text-muted-foreground">{category.slug}</span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              category.is_active
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            {category.is_active ? 'Activa' : 'Inactiva'}
          </span>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {category.children &&
          category.children.length > 0 &&
          renderCategoryTree(category.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
            <p className="text-muted-foreground mt-2">
              Administra las categorías de productos
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Crear Nueva Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción</Label>
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
                      />
                    </div>

                    <div>
                      <Label htmlFor="parent">Categoría Padre</Label>
                      <Select
                        value={formData.parent_id?.toString() || 'none'}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            parent_id: value === 'none' ? null : Number(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sin categoría padre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            Sin categoría padre (Raíz)
                          </SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {'  '.repeat(cat.level)}
                              {cat.icon} {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Media & SEO */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image_url">URL de Imagen</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image_url: e.target.value,
                          })
                        }
                        placeholder="/placeholder.svg?height=100&width=100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="icon">Icono (Emoji)</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                        placeholder="🪑"
                      />
                    </div>

                    <div>
                      <Label htmlFor="meta_title">Meta Título (SEO)</Label>
                      <Input
                        id="meta_title"
                        value={formData.meta_title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="meta_description">
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
                      />
                    </div>

                    <div>
                      <Label htmlFor="meta_keywords">Meta Keywords (SEO)</Label>
                      <Input
                        id="meta_keywords"
                        value={formData.meta_keywords}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_keywords: e.target.value,
                          })
                        }
                        placeholder="palabra1, palabra2, palabra3"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_active: checked })
                        }
                      />
                      <Label htmlFor="is_active">Categoría Activa</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Crear Categoría</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías Existentes ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay categorías creadas aún
              </p>
            ) : (
              <div className="space-y-1">
                {renderCategoryTree(categoryTree)}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
