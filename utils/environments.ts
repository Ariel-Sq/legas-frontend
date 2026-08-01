export const BACKEND_URL = process.env.BACKEND_URL;

// Public canonical origin of the storefront — used for SEO (metadataBase,
// canonicals, sitemap, JSON-LD). Set NEXT_PUBLIC_SITE_URL when the real
// domain exists; the Vercel deployment is the fallback.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://legas.vercel.app';

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Secret NextAuth uses to encrypt its session JWT. Needed server-side to read
// the backend session token off the NextAuth cookie (see lib/server-auth.ts).
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
