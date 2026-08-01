'use client';

import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

/**
 * User-facing color customization: a header popover to pick the surface
 * scheme (base) and brand color (accent) of the storefront. The choice is
 * persisted in localStorage:
 *  - `legas-palette`     → { base, accent } keys (drives the picker UI)
 *  - `legas-palette-css` → the compiled CSS override, injected before first
 *    paint by the inline boot script in app/layout.tsx so there is no flash.
 *
 * Every combination keeps the Material dark-theme rules from globals.css
 * (tonal elevation steps, lighter+softer accents in dark, no pure white).
 */

interface PaletteOption {
  key: string;
  label: string;
  swatch: string;
  /** CSS overriding tokens; empty string = globals.css defaults */
  css: string;
}

export const PALETTE_BASES: PaletteOption[] = [
  {
    key: 'calida',
    label: 'Cálida',
    swatch: 'oklch(0.85 0.04 70)',
    css: '',
  },
  {
    key: 'neutra',
    label: 'Neutra',
    swatch: 'oklch(0.85 0 0)',
    css: `
      :root {
        --background: oklch(0.99 0 0);
        --foreground: oklch(0.27 0 0);
        --card: oklch(1 0 0);
        --card-foreground: oklch(0.27 0 0);
        --popover: oklch(1 0 0);
        --popover-foreground: oklch(0.27 0 0);
        --secondary: oklch(0.965 0 0);
        --secondary-foreground: oklch(0.22 0 0);
        --muted: oklch(0.955 0 0);
        --muted-foreground: oklch(0.52 0 0);
        --border: oklch(0.89 0 0);
        --input: oklch(0.92 0 0);
      }
      .dark {
        --background: oklch(0.165 0 0);
        --foreground: oklch(0.93 0 0);
        --card: oklch(0.21 0 0);
        --card-foreground: oklch(0.93 0 0);
        --popover: oklch(0.24 0 0);
        --popover-foreground: oklch(0.93 0 0);
        --secondary: oklch(0.27 0 0);
        --secondary-foreground: oklch(0.93 0 0);
        --muted: oklch(0.25 0 0);
        --muted-foreground: oklch(0.72 0 0);
        --border: oklch(0.31 0 0);
        --input: oklch(0.29 0 0);
      }
    `,
  },
  {
    key: 'piedra',
    label: 'Piedra',
    swatch: 'oklch(0.85 0.008 250)',
    css: `
      :root {
        --background: oklch(0.985 0.003 250);
        --foreground: oklch(0.28 0.01 250);
        --card: oklch(1 0 0);
        --card-foreground: oklch(0.28 0.01 250);
        --popover: oklch(1 0 0);
        --popover-foreground: oklch(0.28 0.01 250);
        --secondary: oklch(0.96 0.004 250);
        --secondary-foreground: oklch(0.23 0.01 250);
        --muted: oklch(0.95 0.004 250);
        --muted-foreground: oklch(0.52 0.01 250);
        --border: oklch(0.89 0.006 250);
        --input: oklch(0.92 0.006 250);
      }
      .dark {
        --background: oklch(0.17 0.008 250);
        --foreground: oklch(0.93 0.004 250);
        --card: oklch(0.215 0.01 250);
        --card-foreground: oklch(0.93 0.004 250);
        --popover: oklch(0.24 0.01 250);
        --popover-foreground: oklch(0.93 0.004 250);
        --secondary: oklch(0.27 0.012 250);
        --secondary-foreground: oklch(0.93 0.004 250);
        --muted: oklch(0.25 0.01 250);
        --muted-foreground: oklch(0.72 0.008 250);
        --border: oklch(0.31 0.012 250);
        --input: oklch(0.29 0.012 250);
      }
    `,
  },
  {
    key: 'noche',
    label: 'Noche',
    swatch: 'oklch(0.4 0.05 260)',
    css: `
      :root {
        --background: oklch(0.98 0.005 255);
        --foreground: oklch(0.28 0.02 260);
        --card: oklch(1 0 0);
        --card-foreground: oklch(0.28 0.02 260);
        --popover: oklch(1 0 0);
        --popover-foreground: oklch(0.28 0.02 260);
        --secondary: oklch(0.955 0.008 255);
        --secondary-foreground: oklch(0.23 0.02 260);
        --muted: oklch(0.945 0.008 255);
        --muted-foreground: oklch(0.5 0.02 260);
        --border: oklch(0.88 0.012 255);
        --input: oklch(0.91 0.012 255);
      }
      .dark {
        --background: oklch(0.18 0.03 260);
        --foreground: oklch(0.93 0.008 255);
        --card: oklch(0.225 0.032 260);
        --card-foreground: oklch(0.93 0.008 255);
        --popover: oklch(0.25 0.032 260);
        --popover-foreground: oklch(0.93 0.008 255);
        --secondary: oklch(0.28 0.035 260);
        --secondary-foreground: oklch(0.93 0.008 255);
        --muted: oklch(0.26 0.03 260);
        --muted-foreground: oklch(0.72 0.02 258);
        --border: oklch(0.32 0.035 260);
        --input: oklch(0.3 0.035 260);
      }
    `,
  },
  {
    key: 'bosque',
    label: 'Bosque',
    swatch: 'oklch(0.45 0.05 150)',
    css: `
      :root {
        --background: oklch(0.98 0.006 145);
        --foreground: oklch(0.28 0.02 150);
        --card: oklch(1 0 0);
        --card-foreground: oklch(0.28 0.02 150);
        --popover: oklch(1 0 0);
        --popover-foreground: oklch(0.28 0.02 150);
        --secondary: oklch(0.955 0.01 145);
        --secondary-foreground: oklch(0.23 0.02 150);
        --muted: oklch(0.945 0.01 145);
        --muted-foreground: oklch(0.5 0.02 150);
        --border: oklch(0.88 0.014 145);
        --input: oklch(0.91 0.014 145);
      }
      .dark {
        --background: oklch(0.175 0.02 150);
        --foreground: oklch(0.93 0.008 145);
        --card: oklch(0.22 0.022 150);
        --card-foreground: oklch(0.93 0.008 145);
        --popover: oklch(0.245 0.022 150);
        --popover-foreground: oklch(0.93 0.008 145);
        --secondary: oklch(0.275 0.025 150);
        --secondary-foreground: oklch(0.93 0.008 145);
        --muted: oklch(0.255 0.02 150);
        --muted-foreground: oklch(0.72 0.015 148);
        --border: oklch(0.315 0.025 150);
        --input: oklch(0.295 0.025 150);
      }
    `,
  },
  {
    key: 'arena',
    label: 'Arena',
    swatch: 'oklch(0.9 0.025 80)',
    css: `
      :root {
        --background: oklch(0.965 0.015 80);
        --foreground: oklch(0.32 0.025 60);
        --card: oklch(0.99 0.008 85);
        --card-foreground: oklch(0.32 0.025 60);
        --popover: oklch(0.99 0.008 85);
        --popover-foreground: oklch(0.32 0.025 60);
        --secondary: oklch(0.93 0.02 80);
        --secondary-foreground: oklch(0.27 0.025 60);
        --muted: oklch(0.92 0.018 80);
        --muted-foreground: oklch(0.52 0.025 65);
        --border: oklch(0.86 0.02 80);
        --input: oklch(0.89 0.02 80);
      }
      .dark {
        --background: oklch(0.2 0.015 70);
        --foreground: oklch(0.93 0.012 85);
        --card: oklch(0.245 0.018 70);
        --card-foreground: oklch(0.93 0.012 85);
        --popover: oklch(0.27 0.018 70);
        --popover-foreground: oklch(0.93 0.012 85);
        --secondary: oklch(0.3 0.02 70);
        --secondary-foreground: oklch(0.93 0.012 85);
        --muted: oklch(0.28 0.018 70);
        --muted-foreground: oklch(0.73 0.018 78);
        --border: oklch(0.34 0.02 70);
        --input: oklch(0.32 0.02 70);
      }
    `,
  },
];

