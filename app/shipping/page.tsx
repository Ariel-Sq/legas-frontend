import type { Metadata } from 'next';
import Link from 'next/link';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { EMAIL } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Envíos & Devoluciones',
  description:
    'Cómo se coordinan los envíos de tus muebles, y tus derechos de devolución y garantía.',
  alternates: { canonical: '/shipping' },
};

export default function ShippingPage() {
  return (
    <main className="flex-1">
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Envíos & Devoluciones</h1>
          <p className="text-muted-foreground mb-12">
            Última actualización: 7 de agosto de 2026
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Envíos</h2>
              <p>
                Nuestros muebles se fabrican a pedido. Después de tu compra te
                contactamos por WhatsApp para coordinar el plazo de fabricación,
                la fecha de entrega y el costo del envío, que depende de la zona
                y del tamaño del mueble. No confirmamos plazos ni costos que no
                podamos cumplir: todo queda acordado con vos por escrito antes
                del despacho.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Retiro en persona</h2>
              <p>
                Podés retirar tu pedido por el taller, en Juan de Herrera 2651,
                Villa de Mayo, Malvinas Argentinas, coordinando día y horario por
                WhatsApp. Si elegís pagar en efectivo o por transferencia, se
                abona una <strong>seña del 50%</strong> por transferencia para
                reservar la pieza y el saldo se paga al retirar. La seña no
                aplica a compras con envío.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Seguimiento</h2>
              <p>
                El estado de tu pedido se actualiza en{' '}
                <Link href="/orders" className="text-primary hover:underline">
                  Mis pedidos
                </Link>{' '}
                y te vamos avisando por WhatsApp en cada etapa (en fabricación,
                listo para enviar, enviado, entregado).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                Costo de envío y cancelación
              </h2>
              <p>
                El precio del producto no incluye el envío. El costo depende de
                la zona y del tamaño del mueble, y te lo informamos por WhatsApp
                antes del despacho, junto con la fecha estimada de entrega. Si
                no aceptás ese costo,{' '}
                <strong>
                  podés cancelar la compra sin cargo y te reintegramos el total
                </strong>{' '}
                por el mismo medio de pago.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                Derecho de arrepentimiento (10 días)
              </h2>
              <p>
                Podés arrepentirte de tu compra dentro de los{' '}
                <strong>10 días corridos</strong> desde que recibiste el
                producto, sin expresión de causa y{' '}
                <strong>sin ningún costo para vos</strong>: los gastos de
                devolución corren por nuestra cuenta (art. 34, Ley 24.240).
                Usá el{' '}
                <Link
                  href="/arrepentimiento"
                  className="text-primary hover:underline"
                >
                  botón de arrepentimiento
                </Link>{' '}
                y te damos un código de trámite al instante.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Garantía legal</h2>
              <p>
                Todos nuestros muebles nuevos tienen la garantía legal de{' '}
                <strong>6 meses</strong> por defectos de fabricación (art. 11,
                Ley 24.240). Si algo llega dañado o falla, escribinos por
                WhatsApp y lo resolvemos: reparación, reemplazo o reintegro,
                según corresponda. En estos casos, todos los costos de logística
                los cubrimos nosotros.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Reintegros</h2>
              <p>
                Los reintegros se procesan al mismo medio de pago que usaste.
                Una vez confirmada la cancelación o devolución, gestionamos el
                reembolso a través de MercadoPago; la acreditación depende de
                los plazos de tu banco o tarjeta.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">¿Dudas?</h2>
              <p>
                Escribinos por{' '}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp
                </a>
                , por email a{' '}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {EMAIL}
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
