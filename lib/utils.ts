import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

/** Format an ARS amount for display, e.g. 949000 → "$ 949.000". */
export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

const priceFormatterDecimal = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Same as formatPrice but keeps cents, e.g. 23515.1666 → "$ 23.515,17". */
export function formatPriceDecimal(value: number): string {
  return priceFormatterDecimal.format(value);
}

/**
 * Main copy of a product description, without the "INFORMACION IMPORTANTE"
 * block that every product repeats at the bottom (shipping, tints, care…).
 * Cards only show this teaser; the full text lives on the product page.
 */
export function getMainDescription(description?: string | null): string {
  if (!description) return '';
  const [main] = description.split(/INFORMACI[OÓ]N\s+IMPORTANTE/i);
  return main.replace(/\s+/g, ' ').trim();
}
