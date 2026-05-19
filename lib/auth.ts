import type { NextAuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {
  BACKEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '@/utils/environments';

async function findOrCreateUser(session: Session) {
  const email = session.user?.email;
  if (!email) return null;

  const lookup = await fetch(
    `${BACKEND_URL}/api/users/by-email/${encodeURIComponent(email)}`,
    { cache: 'no-store' }
  );
  if (lookup.ok) return await lookup.json();
  if (lookup.status !== 404) {
    console.error(
      '[auth] failed to look up user:',
      lookup.status,
      await lookup.text()
    );
    return null;
  }

  const nameParts = (session.user?.name || '').split(' ');
  const firstName = nameParts[0] || email;
  const lastName = nameParts.slice(1).join(' ') || '';

  const createRes = await fetch(`${BACKEND_URL}/api/users/oauth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, firstName, lastName, authProvider: 'google' }),
  });
  if (!createRes.ok) {
    console.error(
      '[auth] failed to create OAuth user:',
      createRes.status,
      await createRes.text()
    );
    return null;
  }
  return await createRes.json();
}

// Dev-only: when IMPERSONATE_USER_ID is set and NODE_ENV is development,
// fetch that user from the backend so the session is fully swapped to the
// impersonated user. Production ignores the env entirely.
async function maybeImpersonate() {
  if (process.env.NODE_ENV !== 'development') return null;
  const impersonateId = process.env.IMPERSONATE_USER_ID;
  if (!impersonateId) return null;
  try {
    const resp = await fetch(
      `${BACKEND_URL}/api/users/by-id/${encodeURIComponent(impersonateId)}`,
      { cache: 'no-store' }
    );
    if (!resp.ok) {
      console.warn(
        '[auth] IMPERSONATE_USER_ID lookup failed:',
        resp.status,
      );
      return null;
    }
    return await resp.json();
  } catch (err) {
    console.warn('[auth] IMPERSONATE_USER_ID lookup error:', err);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }): Promise<Session> {
      const impersonated = await maybeImpersonate();
      if (impersonated) {
        return {
          ...session,
          user: {
            // Keep the avatar from Google if there is one, otherwise let
            // anything explicit on the impersonated user win.
            ...session.user,
            ...impersonated,
            name: [impersonated.firstName, impersonated.lastName]
              .filter(Boolean)
              .join(' ') || impersonated.email,
            email: impersonated.email,
          },
        };
      }
      const userData = await findOrCreateUser(session);
      return {
        ...session,
        user: {
          ...session.user,
          ...userData,
        },
      };
    },
  },
};
