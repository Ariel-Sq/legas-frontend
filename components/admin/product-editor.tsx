'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  deleteImage,
  setMainImage,
  updateProduct,
  updateVariation,
  uploadVariationImage,
  type AdminCategory,
  type AdminProduct,
} from '@/lib/admin-api';

const money = (value: string | number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value));

export function ProductEditor({
  product,
  categories,
  imageBase,
}: {
  product: AdminProduct;
  categories: AdminCategory[];
  /** Backend origin, so relative /api/images?path= URLs resolve. */
  imageBase: string;
}) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? '');
  const [isActive, setIsActive] = useState(product.is_active);
  const [isFeatured, setIsFeatured] = useState(product.is_featured);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product.categories.map((c) => c.id)
  );
  const [variations, setVariations] = useState(product.variations);

  const saveProduct = () => {
    startTransition(async () => {
      try {
        await updateProduct(product.id, {
          name,
          description,
          is_active: isActive,
          is_featured: isFeatured,
          categoryIds: selectedCategories,
        });
        toast.success('Producto guardado');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo guardar');
      }
    });
  };

  const saveVariation = (
    id: string,
    data: { name?: string; price?: number; stock?: number; is_active?: boolean }
  ) => {
    startTransition(async () => {
      try {
        await updateVariation(id, data);
        toast.success('Variante guardada');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo guardar');
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
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo borrar');
      }
    });
  };

  return (
    <div className="space-y-8">
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
          <div>
            <Button onClick={saveProduct} disabled={pending}>
              Guardar producto
            </Button>
          </div>
        </div>
      </section>

      {/* Variations */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Variantes y precios</h2>
        <div className="space-y-6">
          {variations.map((variation, index) => (
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
                    defaultValue={variation.name}
                    onBlur={(e) =>
                      e.target.value !== variation.name &&
                      saveVariation(variation.id, { name: e.target.value })
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
                    defaultValue={Number(variation.price)}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isFinite(value) && value !== Number(variation.price)) {
                        saveVariation(variation.id, { price: value });
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor={`stock-${variation.id}`}>Stock</Label>
                  <Input
                    id={`stock-${variation.id}`}
                    type="number"
                    defaultValue={variation.stock}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isFinite(value) && value !== variation.stock) {
                        saveVariation(variation.id, { stock: value });
                      }
                    }}
                  />
                </div>
                <label className="flex items-center gap-2 pb-2 text-sm">
                  <Checkbox
                    checked={variation.is_active}
                    onCheckedChange={(v) =>
                      saveVariation(variation.id, { is_active: v === true })
                    }
                  />
                  Activa
                </label>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                SKU {variation.sku} · con tarjeta: {money(Number(variation.price) * 1.15)}
              </p>

              {/* Images */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Fotos ({variation.images.length})
                  </span>
                  <label className="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                    Subir foto
                    <input
                      type="file"
                      accept="image/webp,image/jpeg,image/png"
                      className="hidden"
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
                          src={
                            image.url?.startsWith('http')
                              ? image.url
                              : `${imageBase}${image.url}`
                          }
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
              {index < variations.length - 1 && <hr className="mt-6" />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
