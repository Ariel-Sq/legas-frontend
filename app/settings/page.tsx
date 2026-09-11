'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { PaletteControls } from '@/components/palette-picker';
import { deleteAccountAction } from '@/lib/account';
import { signOut } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { useTheme } from 'next-themes';

const DELETE_CONFIRM_PHRASE = 'ELIMINAR';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, startDelete] = useTransition();

  const canDelete = confirmText.trim().toUpperCase() === DELETE_CONFIRM_PHRASE;

  const handleDeleteAccount = () => {
    setDeleteError('');
    startDelete(async () => {
      const result = await deleteAccountAction();
      if (!result.ok) {
        setDeleteError(
          result.message ??
            `No pudimos eliminar la cuenta (HTTP ${result.status}).`
        );
        return;
      }
      await signOut({ callbackUrl: '/' });
    });
  };

  const resetDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setConfirmText('');
    setDeleteError('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Configuración
            </h1>
            <p className="text-muted-foreground">Preferencias</p>
          </div>

          <div className="grid gap-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
                <CardDescription>Personalizá cómo se ve Legas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme" className="cursor-pointer">
                      <SelectValue placeholder="Seleccionar tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light" className="cursor-pointer">
                        Claro
                      </SelectItem>
                      <SelectItem value="dark" className="cursor-pointer">
                        Oscuro
                      </SelectItem>
                      <SelectItem value="system" className="cursor-pointer">
                        Sistema
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Elige entre modo claro y oscuro, o sincroniza con las
                    preferencias de tu sistema
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Color Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Colores</CardTitle>
                <CardDescription>
                  Elegí un tema completo, o armá tu combinación de base y acento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaletteControls />
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Zona de Peligro
                </CardTitle>
                <CardDescription>
                  Acciones irreversibles de cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Advertencia</AlertTitle>
                  <AlertDescription>
                    Una vez que elimines tu cuenta, no hay vuelta atrás. Se
                    borran tus datos personales, carrito y favoritos. Tus
                    reseñas quedan publicadas con tu nombre. Los pedidos se
                    conservan por obligación contable, sin tus datos personales.
                  </AlertDescription>
                </Alert>

                {!showDeleteConfirm ? (
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Eliminar Cuenta
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="confirm-delete">
                        Escribí{' '}
                        <span className="font-mono font-semibold">
                          {DELETE_CONFIRM_PHRASE}
                        </span>{' '}
                        para confirmar
                      </Label>
                      <Input
                        id="confirm-delete"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={DELETE_CONFIRM_PHRASE}
                        autoComplete="off"
                        disabled={isDeleting}
                      />
                    </div>
                    {deleteError && (
                      <p className="text-sm text-destructive">{deleteError}</p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="destructive"
                        className="cursor-pointer"
                        disabled={!canDelete || isDeleting}
                        onClick={handleDeleteAccount}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Eliminando…
                          </>
                        ) : (
                          'Eliminar mi cuenta'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        disabled={isDeleting}
                        onClick={resetDeleteConfirm}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  La cuenta está gestionada a través de OAuth. La eliminación
                  cierra tu sesión y revoca el acceso.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
