import Image from 'next/image';
import Link from 'next/link';
import type { HeroContent } from '@/lib/hero';

/**
 * Full-bleed home banner. Everything here is driven by the panel
 * (/admin/portada): the photo, its vertical framing, how dark the veil is and
 * the copy.
 *
 *  - image + text  → photo behind, adjusted veil, centered title/button
 *  - image only    → the banner is shown as designed (own logo and copy)
 *  - no image      → the original warm beige with the centered copy
 *
 * On phones the photo keeps its 16:9 shape (so the whole banner fits in a
 * portrait screen) and the copy shrinks: subtitle and button wait for `sm`.
 */
export function HeroSection({ content }: { content: HeroContent }) {
  const hasImage = Boolean(content.imageUrl);
  const position = `center ${clamp(content.imagePosition, 0, 100, 50)}%`;
  const veil = clamp(content.overlayOpacity, 0, 60, 15) / 100;

  if (hasImage && !content.showText) {
    return (
      <section className="relative isolate w-full overflow-hidden bg-[#f8ebd3]">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={content.imageUrl!}
            alt={content.headline || 'Legas Muebles'}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: position }}
          />
        </div>
      </section>
    );
  }

  // With a light veil the white copy needs its own shadow to stay readable.
  const textShadow =
    hasImage && veil < 0.3 ? '0 2px 12px rgba(0,0,0,0.45)' : undefined;

  return (
    <section className="relative isolate overflow-hidden bg-[#f8ebd3]">
      {hasImage && (
        <>
          <Image
            src={content.imageUrl!}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: position }}
          />
          {veil > 0 && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${veil})` }}
            />
          )}
        </>
      )}

      <div
        className={
          hasImage
            ? // Mobile: the photo dictates the height (16:9), so nothing gets
              // cropped. From sm up the copy dictates it again.
              'relative flex aspect-[16/9] items-center justify-center px-4 sm:aspect-auto sm:block sm:px-8 sm:py-28 md:py-36'
            : 'relative container mx-auto px-4 py-16 sm:px-6 sm:py-28 lg:px-8 md:py-36'
        }
      >
        <div className="text-center">
          <h1
            style={{ textShadow }}
            className={`font-extrabold leading-tight tracking-tight text-balance ${
              hasImage ? 'text-xl sm:text-5xl md:text-6xl' : 'text-2xl sm:text-5xl md:text-6xl'
            } ${
              // Fixed dark ink: the beige fallback is always light, even in
              // dark mode, so the theme's foreground would be unreadable.
              hasImage ? 'text-white' : 'text-[#2f2418]'
            }`}
          >
            {content.headline}
          </h1>

          {/* Phones: the banner carries its own message; keep only the title. */}
          {content.subheadline && (
            <p
              style={{ textShadow }}
              className={`mt-4 hidden max-w-2xl mx-auto text-lg text-pretty sm:block ${
                hasImage ? 'text-white/90' : 'text-[#5f4f3c]'
              }`}
            >
              {content.subheadline}
            </p>
          )}

          {content.ctaLabel && (
            <div className="mt-3 flex justify-center sm:mt-8">
              <Link
                href={content.ctaHref || '/shop'}
                className="inline-block rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 sm:px-12 sm:py-4 sm:text-xl"
              >
                {content.ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}
