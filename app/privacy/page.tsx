import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Qué datos personales tratamos, para qué, y cómo ejercer tus derechos (Ley 25.326).',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Política de Privacidad</h1>
          <p className="text-muted-foreground mb-12">
            Última actualización: 7 de agosto de 2026
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Responsable</h2>
              <p>
                El responsable del tratamiento de tus datos es Legas Muebles,
                con domicilio en Juan de Herrera 2542, B1614 Malvinas
                Argentinas, Provincia de Buenos Aires, Argentina. Podés
                contactarnos por{' '}
                <a
                  href="https://wa.me/5491173666370"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp (+54 11 7366-6370)
                </a>{' '}
                o desde la página de{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  contacto
                </Link>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                2. Qué datos tratamos y para qué
              </h2>
              <p>
                Tratamos los datos que nos das al iniciar sesión con Google
                (nombre, email, foto de perfil), al comprar (dirección de
                envío, teléfono, email de contacto) y al usar el sitio
                (carrito, pedidos, favoritos, reseñas). Los usamos únicamente
                para procesar tus pedidos, coordinar entregas, responder
                consultas y gestionar tu cuenta. Entregar los datos de contacto
                es necesario para poder venderte y coordinar el envío; el resto
                es opcional. No vendemos tus datos ni los usamos para
                publicidad de terceros.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                3. Con quién se comparten
              </h2>
              <p>
                Tus datos se comparten solo con los proveedores necesarios para
                operar la tienda: MercadoPago (procesamiento de pagos — nosotros
                nunca vemos los datos de tu tarjeta), Google (inicio de sesión)
                y nuestros proveedores de infraestructura (Vercel y Neon), cuyos
                servidores pueden estar ubicados fuera de la Argentina, en
                países o con salvaguardas que garantizan niveles adecuados de
                protección conforme al art. 12 de la Ley 25.326.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Cookies y sesión</h2>
              <p>
                Usamos cookies propias para mantener tu sesión y tu carrito
                (incluso si navegás sin cuenta) y métricas de visitas anónimas
                (Vercel Analytics, sin cookies de seguimiento). Podés
                deshabilitar las cookies desde tu navegador, pero el carrito y
                el inicio de sesión podrían dejar de funcionar.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Conservación</h2>
              <p>
                Conservamos tus datos mientras tengas cuenta o pedidos activos,
                y luego solo lo necesario para cumplir obligaciones legales,
                contables e impositivas.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Tus derechos</h2>
              <p>
                Como titular de los datos podés ejercer en cualquier momento y
                en forma gratuita los derechos de acceso, rectificación,
                actualización y supresión (arts. 6, 14, 16 y concordantes de la
                Ley 25.326). Escribinos por{' '}
                <a
                  href="https://wa.me/5491173666370"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp
                </a>{' '}
                o desde{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  contacto
                </Link>{' '}
                y respondemos dentro de los plazos legales.
              </p>
              <p className="text-sm bg-muted p-4 rounded-lg">
                LA AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de
                Órgano de Control de la Ley N° 25.326, tiene la atribución de
                atender las denuncias y reclamos que interpongan quienes
                resulten afectados en sus derechos por incumplimiento de las
                normas vigentes en materia de protección de datos personales.
                Más información en{' '}
                <a
                  href="https://www.argentina.gob.ar/aaip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  argentina.gob.ar/aaip
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
