/**
 * Shared-secret header proving a backend call originates from this
 * frontend's server (all backend calls are server-side: BACKEND_URL is not
 * NEXT_PUBLIC). The backend rejects unauthenticated-origin requests when
 * FRONTEND_SHARED_SECRET is set on both sides; when unset (local dev), the
 * gate is off and this returns {}.
 *
 * Server-only by construction — never import from client components.
 */
export function frontendKeyHeaders(): Record<string, string> {
  const key = process.env.FRONTEND_SHARED_SECRET;
  return key ? { 'x-frontend-key': key } : {};
}
