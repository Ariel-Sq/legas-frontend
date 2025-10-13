'use client';

import { useState, useEffect, useOptimistic, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Package,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { getProductTemplates, type ProductTemplate } from '@/lib/products';
import { deleteProductTemplate } from '@/lib/products-admin';

export default function ProductsPage() {
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [optimisticTemplates, removeOptimisticTemplate] = useOptimistic(
    templates,
    (state, templateId: string) => state.filter((t) => t.id !== templateId)
  );

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await getProductTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await getProductTemplates();
    setTemplates(data);
  };

  const handleDelete = async (templateId: string) => {
    startTransition(async () => {
      setError('');

      // Add optimistic update
      removeOptimisticTemplate(templateId);

      try {
        await deleteProductTemplate(templateId);
        await loadTemplates(); // Refresh with real data
      } catch (err) {
        setError('Failed to delete template. Please try again.');
        console.error(err);
        // Optimistic update will be automatically reverted
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-muted-foreground">
                Cargando productos...
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
            <div>
              <h1 className="text-4xl font-bold mb-2">Productos</h1>
              <p className="text-muted-foreground">
                Gestiona los templates y variaciones de productos
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Template
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/products/variations/new">
                  <Layers className="h-4 w-4 mr-2" />
                  Crear Variaciones
                </Link>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Templates List */}
          {optimisticTemplates.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Templates de Productos (0)
                </h2>
              </div>
              <div className="flex flex-col items-center justify-center p-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No hay productos aún
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  Comienza creando tu primer template de producto para definir
                  las características básicas.
                </p>
                <Button asChild>
                  <Link href="/admin/products/new">Crear Primer Template</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Templates de Productos ({optimisticTemplates.length})
                  </h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {optimisticTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                            {template.name}
                          </h3>
                          <Badge
                            variant={
                              template.is_active ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {template.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {template.description || 'Sin descripción'}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {template.slug}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Layers className="h-4 w-4" />
                            <span>
                              {template.variations?.length || 0} variaciones
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">
                              Creado:{' '}
                              {new Date(
                                template.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="gap-2"
                        >
                          <Link
                            href={`/admin/products/${template.id}/variations`}
                          >
                            <Layers className="h-4 w-4" />
                            Variaciones
                          </Link>
                        </Button>
                        <Button size="sm" asChild className="gap-2">
                          <Link href={`/admin/products/${template.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            Editar
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/products/${template.id}/edit`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Template
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Layers className="h-4 w-4 mr-2" />
                              Ver Variaciones
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(template.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
