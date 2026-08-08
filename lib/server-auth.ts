// Server-only: importing next/headers makes this module unusable from client
// components, which is exactly the guarantee we want for the backend token.
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { NEXTAUTH_SECRET } from '@/utils/environments';
import { frontendKeyHeaders } from '@/utils/frontend-key';

/**
 * Build the auth headers for a server-to-server call to the backend.
 *
 * - Logged-in user: `Authorization: Bearer <backendToken>`, read off the
 *   NextAuth token server-side. The token is never exposed to the browser.
 * - Anonymous: no auth header — callers add their own `x-session-id`.
 *
 * Returns an empty object for anonymous callers so the result can always be
 * spread into a headers map.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  // next-auth v4 getToken reads the session cookie from `req.cookies` (an
  // object map), not from the raw `cookie` header. Pass both so it resolves
  // regardless of version.
  const cookieMap = Object.fromEntries(all.map((c) => [c.name, c.value]));
  const cookieHeader = all.map((c) => `${c.name}=${c.value}`).join('; ');

  const token = await getToken({
    req: { cookies: cookieMap, headers: { cookie: cookieHeader } } as never,
    secret: NEXTAUTH_SECRET,
  });

  if (token?.backendToken) {
    return {
      ...frontendKeyHeaders(),
      Authorization: `Bearer ${token.backendToken}`,
    };
  }

  return { ...frontendKeyHeaders() };
}

/**
 * Whether the current request carries a usable authenticated identity.
 */
export async function isAuthenticatedRequest(): Promise<boolean> {
  const headers = await getAuthHeaders();
  return 'Authorization' in headers;
}