/**
 * Curated full palettes: a base + accent pair designed to work together.
 * Selecting one applies both at once; the fine-grained rows below still let
 * the user mix their own combination.
 */
export const PALETTE_PRESETS: {
  key: string;
  label: string;
  base: string;
  accent: string;
}[] = [
  { key: 'legas', label: 'Legas', base: 'calida', accent: 'dorado' },
  { key: 'galeria', label: 'Galería', base: 'neutra', accent: 'tinta' },
  { key: 'escandinavo', label: 'Escandinavo', base: 'piedra', accent: 'salvia' },
  { key: 'oceano', label: 'Océano', base: 'noche', accent: 'petroleo' },
  { key: 'bosque', label: 'Bosque', base: 'bosque', accent: 'salvia' },
  { key: 'atardecer', label: 'Atardecer', base: 'arena', accent: 'terracota' },
];

export const PALETTE_ACCENTS: PaletteOption[] = [
  {
    key: 'dorado',
    label: 'Dorado',
    swatch: 'oklch(0.82 0.12 85)',
    css: '',
  },
  {
    key: 'nogal',
    label: 'Nogal',
    swatch: 'oklch(0.42 0.06 55)',
    css: `
      :root {
        --primary: oklch(0.42 0.06 55);
        --primary-foreground: oklch(0.97 0.008 85);
        --accent: oklch(0.42 0.06 55);
        --accent-foreground: oklch(0.97 0.008 85);
        --ring: oklch(0.42 0.06 55);
      }
      .dark {
        --primary: oklch(0.76 0.05 60);
        --primary-foreground: oklch(0.2 0.03 60);
        --accent: oklch(0.29 0.03 60);
        --accent-foreground: oklch(0.93 0.02 85);
        --ring: oklch(0.76 0.05 60);
      }
    `,
  },
  {
    key: 'salvia',
    label: 'Salvia',
    swatch: 'oklch(0.52 0.07 135)',
    css: `
      :root {
        --primary: oklch(0.52 0.07 135);
        --primary-foreground: oklch(0.98 0.005 120);
        --accent: oklch(0.52 0.07 135);
        --accent-foreground: oklch(0.98 0.005 120);
        --ring: oklch(0.52 0.07 135);
      }
      .dark {
        --primary: oklch(0.78 0.07 135);
        --primary-foreground: oklch(0.2 0.05 135);
        --accent: oklch(0.29 0.03 135);
        --accent-foreground: oklch(0.93 0.02 135);
        --ring: oklch(0.78 0.07 135);
      }
    `,
  },
  {
    key: 'terracota',
    label: 'Terracota',
    swatch: 'oklch(0.56 0.12 40)',
    css: `
      :root {
        --primary: oklch(0.56 0.12 40);
        --primary-foreground: oklch(0.98 0.005 40);
        --accent: oklch(0.56 0.12 40);
        --accent-foreground: oklch(0.98 0.005 40);
        --ring: oklch(0.56 0.12 40);
      }
      .dark {
        --primary: oklch(0.78 0.09 45);
        --primary-foreground: oklch(0.22 0.05 40);
        --accent: oklch(0.29 0.03 45);
        --accent-foreground: oklch(0.93 0.02 45);
        --ring: oklch(0.78 0.09 45);
      }
    `,
  },
  {
    key: 'petroleo',
    label: 'Petróleo',
    swatch: 'oklch(0.48 0.07 210)',
    css: `
      :root {
        --primary: oklch(0.48 0.07 210);
        --primary-foreground: oklch(0.98 0.005 210);
        --accent: oklch(0.48 0.07 210);
        --accent-foreground: oklch(0.98 0.005 210);
        --ring: oklch(0.48 0.07 210);
      }
      .dark {
        --primary: oklch(0.79 0.07 200);
        --primary-foreground: oklch(0.2 0.04 210);
        --accent: oklch(0.29 0.03 200);
        --accent-foreground: oklch(0.93 0.02 200);
        --ring: oklch(0.79 0.07 200);
      }
    `,
  },
  {
    key: 'tinta',
    label: 'Tinta',
    swatch: 'oklch(0.28 0.02 60)',
    css: `
      :root {
        --primary: oklch(0.28 0.02 60);
        --primary-foreground: oklch(0.97 0.008 85);
        --accent: oklch(0.28 0.02 60);
        --accent-foreground: oklch(0.97 0.008 85);
        --ring: oklch(0.28 0.02 60);
      }
      .dark {
        --primary: oklch(0.9 0.01 85);
        --primary-foreground: oklch(0.2 0.02 60);
        --accent: oklch(0.3 0.015 60);
        --accent-foreground: oklch(0.93 0.008 85);
        --ring: oklch(0.9 0.01 85);
      }
    `,
  },
];

