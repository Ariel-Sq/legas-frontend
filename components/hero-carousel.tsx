'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface HeroSlideView {
  id: string;
  imageUrl: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * Home carousel. Auto-advances every 6s, pauses on hover/focus, and falls back
 * to manual dots/arrows. Each slide can carry its own copy; when it doesn't,
 * the hero's default text is used.
 */
export function HeroCarousel({
  slides,
  position,
  veil,
  fallback,
}: {
  slides: HeroSlideView[];
  position: string;
  veil: number;
  fallback: { headline: string; subheadline: string; ctaLabel: string; ctaHref: string };
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // One timeout per slide: every time the index changes (manual or auto) the
  // next advance is scheduled. An interval got cleared by re-renders and the
  // carousel ended up waiting for a click.
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [index, paused, slides.length]);

  const slide = slides[index];
  const headline = slide.headline || fallback.headline;
  const subheadline = slide.subheadline || fallback.subheadline;
  const ctaLabel = slide.ctaLabel || fallback.ctaLabel;
  const ctaHref = slide.ctaHref || fallback.ctaHref;
  const textShadow =
    veil < 0.3 ? '0 2px 12px rgba(0,0,0,0.45)' : undefined;

  return (
    <section
      className="relative isolate overflow-hidden bg-[#f8ebd3]"
      // Pause only while the pointer is over it (keyboard focus used to freeze
      // the carousel for good).
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
    >
      <Image
        key={slide.imageUrl}
        src={slide.imageUrl}
        alt={headline || 'Legas Muebles'}
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

      <div className="relative flex aspect-[16/9] items-center justify-center px-4 sm:aspect-auto sm:block sm:px-8 sm:py-28 md:py-36">
        <div className="text-center">
          <h1
            style={{ textShadow }}
            className="text-xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-5xl md:text-6xl"
          >
            {headline}
          </h1>
          {subheadline && (
            <p
              style={{ textShadow }}
              className="mx-auto mt-4 hidden max-w-2xl text-lg text-white/90 text-pretty sm:block"
            >
              {subheadline}
            </p>
          )}
          {ctaLabel && (
            <div className="mt-3 flex justify-center sm:mt-8">
              <Link
                href={ctaHref || '/shop'}
                className="inline-block rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 sm:px-12 sm:py-4 sm:text-xl"
              >
                {ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((item, dot) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ir al slide ${dot + 1}`}
              aria-current={dot === index}
              onClick={() => setIndex(dot)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                dot === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
