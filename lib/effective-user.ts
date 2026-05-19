// Dev-only user impersonation. When IMPERSONATE_USER_ID is set AND
// NODE_ENV is "development", server-side reads of the logged-in user
// return that id instead of the NextAuth session. Production ignores
// the env entirely.

const IS_DEV = process.env.NODE_ENV === 'development';
const IMPERSONATE_USER_ID = process.env.IMPERSONATE_USER_ID;

if (IMPERSONATE_USER_ID && !IS_DEV) {
  // Loud at boot so an accidental prod setting is obvious in logs.
  console.warn(
    '[effective-user] IMPERSONATE_USER_ID is set but NODE_ENV is not "development" — ignoring.',
  );
}

export function getEffectiveUserId(
  sessionUserId?: string | null,
): string | undefined {
  if (IS_DEV && IMPERSONATE_USER_ID) return IMPERSONATE_USER_ID;
  return sessionUserId ?? undefined;
}
