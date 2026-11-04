'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  createVariation,
  deleteImage,
  deleteProduct,
  setMainImage,
  updateProduct,
  updateVariation,
  uploadVariationImage,
  type AdminCategory,
  type AdminProduct,
  type AdminVariation,
} from '@/lib/admin-api';

const money = (value: string | number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value));

interface VariationDraft {
  name: string;
  price: string;
  isActive: boolean;
}

function toDraft(variation: AdminVariation): VariationDraft {
  return {
    name: variation.name,
    price: String(Number(variation.price)),
    isActive: variation.is_active,
  };
}

export function ProductEditor({
  product,
  categories,
}: {
  product: AdminProduct;
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Product fields
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? '');
  const [isActive, setIsActive] = useState(product.is_active);
  const [isFeatured, setIsFeatured] = useState(product.is_featured);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product.categories.map((c) => c.id)
  );

  // Variation fields — edited locally and saved with the main button.
  const [drafts, setDrafts] = useState<Record<string, VariationDraft>>(() =>
    Object.fromEntries(product.variations.map((v) => [v.id, toDraft(v)]))
  );

  // New variation form
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newMedida, setNewMedida] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const updateDraft = (id: string, patch: Partial<VariationDraft>) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const hasVariationChanges = product.variations.some((variation) => {
    const draft = drafts[variation.id];
    if (!draft) return false;
    return (
      draft.name !== variation.name ||
      Number(draft.price) !== Number(variation.price) ||
      draft.isActive !== variation.is_active
    );
  });

  const saveAll = () => {
    startTransition(async () => {
      try {
        await updateProduct(product.id, {
          name,
          description,
          is_active: isActive,
          is_featured: isFeatured,
          categoryIds: selectedCategories,
        });

        const changed = product.variations.filter((variation) => {
          const draft = drafts[variation.id];
          if (!draft) return false;
          return (
            draft.name !== variation.name ||
            Number(draft.price) !== Number(variation.price) ||
            draft.isActive !== variation.is_active
          );
        });

        for (const variation of changed) {
          const draft = drafts[variation.id];
          await updateVariation(variation.id, {
            name: draft.name,
            price: Number(draft.price),
            is_active: draft.isActive,
          });
        }

        toast.success('Cambios guardados');
        router.push('/admin');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'No se pudo guardar'
        );
      }
    });
  };

  const uploadImage = (variationId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    startTransition(async () => {
      try {
        await uploadVariationImage(variationId, formData);
        toast.success('Foto subida');
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo subir');
      }
    });
  };

  const makeMain = (imageId: string) => {
    startTransition(async () => {
      try {
        await setMainImage(imageId, product.id);
        toast.success('Foto principal actualizada');
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo cambiar');
      }
    });
  };

  const removeImage = (imageId: string) => {
    startTransition(async () => {
      try {
        await deleteImage(imageId, product.id);
        toast.success('Foto eliminada');
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo borrar');
      }
    });
  };

  const addVariation = () => {
    const price = Number(newPrice);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error('Poné un precio válido');
      return;
    }
    startTransition(async () => {
      try {
        await createVariation(product.id, {
          medida: newMedida.trim(),
          price,
        });
        toast.success('Variante creada');
        setNewMedida('');
        setNewPrice('');
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'No se pudo crear'
        );
      }
    });
  };

  return (
    <div className="space-y-8 pb-28">
      {/* Product data */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Datos del producto</h2>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Incluye el bloque &ldquo;INFORMACION IMPORTANTE&rdquo; tal como se
              muestra en la ficha.
            </p>
          </div>
          <div>
            <Label>Categorías</Label>
            <div className="mt-2 flex flex-wrap gap-4">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      setSelectedCategories((prev) =>
                        checked === true
                          ? [...prev, category.id]
                          : prev.filter((id) => id !== category.id)
                      )
                    }
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isActive}
                onCheckedChange={(v) => setIsActive(v === true)}
              />
              Visible en la tienda
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isFeatured}
                onCheckedChange={(v) => setIsFeatured(v === true)}
              />
              Destacado en la home
            </label>
          </div>
        </div>
      </section>

      {/* Variations */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Variantes y precios</h2>
        <div className="space-y-6">
          {product.variations.map((variation, index) => {
            const draft = drafts[variation.id] ?? toDraft(variation);
            return (
              <div
                key={variation.id}
                className="rounded-lg border p-4"
                id={`variation-${variation.id}`}
              >
                <div className="grid gap-3 sm:grid-cols-[1fr_140px_100px_auto] sm:items-end">
                  <div>
                    <Label htmlFor={`vname-${variation.id}`}>Nombre</Label>
                    <Input
                      id={`vname-${variation.id}`}
                      value={draft.name}
                      onChange={(e) =>
                        updateDraft(variation.id, { name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`price-${variation.id}`}>
                      Precio (efectivo)
                    </Label>
                    <Input
                      id={`price-${variation.id}`}
                      type="number"
                      value={draft.price}
                      onChange={(e) =>
                        updateDraft(variation.id, { price: e.target.value })
                      }
                    />
                  </div>
                  <label className="flex items-center gap-2 pb-2 text-sm">
                    <Checkbox
                      checked={draft.isActive}
                      onCheckedChange={(v) =>
                        updateDraft(variation.id, { isActive: v === true })
                      }
                    />
                    Activa
                  </label>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  SKU {variation.sku} · con tarjeta:{' '}
                  {money(Number(draft.price || 0) * 1.15)}
                </p>

                {/* Images */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Fotos ({variation.images.length})
                    </span>
                    <label
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                        variation.images.length >= 6
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer hover:bg-muted'
                      }`}
                    >
                      {variation.images.length >= 6 ? 'Máximo 6 fotos' : 'Subir foto'}
                      <input
                        type="file"
                        accept="image/webp,image/jpeg,image/png"
                        className="hidden"
                        disabled={variation.images.length >= 6}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(variation.id, file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {variation.images.map((image) => (
                      <div key={image.id} className="w-28">
                        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt={image.altText ?? ''}
                            className="h-full w-full object-cover"
                          />
                          {image.isMain && (
                            <span className="absolute left-1 top-1 rounded bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                              principal
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex justify-between text-[11px]">
                          {!image.isMain && (
                            <button
                              onClick={() => makeMain(image.id)}
                              className="text-primary hover:underline"
                            >
                              Principal
                            </button>
                          )}
                          <button
                            onClick={() => removeImage(image.id)}
                            className="text-destructive hover:underline"
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    ))}
                    {variation.images.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Sin fotos todavía.
                      </p>
                    )}
                  </div>
                </div>
                {index < product.variations.length - 1 && (
                  <hr className="mt-6" />
                )}
              </div>
            );
          })}

          {/* New variation */}
          <div className="rounded-lg border border-dashed p-4">
            <p className="mb-3 text-sm font-medium">Agregar variante</p>
            <div className="grid gap-3 sm:grid-cols-[1fr_140px_100px_auto] sm:items-end">
              <div>
                <Label htmlFor="new-medida">Medida</Label>
                <Input
                  id="new-medida"
                  placeholder="100x60 o 100x60x40"
                  value={newMedida}
                  onChange={(e) => setNewMedida(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="new-price">Precio (efectivo)</Label>
                <Input
                  id="new-price"
                  type="number"
                  placeholder="399000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
              <Button
                type="button"
                disabled={pending || !newMedida.trim() || !newPrice}
                onClick={addVariation}
              >
                Agregar
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Se guarda al instante (el SKU y el nombre se generan solos). Los
              demás cambios se guardan con el botón de abajo.
            </p>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-lg font-semibold text-destructive">
          Eliminar producto
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Se borra el producto con sus variantes y fotos. Los pedidos ya hechos
          no se modifican.
        </p>
        <div className="mt-3">
          {confirmDelete ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">¿Seguro?</span>
              <Button
                variant="destructive"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    try {
                      await deleteProduct(product.id);
                      toast.success('Producto eliminado');
                      router.push('/admin');
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : 'No se pudo eliminar'
                      );
                    }
                  })
                }
              >
                Sí, eliminar
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(false)}
                disabled={pending}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              Eliminar este producto
            </Button>
          )}
        </div>
      </section>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {hasVariationChanges
              ? 'Hay cambios sin guardar en las variantes'
              : 'Los cambios de fotos y variantes nuevas se guardan al instante'}
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
              disabled={pending}
            >
              Volver sin guardar
            </Button>
            <Button onClick={saveAll} disabled={pending}>
              {pending ? 'Guardando…' : 'Guardar y volver al panel'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
