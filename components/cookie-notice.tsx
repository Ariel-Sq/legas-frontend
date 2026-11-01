'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'legas-cookie-consent';

/**
 * Cookie notice. Argentina has no cookie-specific statute (unlike the EU), but
 * Ley 25.326 covers cookies as personal data and the AAIP recommends informing
 * users. This is a non-blocking notice: the site only sets first-party cookies
 * (session + cart) and uses cookieless analytics, so nothing needs to be
 * gated. If third-party tracking is added later, this should become a real
 * consent gate.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Deferred so the first paint stays identical on server and client.
    const id = window.setTimeout(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        // Storage blocked (private mode): don't nag on every page.
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // Ignore: the notice simply shows again next visit.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      // Leaves room for the WhatsApp button on mobile (bottom right).
      className="fixed bottom-4 left-4 right-20 sm:right-auto sm:max-w-md z-40 rounded-xl border bg-card p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <Cookie className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
        <div className="text-sm">
          <p className="text-foreground">
            Usamos cookies propias para que el carrito y tu sesión funcionen.
            No usamos cookies de publicidad ni de seguimiento de terceros.
          </p>
          <p className="mt-1 text-muted-foreground">
            Más detalle en la{' '}
            <Link
              href="/privacy"
              className="text-primary underline hover:no-underline"
            >
              Política de Privacidad
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={accept}
            className="mt-3 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
