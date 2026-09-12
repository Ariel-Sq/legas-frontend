import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      role?: 'owner' | 'admin' | 'customer' | 'guest';
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      dni?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    // Backend-issued session JWT. Kept on the (encrypted, httpOnly) NextAuth
    // token only — never copied into the client-visible session.
    backendToken?: string;
    // Cached backend user fields, surfaced to the session for UI use.
    backendUser?: {
      id?: string;
      role?: 'owner' | 'admin' | 'customer' | 'guest';
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      dni?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  }
}
