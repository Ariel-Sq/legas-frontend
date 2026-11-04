import { NextResponse, type NextRequest } from 'next/server';

/**
 * Admin panel access control.
 *
 *  - The panel is served on its own host (anything starting with `admin.`),
 *    behind HTTP Basic Auth that runs *before* any page is rendered.
 *  - On the public storefront `/admin` answers 404, so the panel is invisible
 *    from the shop.
 *  - Once past Basic Auth, the panel still requires a Google session whose
 *    backend role is admin/editor: that check happens on every server call
 *    (see lib/admin-api.ts + AdminGuard in the backend), never here.
 *
 * Env vars: ADMIN_BASIC_AUTH_USER, ADMIN_BASIC_AUTH_PASS.
 * Missing credentials close the host (503) instead of leaving it open.
 */

const REALM = 'Legas Admin';

function unauthorized(): NextResponse {
  return new NextResponse('Autenticación requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });
}

/** Length-checked, constant-time-ish comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase();
  const isAdminHost = host.startsWith('admin.');
  // Local development has no admin subdomain and no Basic Auth credentials:
  // /admin stays reachable so the panel can be worked on offline. Production
  // builds (and previews, which also run with NODE_ENV=production) keep both
  // protections.
  const isDev = process.env.NODE_ENV !== 'production';

  if (!isAdminHost) {
    if (request.nextUrl.pathname.startsWith('/admin') && !isDev) {
      return new NextResponse('Not found', { status: 404 });
    }
    return NextResponse.next();
  }

  const user = process.env.ADMIN_BASIC_AUTH_USER;
  const pass = process.env.ADMIN_BASIC_AUTH_PASS;
  if (isDev && (!user || !pass)) {
    return NextResponse.next();
  }
  if (!user || !pass) {
    return new NextResponse('Panel no configurado', { status: 503 });
  }

  const header = request.headers.get('authorization') ?? '';
  if (!header.startsWith('Basic ')) return unauthorized();

  let decoded = '';
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorized();
  }
  const separator = decoded.indexOf(':');
  if (separator < 0) return unauthorized();
  if (
    !safeEqual(decoded.slice(0, separator), user) ||
    !safeEqual(decoded.slice(separator + 1), pass)
  ) {
    return unauthorized();
  }

  // Only the panel (and what it needs to boot) is served from this host.
  const path = request.nextUrl.pathname;
  const allowed =
    path.startsWith('/admin') ||
    path.startsWith('/api/auth') ||
    path.startsWith('/_next') ||
    path === '/icon.png' ||
    path === '/logo-legas.png' ||
    path === '/favicon.ico';
  if (!allowed) {
    // Build from the bare host: request.url can carry the Basic Auth userinfo,
    // which must never end up in a Location header.
    return NextResponse.redirect(
      new URL('/admin', `${request.nextUrl.protocol}//${host}`)
    );
  }

  // No Google session yet: log in on the storefront (the cookie is shared
  // across the whole domain) and come back here.
  const hasSession = Boolean(
    request.cookies.get('__Secure-next-auth.session-token') ??
      request.cookies.get('next-auth.session-token')
  );
  if (!hasSession && path.startsWith('/admin')) {
    const site = (
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://legasmuebles.com'
    ).replace(/\/$/, '');
    const callback = encodeURIComponent(`${request.nextUrl.protocol}//${host}/admin`);
    return NextResponse.redirect(
      new URL(`${site}/api/auth/signin?callbackUrl=${callback}`)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
