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

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }): Promise<Session> {
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
