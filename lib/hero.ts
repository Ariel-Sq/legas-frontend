import { BACKEND_URL } from '@/utils/environments';
import { frontendKeyHeaders } from '@/utils/frontend-key';

/**
 * Home hero content, editable from the admin panel (/admin/portada).
 *
 * Cached for 60s with the `hero` tag so a save from the panel shows up on the
 * next visit without a deploy; the backend is also the source of truth for
 * the image URL (derived from the stored path).
 */
export interface HeroContent {
  imageUrl: string | null;
  /** Draw the headline/button over the image, or show the banner as designed. */
  showText: boolean;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Same copy the site shipped with, used if the backend is unreachable. */
export const HERO_FALLBACK: HeroContent = {
  imageUrl: null,
  showText: true,
  headline: 'Muebles de Madera Artesanales',
  subheadline:
    'Descubrí piezas atemporales que aportan calidez y elegancia a tu hogar',
  ctaLabel: 'Ver Colección',
  ctaHref: '/shop',
};

export async function getHero(): Promise<HeroContent> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/site/hero`, {
      headers: frontendKeyHeaders(),
      next: { revalidate: 60, tags: ['hero'] },
    });
    if (!res.ok) return HERO_FALLBACK;

    const data = (await res.json()) as Partial<HeroContent>;
    return {
      imageUrl: data.imageUrl ?? null,
      showText: data.showText ?? true,
      headline: data.headline?.trim() || HERO_FALLBACK.headline,
      subheadline: data.subheadline ?? HERO_FALLBACK.subheadline,
      ctaLabel: data.ctaLabel?.trim() || HERO_FALLBACK.ctaLabel,
      ctaHref: data.ctaHref?.trim() || HERO_FALLBACK.ctaHref,
    };
  } catch (err) {
    console.error('getHero: backend unreachable', err);
    return HERO_FALLBACK;
  }
}
