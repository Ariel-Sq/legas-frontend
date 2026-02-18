import { useSession } from 'next-auth/react';

export function useIsLogged() {
  const { data: session } = useSession();
  return !!session;
}

export function useIsAdmin() {
  const { data: session } = useSession();
  const role = session?.user?.role || 'guest';
  return role === 'admin' || role === 'owner';
}
