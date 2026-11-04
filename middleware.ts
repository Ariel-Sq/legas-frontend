import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
export function middleware(_request: NextRequest) {
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
