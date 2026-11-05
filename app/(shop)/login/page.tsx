import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ingresar',
  robots: { index: false, follow: false },
};

/**
 * Storefront sign-in. NextAuth is configured to use this page (`pages.signIn`),
 * so both the shop and the admin panel start their Google flow here instead of
 * NextAuth's bare default screen.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl, '/');
  const session = await getServerSession(authOptions);

  // Already signed in: go straight back. The admin handoff still needs to run,
  // and it lives on *.legasmuebles.com (allowed by `safeCallback`).
  if (session?.user?.id) {
    redirect(callbackUrl);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-grow items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Lock className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold">Ingresá a tu cuenta</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Con tu cuenta de Google podés ver tus pedidos, guardar favoritos y
              comprar más rápido.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <LoginForm callbackUrl={callbackUrl} error={params.error} />
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Solo querés comprar? Podés{' '}
            <a href="/shop" className="underline hover:text-foreground">
              seguir como invitado
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

/**
 * Only relative paths and *.legasmuebles.com are valid post-login targets.
 * Anything else falls back to the home page (defense against open redirects).
 */
function safeCallback(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'legasmuebles.com' || host.endsWith('.legasmuebles.com')) {
      return url.toString();
    }
  } catch {
    // not a URL
  }
  return fallback;
}
