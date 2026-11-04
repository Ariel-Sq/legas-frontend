import { BACKEND_URL } from '@/utils/environments';
import { frontendKeyHeaders } from '@/utils/frontend-key';

/**
 * Home hero content, editable from the admin panel (`legas-admin`).
 *
 * Cached for 60s with the `hero` tag so a save from the panel shows up on the
 * next visit without a deploy; the backend is also the source of truth for
 * the image URL (derived from the stored path).
 */
export interface HeroSlideContent {
  id: string;
  imageUrl: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HeroContent {
  imageUrl: string | null;
  /** Active carousel slides (empty = single hero). */
  slides: HeroSlideContent[];
  /** Draw the headline/button over the image, or show the banner as designed. */
  showText: boolean;
  /** Darkness of the veil over the photo, 0-60 (percent). */
  overlayOpacity: number;
  /** Vertical focal point of the photo, 0 (top) - 100 (bottom). */
  imagePosition: number;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Same copy the site shipped with, used if the backend is unreachable. */
export const HERO_FALLBACK: HeroContent = {
  imageUrl: null,
  slides: [],
  showText: true,
  overlayOpacity: 15,
  imagePosition: 50,
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
      slides: Array.isArray(data.slides) ? data.slides : [],
      showText: data.showText ?? true,
      overlayOpacity: data.overlayOpacity ?? 15,
      imagePosition: data.imagePosition ?? 50,
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
