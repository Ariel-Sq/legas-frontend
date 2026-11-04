'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { inviteAdminUser } from '@/lib/admin-api';

export function InviteForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!email.includes('@')) {
      toast.error('Ingresá un email válido');
      return;
    }
    startTransition(async () => {
      try {
        const { emailSent } = await inviteAdminUser(email.trim(), role);
        if (emailSent) {
          toast.success(`Invitación enviada a ${email.trim()}`);
        } else {
          toast.warning(
            'El rol quedó guardado, pero el mail no salió. Avisanos y lo revisamos.'
          );
        }
        setEmail('');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'No se pudo invitar'
        );
      }
    });
  };

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">Invitar a alguien</h2>
      <div className="grid gap-3 sm:grid-cols-[1fr_200px_auto] sm:items-end">
        <div>
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="persona@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label>Rol</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="customer">Cliente (sin acceso)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={submit} disabled={pending}>
          {pending ? 'Enviando…' : 'Invitar'}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Le llega un mail. Cuando entre con Google usando ese email, ya va a
        tener el rol asignado.
      </p>
    </div>
  );
}
