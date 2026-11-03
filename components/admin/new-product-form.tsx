'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { createProduct, type AdminCategory } from '@/lib/admin-api';

export function NewProductForm({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const canSave = name.trim().length >= 3 && selected.length > 0;

  const save = () => {
    startTransition(async () => {
      try {
        const created = await createProduct({
          name: name.trim(),
          description: description.trim() || undefined,
          categoryIds: selected,
          is_active: isActive,
          is_featured: isFeatured,
        });
        toast.success('Producto creado. Ahora agregá las variantes y las fotos.');
        router.push(`/admin/products/${created.id}`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'No se pudo crear el producto'
        );
      }
    });
  };

  return (
    <div className="max-w-2xl space-y-6 rounded-xl border bg-card p-6">
      <div>
        <Label htmlFor="new-name">
          Nombre <span className="text-destructive">*</span>
        </Label>
        <Input
          id="new-name"
          placeholder="Mesa auxiliar de álamo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          El slug (URL) se genera solo a partir del nombre.
        </p>
      </div>

      <div>
        <Label>
          Categorías <span className="text-destructive">*</span>
        </Label>
        <div className="mt-2 flex flex-wrap gap-4">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 text-sm"
            >
              <Checkbox
                checked={selected.includes(category.id)}
                onCheckedChange={(checked) =>
                  setSelected((prev) =>
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

      <div>
        <Label htmlFor="new-description">Descripción (opcional)</Label>
        <Textarea
          id="new-description"
          rows={6}
          placeholder="La descripción principal y el bloque INFORMACION IMPORTANTE se pueden completar después, en el editor."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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

      <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
        El producto se crea sin variantes. Al guardar te llevo al editor para
        que agregues las medidas, precios y fotos. Hasta que no tenga al menos
        una variante activa, no se muestra en la tienda.
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.push('/admin')}>
          Cancelar
        </Button>
        <Button onClick={save} disabled={!canSave || pending}>
          {pending ? 'Creando…' : 'Crear producto'}
        </Button>
      </div>
    </div>
  );
}
