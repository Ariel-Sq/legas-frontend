import type { NextAuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {
  BACKEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '@/utils/environments';

async function findOrCreateUser(session: Session) {
  const res = await fetch(`${BACKEND_URL}/api/users/${session.user?.email}`);
  const user = await res.json();

  if (!user.email) {
    const nameParts = (session.user?.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const createRes = await fetch(`${BACKEND_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.user?.email,
        firstName,
        lastName,
        authProvider: 'google',
        role: 'customer',
      }),
    });
    return await createRes.json();
  }

  return user;
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
