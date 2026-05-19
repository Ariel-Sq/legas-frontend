'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { updateProfileAction, type ProfileUpdate } from '@/lib/profile';

interface ProfileFormProps {
  userId: string;
  initial: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

function splitName(full: string): { firstName: string; lastName: string } {
  const trimmed = full.trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

type Status =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'ok'; section: 'info' | 'address' }
  | { kind: 'error'; section: 'info' | 'address'; message: string };

export function ProfileForm({ userId, initial }: ProfileFormProps) {
  const router = useRouter();
  const { update: refreshSession } = useSession();
  const [, startTransition] = useTransition();

  const [name, setName] = useState(initial.name);
  const [phoneNumber, setPhoneNumber] = useState(initial.phoneNumber);
  const [address, setAddress] = useState(initial.address);
  const [city, setCity] = useState(initial.city);
  const [zipCode, setZipCode] = useState(initial.zipCode);
  const [country, setCountry] = useState(initial.country);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const submit = (section: 'info' | 'address', update: ProfileUpdate) => {
    setStatus({ kind: 'saving' });
    startTransition(async () => {
      const result = await updateProfileAction(userId, update);
      if (result.ok) {
        setStatus({ kind: 'ok', section });
        await refreshSession();
        router.refresh();
      } else {
        setStatus({
          kind: 'error',
          section,
          message: result.message ?? `Error (HTTP ${result.status})`,
        });
      }
    });
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName } = splitName(name);
    submit('info', { firstName, lastName, phoneNumber: phoneNumber || '' });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    submit('address', {
      address,
      city,
      zipCode,
      country,
    });
  };

  const isSaving = status.kind === 'saving';

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Actualizá tus datos personales</CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveInfo}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={initial.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            {status.kind === 'ok' && status.section === 'info' && (
              <p className="text-sm text-green-600">Datos actualizados.</p>
            )}
            {status.kind === 'error' && status.section === 'info' && (
              <p className="text-sm text-destructive">{status.message}</p>
            )}
            <Button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer"
            >
              {isSaving ? 'Guardando…' : 'Guardar Cambios'}
            </Button>
          </CardContent>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dirección de Envío</CardTitle>
          <CardDescription>
            Esta dirección se va a usar en el checkout
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveAddress}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Dirección</Label>
                <Input
                  id="street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {status.kind === 'ok' && status.section === 'address' && (
              <p className="text-sm text-green-600">Dirección actualizada.</p>
            )}
            {status.kind === 'error' && status.section === 'address' && (
              <p className="text-sm text-destructive">{status.message}</p>
            )}
            <Button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer"
            >
              {isSaving ? 'Guardando…' : 'Actualizar Dirección'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
