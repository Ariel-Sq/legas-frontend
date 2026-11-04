import Image from 'next/image';
import Link from 'next/link';
import type { HeroContent } from '@/lib/hero';

/**
 * Full-bleed home banner. Three shapes, all driven by the panel
 * (/admin/portada):
 *
 *  - image + text  → photo behind, darkened, centered title/button over it
 *  - image only    → the banner is shown as designed (own logo and copy)
 *  - no image      → the original warm beige with the centered copy
 */
export function HeroSection({ content }: { content: HeroContent }) {
  const hasImage = Boolean(content.imageUrl);

  // Designed banners carry their own text: show them edge to edge, keeping
  // the 16:9 artwork intact.
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
          />
        </div>
      </section>
    );
  }

  const overlay = hasImage;

  return (
    <section className="relative isolate overflow-hidden bg-[#f8ebd3]">
      {overlay && (
        <>
          <Image
            src={content.imageUrl!}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Keeps the copy readable on any photo. */}
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-36 text-center">
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-balance ${
            // Fixed dark ink: the beige fallback is always light, even in
            // dark mode, so the theme's foreground would be unreadable.
            overlay ? 'text-white' : 'text-[#2f2418]'
          }`}
        >
          {content.headline}
        </h1>

        {content.subheadline && (
          <p
            className={`mt-4 max-w-2xl mx-auto text-lg text-pretty ${
              overlay ? 'text-white/90' : 'text-[#5f4f3c]'
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
