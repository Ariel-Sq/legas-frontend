'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  removeHeroImage,
  saveAdminHero,
  uploadHeroImage,
  type AdminHero,
} from '@/lib/admin-api';

/**
 * Home banner editor: background image plus the copy over it. The preview
 * mirrors the real section (same beige fallback, same dark overlay), so what
 * is saved is what the storefront shows.
 */
export function HeroForm({
  hero,
  siteUrl,
}: {
  hero: AdminHero;
  siteUrl: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [headline, setHeadline] = useState(hero.headline);
  const [subheadline, setSubheadline] = useState(hero.subheadline);
  const [ctaLabel, setCtaLabel] = useState(hero.ctaLabel);
  const [ctaHref, setCtaHref] = useState(hero.ctaHref);
  const [imageUrl, setImageUrl] = useState(hero.imageUrl);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const dirty =
    headline !== hero.headline ||
    subheadline !== hero.subheadline ||
    ctaLabel !== hero.ctaLabel ||
    ctaHref !== hero.ctaHref;

  const upload = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      toast.error('La imagen supera los 4 MB');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    startTransition(async () => {
      try {
        const updated = await uploadHeroImage(formData);
        setImageUrl(updated.imageUrl);
        toast.success('Foto actualizada');
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'No se pudo subir la foto'
        );
      }
    });
  };

  const removeImage = () => {
    startTransition(async () => {
      try {
        const updated = await removeHeroImage();
        setImageUrl(updated.imageUrl);
        setConfirmRemove(false);
        toast.success('Foto quitada');
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'No se pudo quitar la foto'
        );
      }
    });
  };

  const save = () => {
    startTransition(async () => {
      try {
        await saveAdminHero({
          headline: headline.trim(),
          subheadline: subheadline.trim(),
          ctaLabel: ctaLabel.trim(),
          ctaHref: ctaHref.trim(),
        });
        toast.success('Portada guardada');
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'No se pudo guardar'
        );
      }
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Preview */}
      <section className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            Vista previa
          </h2>
          <Link
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline-offset-4 hover:underline"
          >
            Ver la tienda ↗
          </Link>
        </div>
        <div className="relative isolate overflow-hidden rounded-lg bg-[#f8ebd3]">
          {imageUrl && (
            // Plain img: the banner is a single large asset, no need for the
            // Next image optimizer in the panel.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {imageUrl && <div className="absolute inset-0 bg-black/40" />}
          <div className="relative px-4 py-14 text-center sm:py-20">
            <p
              className={`text-2xl font-extrabold leading-tight sm:text-4xl ${
                imageUrl ? 'text-white' : 'text-[#2f2418]'
              }`}
            >
              {headline.trim() || 'Título de la portada'}
            </p>
            {subheadline.trim() && (
              <p
                className={`mx-auto mt-3 max-w-xl text-sm sm:text-base ${
                  imageUrl ? 'text-white/90' : 'text-[#5f4f3c]'
                }`}
              >
                {subheadline.trim()}
              </p>
            )}
            {ctaLabel.trim() && (
              <span className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 text-base font-bold text-primary-foreground shadow-lg">
                {ctaLabel.trim()}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Foto de fondo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ideal 1920 × 900 px (apaisada), JPG, PNG o WebP de hasta 4 MB. Sin
          foto, la portada queda en el beige de siempre.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              pending
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:bg-muted'
            }`}
          >
            {imageUrl ? 'Cambiar foto' : 'Subir foto'}
            <input
              type="file"
              accept="image/webp,image/jpeg,image/png"
              className="hidden"
              disabled={pending}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
                e.target.value = '';
              }}
            />
          </label>

          {imageUrl &&
            (confirmRemove ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">¿Quitar la foto?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={pending}
                  onClick={removeImage}
                >
                  Sí, quitar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={() => setConfirmRemove(false)}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => setConfirmRemove(true)}
                disabled={pending}
              >
                Quitar foto
              </Button>
            ))}
        </div>
      </section>

      {/* Copy */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Textos</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <Label htmlFor="hero-headline">Título</Label>
            <Input
              id="hero-headline"
              value={headline}
              maxLength={120}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hero-subheadline">Bajada</Label>
            <textarea
              id="hero-subheadline"
              value={subheadline}
              maxLength={300}
              rows={2}
              onChange={(e) => setSubheadline(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="hero-cta-label">Texto del botón</Label>
              <Input
                id="hero-cta-label"
                value={ctaLabel}
                maxLength={40}
                onChange={(e) => setCtaLabel(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-cta-href">Link del botón</Label>
              <Input
                id="hero-cta-href"
                value={ctaHref}
                maxLength={300}
                placeholder="/shop"
                onChange={(e) => setCtaHref(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            El link puede ser interno (<code>/shop</code>,{' '}
            <code>/product/mi-mueble</code>) o una dirección completa.
          </p>
        </div>
      </section>

      {/* Sticky save */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-xs text-muted-foreground">
            {dirty ? 'Hay cambios sin guardar' : 'Todo guardado'}
          </span>
          <Button onClick={save} disabled={pending || !dirty}>
            {pending ? 'Guardando…' : 'Guardar portada'}
          </Button>
        </div>
      </div>
    </div>
  );
}
