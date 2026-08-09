'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1">
      <div className="container mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-3">Algo salió mal</h1>
        <p className="text-muted-foreground mb-8">
          Tuvimos un problema para mostrar esta página. Probá de nuevo, o
          escribinos por WhatsApp y te damos una mano.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Reintentar</Button>
          <Button asChild variant="outline">
            <a
              href="https://wa.me/5491173666370"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir por WhatsApp
            </a>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
