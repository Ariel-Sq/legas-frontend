import { en, type TranslationKeys } from './en';
import { es } from './es';

export const translations = {
  en,
  es,
} as const;

export type Locale = keyof typeof translations;

export { en, es };
export type { TranslationKeys };
