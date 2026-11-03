'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUserRole, type AdminUserRow } from '@/lib/admin-api';

const ROLES = [
  { value: 'admin', label: 'Administrador (todo)' },
  { value: 'editor', label: 'Editor (catálogo)' },
  { value: 'customer', label: 'Cliente (sin acceso)' },
];

export function UsersTable({
  users,
  ownerEmail,
}: {
  users: AdminUserRow[];
  ownerEmail: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const change = (user: AdminUserRow, role: string) => {
    setDraft((prev) => ({ ...prev, [user.id]: role }));
    startTransition(async () => {
      try {
        await updateUserRole(user.id, role);
        toast.success(`Rol de ${user.email} actualizado`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'No se pudo cambiar el rol'
        );
        setDraft((prev) => ({ ...prev, [user.id]: user.role }));
      }
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="p-3">Email</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isOwner =
              ownerEmail &&
              user.email.toLowerCase() === ownerEmail.toLowerCase();
            const value = draft[user.id] ?? user.role;
            return (
              <tr key={user.id} className="border-t">
                <td className="p-3 font-medium">{user.email}</td>
                <td className="p-3 text-muted-foreground">
                  {[user.firstName, user.lastName].filter(Boolean).join(' ') ||
                    '—'}
                </td>
                <td className="p-3">
                  {isOwner ? (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                      dueño
                    </span>
                  ) : (
                    <Select
                      value={value}
                      onValueChange={(role) => change(user, role)}
                      disabled={pending}
                    >
                      <SelectTrigger className="w-56">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