export const PALETTE_STORAGE_KEY = 'legas-palette';
export const PALETTE_CSS_STORAGE_KEY = 'legas-palette-css';
const STYLE_ID = 'palette-style';

function compileCss(baseKey: string, accentKey: string): string {
  const baseCss = PALETTE_BASES.find((b) => b.key === baseKey)?.css ?? '';
  const accentCss =
    PALETTE_ACCENTS.find((a) => a.key === accentKey)?.css ?? '';
  return baseCss + accentCss;
}

function applyCss(css: string) {
  let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = STYLE_ID;
    document.head.appendChild(tag);
  }
  tag.textContent = css;
}

function SwatchRow({
  title,
  options,
  active,
  onSelect,
}: {
  title: string;
  options: PaletteOption[];
  active: string;
  onSelect: (option: PaletteOption) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => onSelect(option)}
            aria-pressed={active === option.key}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
              active === option.key
                ? 'border-ring bg-secondary text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <span
              className="h-3.5 w-3.5 rounded-full border border-border"
              style={{ backgroundColor: option.swatch }}
            />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PalettePicker() {
  const [base, setBase] = useState('calida');
  const [accent, setAccent] = useState('dorado');

  // The boot script in app/layout.tsx already applied the stored CSS before
  // first paint; here we only sync the picker UI with the stored choice.
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(PALETTE_STORAGE_KEY) ?? '{}'
      );
      if (PALETTE_BASES.some((b) => b.key === saved.base)) setBase(saved.base);
      if (PALETTE_ACCENTS.some((a) => a.key === saved.accent))
        setAccent(saved.accent);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const select = (nextBase: string, nextAccent: string) => {
    setBase(nextBase);
    setAccent(nextAccent);
    const css = compileCss(nextBase, nextAccent);
    applyCss(css);
    try {
      localStorage.setItem(
        PALETTE_STORAGE_KEY,
        JSON.stringify({ base: nextBase, accent: nextAccent })
      );
      localStorage.setItem(PALETTE_CSS_STORAGE_KEY, css);
    } catch {
      /* storage may be unavailable (private mode) — still applied for the session */
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Personalizar colores"
          className="relative p-2 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <Palette className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-4">
        <div>
          <p className="text-sm font-semibold">Personalizá los colores</p>
          <p className="text-xs text-muted-foreground">
            Elegí un tema completo, o armá tu combinación de base y acento.
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Temas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PALETTE_PRESETS.map((preset) => {
              const presetBase = PALETTE_BASES.find(
                (b) => b.key === preset.base
              );
              const presetAccent = PALETTE_ACCENTS.find(
                (a) => a.key === preset.accent
              );
              const isActive =
                base === preset.base && accent === preset.accent;
              return (
                <button
                  key={preset.key}
                  onClick={() => select(preset.base, preset.accent)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'border-ring bg-secondary text-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span className="flex -space-x-1">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-border"
                      style={{ backgroundColor: presetBase?.swatch }}
                    />
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-border"
                      style={{ backgroundColor: presetAccent?.swatch }}
                    />
                  </span>
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
        <SwatchRow
          title="Base"
          options={PALETTE_BASES}
          active={base}
          onSelect={(option) => select(option.key, accent)}
        />
        <SwatchRow
          title="Acento"
          options={PALETTE_ACCENTS}
          active={accent}
          onSelect={(option) => select(base, option.key)}
        />
      </PopoverContent>
    </Popover>
  );
}
