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
          Cualquiera que inicie sesión con Google y tenga rol de editor o
          administrador puede entrar a <code>/admin</code>. El dueño se define
          con la variable <code>OWNER_EMAIL</code>.
        </p>
      </div>

      <InviteForm />
      <UsersTable users={users} ownerEmail={ownerEmail} />

      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Cómo sumar a alguien</p>
        <p className="mt-1">
          La persona entra una vez a la tienda con su cuenta de Google (así se
          crea su usuario) y después le asignás el rol acá. No hace falta
          invitación ni contraseña.
        </p>
      </div>
    </div>
  );
}
