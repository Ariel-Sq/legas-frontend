import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      role?: 'owner' | 'admin' | 'customer' | 'guest';
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    } & DefaultSession['user'];
  }
}
