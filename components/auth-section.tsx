'use client';

import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/user-menu';
import { AuthDialog } from '@/components/auth-dialog';

export function AuthSection() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
    );
  }

  if (status === 'authenticated') {
    return <UserMenu />;
  }

  return <AuthDialog />;
}
