'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
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
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            © 2025 Woodland. Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
