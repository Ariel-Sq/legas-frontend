import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos del Servicio',
  description:
    'Condiciones de uso y compra en la tienda online de Legas Muebles.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main className="flex-1">
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Términos del Servicio</h1>
          <p className="text-muted-foreground mb-12">
            Última actualización: 4 de septiembre de 2026
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Quiénes somos</h2>
              <p>
                Legas Muebles es la marca comercial de{' '}
                <strong>Leonardo Gastón Gamarra</strong> (CUIT 20-32319747-5,
                monotributista), con domicilio en Juan de Herrera 2542, B1614
                Malvinas Argentinas, Provincia de Buenos Aires, Argentina.
                Vende muebles de madera fabricados a pedido. Atención al
                cliente por{' '}
                <a
                  href="https://wa.me/5491173666370"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp (+54 11 7366-6370)
                </a>
                . Al usar este sitio aceptás estos términos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Cuentas</h2>
              <p>
                El inicio de sesión es únicamente con tu cuenta de Google; no
                almacenamos contraseñas. Sos responsable del uso de tu cuenta;
                si detectás actividad no autorizada, avisanos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">3. Precios y pagos</h2>
              <p>
                Los precios publicados corresponden a pago en efectivo o
                transferencia. Los pagos online se procesan por MercadoPago con
                un recargo informado antes de confirmar la compra (dinero en
                cuenta o débito 10%, tarjeta de crédito 20%), siempre visible
                en el resumen del pedido. Los precios pueden actualizarse, pero
                las compras ya confirmadas se respetan al precio pagado. Ante
                un error manifiesto de publicación te contactaremos antes de
                procesar el pedido para ofrecerte confirmar o cancelar sin
                costo.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                4. Arrepentimiento, devoluciones y garantía
              </h2>
              <p>
                Tenés derecho a arrepentirte de la compra dentro de los 10 días
                corridos de recibida, sin costo, usando el{' '}
                <Link
                  href="/arrepentimiento"
                  className="text-primary hover:underline"
                >
                  botón de arrepentimiento
                </Link>
                . Los muebles nuevos tienen garantía legal de 6 meses (art. 11,
                Ley 24.240). Más detalle en{' '}
                <Link href="/shipping" className="text-primary hover:underline">
                  Envíos & Devoluciones
                </Link>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                5. Propiedad intelectual
              </h2>
              <p>
                El contenido del sitio (textos, imágenes, logo, diseño) es
                propiedad de Legas o se usa con autorización, y no puede
                reutilizarse sin permiso escrito.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Ley aplicable</h2>
              <p>
                Estos términos se rigen por las leyes de la República
                Argentina, incluyendo la Ley 24.240 de Defensa del Consumidor.
                Ante cualquier controversia podés recurrir a los tribunales
                que correspondan a tu domicilio y a los organismos de defensa
                del consumidor:{' '}
                <a
                  href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Ventanilla Única Federal de Defensa del Consumidor
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">7. Contacto</h2>
              <p>
                Por dudas sobre estos términos escribinos por{' '}
                <a
                  href="https://wa.me/5491173666370"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp
                </a>{' '}
                o desde la página de{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  contacto
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
