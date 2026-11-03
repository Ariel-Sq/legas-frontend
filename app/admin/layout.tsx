import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminMe, type AdminMe } from '@/lib/admin-api';

export const metadata: Metadata = {
  title: 'Panel',
  robots: { index: false, follow: false },
};

/**
 * Admin shell. Everyone who is not owner/admin/editor gets a plain 404, so the
 * panel is invisible from the outside.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let me: AdminMe;
  try {
    me = await getAdminMe();
  } catch (error) {
    // Visible in the deployment logs, never to the visitor (they get a 404).
    console.error(
      'admin gate:',
      error instanceof Error ? error.message : error
    );
    notFound();
  }

  const canManageUsers = me.isOwner;

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="border-b bg-background">
        <div className="container mx-auto flex flex-wrap items-center gap-4 px-4 py-3">
          <Link href="/admin" className="text-lg font-bold">
            Legas · Panel
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/admin" className="hover:text-primary">
              Productos
            </Link>
            {canManageUsers && (
              <Link href="/admin/users" className="hover:text-primary">
                Usuarios
              </Link>
            )}
            {canManageUsers && (
              <Link href="/admin/audit" className="hover:text-primary">
                Historial
              </Link>
            )}
            <Link href="/" className="hover:text-primary">
              Ver tienda ↗
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span>{me.email}</span>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary">
              {me.isOwner ? 'dueño' : me.role}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
