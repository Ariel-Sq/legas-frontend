'use client';

import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/company';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            <Link
              href="/como-comprar"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Cómo comprar
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Términos del Servicio
            </Link>
            <Link
              href="/shipping"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Envíos & Devoluciones
            </Link>
            <Link
              href="/arrepentimiento"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Botón de arrepentimiento
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              {INSTAGRAM_HANDLE}
            </a>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            © 2026 Legas. Todos los derechos reservados
          </p>
        </div>

        {/* Seller identification (Ley 24.240 art. 4) — visible on every page. */}
        <p className="text-xs text-muted-foreground text-center md:text-left">
          Legas Muebles — Leonardo Gastón Gamarra · CUIT 20-32319747-5 ·
          Monotributista · Juan de Herrera 2651, Villa de Mayo, B1614 Malvinas
          Argentinas, Buenos Aires, Argentina ·{' '}
          <a
            href={`mailto:${EMAIL}`}
            className="underline hover:text-primary transition-colors"
          >
            {EMAIL}
          </a>
        </p>

        {/* Res. 274/2021: link a la Ventanilla Única Federal de Defensa del
            Consumidor, con el texto establecido por la norma. */}
        <p className="text-xs text-muted-foreground text-center md:text-left">
          Defensa de las y los Consumidores. Para reclamos,{' '}
          <a
            href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            ingrese aquí
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
