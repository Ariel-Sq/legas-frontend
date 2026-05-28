export const BACKEND_URL = process.env.BACKEND_URL;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Secret NextAuth uses to encrypt its session JWT. Needed server-side to read
// the backend session token off the NextAuth cookie (see lib/server-auth.ts).
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
