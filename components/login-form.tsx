'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/** NextAuth error codes → something the shopper can act on. */
const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'No pudimos abrir la pantalla de Google. Probá de nuevo.',
  OAuthCallback:
    'Google no pudo completar el ingreso. Probá otra vez o con otra cuenta.',
  OAuthCreateAccount:
    'No pudimos crear tu cuenta. Probá de nuevo en unos minutos.',
  AccessDenied: 'Cancelaste el ingreso con Google.',
  Configuration:
    'El ingreso con Google no está disponible en este momento. Escribinos por WhatsApp.',
  Verification: 'El enlace de verificación venció. Volvé a intentar.',
  Default: 'No pudimos iniciar sesión. Probá de nuevo.',
};

export function LoginForm({
  callbackUrl,
  error,
}: {
  callbackUrl: string;
  error?: string;
}) {
  const [working, setWorking] = useState(false);
  const message = error
    ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default)
    : '';

  return (
    <div className="w-full max-w-md space-y-6">
      {message && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No pudimos ingresar</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="button"
        className="h-12 w-full gap-3 text-base"
        disabled={working}
        onClick={() => {
          setWorking(true);
          void signIn('google', { callbackUrl });
        }}
      >
        {working ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        {working ? 'Abriendo Google…' : 'Continuar con Google'}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Al ingresar aceptás los{' '}
        <Link href="/terms" className="underline hover:text-foreground">
          términos
        </Link>{' '}
        y la{' '}
        <Link href="/privacy" className="underline hover:text-foreground">
          política de privacidad
        </Link>
        .
      </p>
    </div>
  );
}
