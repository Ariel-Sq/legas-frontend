import { notFound } from 'next/navigation';
import { getAdminMe, listAdminUsers } from '@/lib/admin-api';
import { UsersTable } from '@/components/admin/users-table';
import { InviteForm } from '@/components/admin/invite-form';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const me = await getAdminMe();
  if (!me.isOwner) notFound();

  const users = await listAdminUsers();
  const ownerEmail = process.env.OWNER_EMAIL ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuarios y permisos</h1>
        <p className="text-sm text-muted-foreground">
          Acá aparecen solo las personas con acceso al panel. Los clientes de
          la tienda no se listan.
        </p>
      </div>

      <InviteForm />
      <UsersTable users={users} ownerEmail={ownerEmail} />

      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Cómo sumar a alguien</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Ponés su email arriba, elegís el rol y tocás «Invitar».</li>
          <li>Le llega un mail con el link del panel.</li>
          <li>
            Entra con Google usando <strong>ese mismo email</strong> y ya queda
            con el rol asignado. No hay contraseñas ni registros aparte.
          </li>
        </ol>
        <p className="mt-2">
          Si la persona ya compró en la tienda, la invitación le cambia el rol
          sobre su cuenta existente. Sacarle el acceso es ponerle «Cliente» en
          la lista de abajo.
        </p>
      </div>
    </div>
  );
}
