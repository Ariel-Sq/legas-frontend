import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {
  BACKEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '@/utils/environments';

// Exchange the Google id_token for a backend-issued session JWT. The backend
// verifies the id_token against Google, provisions the user on first sign-in,
// and returns { accessToken, user }. Runs once per sign-in (server-side).
async function exchangeGoogleIdToken(idToken: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(
        '[auth] backend google login failed:',
        res.status,
        await res.text()
      );
      return null;
    }
    return (await res.json()) as {
      accessToken: string;
      user: Record<string, unknown>;
    };
  } catch (err) {
    console.error('[auth] backend google login error:', err);
    return null;
  }
}

// Authoritative re-read of the logged-in user, used when the client calls
// `update()` on the session (e.g. after saving the profile) so changes show
// up without re-login. Server-side only; never trusts client-sent data.
async function fetchBackendUser(backendToken: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${backendToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch (err) {
    console.error('[auth] backend user refresh error:', err);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  // Stateless JWT sessions: the backend token + user are persisted on the
  // (encrypted, httpOnly) NextAuth token via the jwt callback below.
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Runs server-side. On initial sign-in `account` carries the Google
    // id_token; we exchange it for a backend session JWT once and cache both
    // the token and the backend user on the NextAuth token.
    async jwt({ token, account, trigger }) {
      if (account?.id_token) {
        const result = await exchangeGoogleIdToken(account.id_token);
        if (result) {
          token.backendToken = result.accessToken;
          token.backendUser = result.user as typeof token.backendUser;
        }
      } else if (trigger === 'update' && token.backendToken) {
        // Client called session.update() (e.g. after a profile save):
        // re-read the authoritative user so the cached copy stays fresh.
        const fresh = await fetchBackendUser(token.backendToken as string);
        if (fresh) {
          token.backendUser = fresh as typeof token.backendUser;
        }
      }
      return token;
    },
    // Runs on every session read. Copies the cached backend user into the
    // client-visible session. The backendToken is intentionally NOT exposed
    // here — server code reads it from the NextAuth token (see server-auth.ts).
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...(token.backendUser ?? {}),
        },
      };
    },
  },
};
