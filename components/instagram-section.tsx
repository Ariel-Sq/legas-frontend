import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/company';

/**
 * Closing invitation to follow the shop on Instagram. Kept as a plain link
 * (no embed) so it stays light and doesn't depend on third-party scripts.
 */
export function InstagramSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border bg-card p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
            <Instagram className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-foreground">
            Seguinos en Instagram
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            Mostramos cada pieza terminada, el trabajo del taller y las
            novedades antes que nadie. Si te gusta lo que hacemos, seguinos y
            etiquetanos cuando llegue tu mueble.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all shadow-lg"
            >
              <Instagram className="h-5 w-5" />
              {INSTAGRAM_HANDLE}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
