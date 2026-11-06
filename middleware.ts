import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Dev-only HTTP Basic Auth. Enabled only when DEV_BASIC_AUTH_PASS exists
 * (Preview environment); production and local never set it, so the shop
 * behaves exactly as before.
 */
const DEV_BASIC_AUTH_USER = process.env.DEV_BASIC_AUTH_USER;
const DEV_BASIC_AUTH_PASS = process.env.DEV_BASIC_AUTH_PASS;

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function devAuthorized(request: NextRequest): boolean {
  const header = request.headers.get('authorization') ?? '';
  if (!header.startsWith('Basic ')) return false;
  let decoded = '';
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const separator = decoded.indexOf(':');
  if (separator < 0) return false;
  return (
    safeEqual(decoded.slice(0, separator), DEV_BASIC_AUTH_USER ?? '') &&
    safeEqual(decoded.slice(separator + 1), DEV_BASIC_AUTH_PASS ?? '')
  );
}

/**
 * Content-Security-Policy in Report-Only mode.
 *
 * Report-Only never blocks requests: it only surfaces violations in the
 * browser console (and in a `report-to` endpoint if one is configured). This
 * lets us validate the policy against Next.js, MercadoPago and Vercel
 * Analytics before switching the header to enforcing, which would require
 * per-request nonces and opt the app into dynamic rendering.
 *
 * To enforce: rename the header below to `Content-Security-Policy` and wire
 * the nonce into the app's own inline scripts.
 */
export function middleware(request: NextRequest) {
  // Gate the dev storefront. Google's OAuth callback and the panel's cache
  // purge arrive without Basic credentials, so they stay public (they carry
  // their own protection).
  if (DEV_BASIC_AUTH_PASS) {
    const { pathname } = request.nextUrl;
    const openPath =
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/api/revalidate');
    if (!openPath && !devAuthorized(request)) {
      return new NextResponse('Autenticación requerida', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Legas Dev", charset="UTF-8"',
          'Cache-Control': 'no-store',
        },
      });
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Webpack's dev server evaluates modules with `eval`, which a strict
  // script-src blocks. Production builds don't, so allow it only in dev to
  // keep the report clean. `upgrade-insecure-requests` is intentionally
  // omitted: browsers ignore it in a report-only policy.
  const devEval = process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'";

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${devEval} https://sdk.mercadopago.com https://va.vercel-scripts.com https://*.vercel-insights.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-src 'self' https://sdk.mercadopago.com https://www.mercadopago.com https://mercadopago.com",
    "form-action 'self' https://www.mercadopago.com https://mercadopago.com",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ].join('; ');

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy-Report-Only', csp);
  response.headers.set('x-nonce', nonce);
  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
