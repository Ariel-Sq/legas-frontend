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

  const overPhoto = hasImage;
  // With a light veil the white copy needs its own shadow to stay readable.
  const textShadow =
    overPhoto && veil < 0.3 ? '0 2px 12px rgba(0,0,0,0.45)' : undefined;

  return (
    <section className="relative isolate overflow-hidden bg-[#f8ebd3]">
      {overPhoto && (
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

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-36 text-center">
        <h1
          style={{ textShadow }}
          className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-balance ${
            // Fixed dark ink: the beige fallback is always light, even in
            // dark mode, so the theme's foreground would be unreadable.
            overPhoto ? 'text-white' : 'text-[#2f2418]'
          }`}
        >
          {content.headline}
        </h1>

        {content.subheadline && (
          <p
            style={{ textShadow }}
            className={`mt-4 max-w-2xl mx-auto text-lg text-pretty ${
              overPhoto ? 'text-white/90' : 'text-[#5f4f3c]'
            }`}
          >
            {content.subheadline}
          </p>
        )}

        {content.ctaLabel && (
          <div className="mt-8 flex justify-center">
            <Link
              href={content.ctaHref || '/shop'}
              className="inline-block bg-primary text-primary-foreground text-lg sm:text-xl font-bold py-4 px-10 sm:px-12 rounded-lg hover:opacity-90 transition-all shadow-lg"
            >
              {content.ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}
