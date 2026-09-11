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
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PaletteControls } from '@/components/palette-picker';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

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
                    Una vez que elimines tu cuenta, no hay vuelta atrás. Por
                    favor, asegúrate.
                  </AlertDescription>
                </Alert>
                <Button variant="destructive" className="cursor-pointer">
                  Eliminar Cuenta
                </Button>
                <p className="text-sm text-muted-foreground">
                  {/* TODO: Implement OAuth logout and account deletion flow */}
                  La cuenta está gestionada a través de OAuth. La eliminación
                  revocará todo el acceso.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
