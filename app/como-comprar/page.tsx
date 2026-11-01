import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  MessageCircle,
  Package,
  ShoppingCart,
  Truck,
  Wallet,
} from 'lucide-react';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { EMAIL } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Cómo comprar',
  description:
    'Guía paso a paso para comprar muebles en Legas: elegir medidas, precios en efectivo o transferencia y con tarjeta en cuotas, envío o retiro, y seguimiento del pedido.',
  alternates: { canonical: '/como-comprar' },
};

const STEPS = [
  {
    title: 'Elegí tus muebles',
    body: 'Entrá al catálogo y filtrá por categoría o por material (álamo o petiribí). Cada producto muestra sus medidas disponibles y el precio de cada una. Si tenés dudas de medidas, telas o tintes, escribinos antes de comprar: te asesoramos sin compromiso.',
  },
  {
    title: 'Sumalo al carrito',
    body: 'Elegí la medida y la cantidad, y agregá el producto al carrito. Podés seguir comprando y revisar todo junto antes de pagar: cantidades, precio por unidad y total. Los productos que te gusten los podés guardar en favoritos con el corazón.',
  },
  {
    title: 'Completá tus datos de entrega',
    body: 'Te pedimos email, teléfono y DNI para coordinar la entrega y emitir la documentación. Después elegís envío o retiro en persona. Para envío cargás calle, número, depto, localidad, código postal y provincia, más una referencia (entre calles, portón) que nos ayuda a encontrar el domicilio.',
  },
  {
    title: 'Elegí cómo pagar',
    body: 'Podés pagar online con MercadoPago (tarjeta de crédito, débito o dinero en cuenta, hasta 6 cuotas) o pagar en efectivo o por transferencia coordinando con nosotros por WhatsApp. El precio cambia según el medio de pago y lo ves siempre antes de confirmar.',
  },
  {
    title: 'Recibí la confirmación y seguí tu pedido',
    body: 'Al confirmar te damos un número de pedido y te escribimos por WhatsApp para coordinar los detalles. Si tenés cuenta, en "Mis pedidos" ves el estado en cada etapa: en fabricación, listo para enviar, enviado y entregado.',
  },
];

const PAYMENTS = [
  {
    icon: Wallet,
    title: 'Efectivo o transferencia',
    detail: 'Precio en efectivo o transferencia',
    body: 'Es el precio que figura en cada producto. Al confirmar la compra te pasamos los datos por WhatsApp para transferir o coordinar el pago en efectivo. El pedido queda reservado y entra en fabricación cuando se acredita.',
  },
  {
    icon: CreditCard,
    title: 'MercadoPago con tarjeta',
    detail: 'Hasta 6 cuotas',
    body: 'Pagás online en el momento, con tarjeta de crédito, débito o dinero en cuenta. El precio con tarjeta es un 15% más alto que el precio en efectivo o transferencia, y los dos se muestran antes de confirmar. El pedido pasa a preparación cuando MercadoPago acredita el pago.',
  },
];

export default function HowToBuyPage() {
  return (
    <main className="flex-1">
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Cómo comprar</h1>
          <p className="text-muted-foreground mb-12">
            Comprar en Legas lleva unos minutos. Te contamos el paso a paso y
            todas las formas de pago y entrega.
          </p>

          <div className="space-y-12 text-base leading-relaxed">
            {/* Step by step */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">El paso a paso</h2>
              <ol className="space-y-6">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-muted-foreground">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Payments */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Formas de pago</h2>
              <p>
                En cada producto ves los dos precios: el de{' '}
                <strong>efectivo o transferencia</strong> y el de{' '}
                <strong>tarjeta hasta 6 cuotas</strong>. El que elijas al pagar
                es el que se cobra, sin sorpresas al final.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {PAYMENTS.map((payment) => (
                  <div
                    key={payment.title}
                    className="rounded-lg border bg-card p-5"
                  >
                    <payment.icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-3 font-semibold">{payment.title}</h3>
                    <p className="text-sm font-medium text-primary">
                      {payment.detail}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {payment.body}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                El costo del envío no está incluido en el precio del producto: se
                cotiza según la zona antes del despacho. Si no aceptás ese costo,
                podés cancelar la compra sin cargo y te reintegramos el total.
              </p>
            </section>

            {/* Delivery / pickup */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Envío o retiro</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-card p-5">
                  <Truck className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-semibold">Envío a domicilio</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Entregamos en todo el AMBA con flete de confianza. Si estás
                    en el interior del país, escribinos antes de comprar para
                    coordinar el transporte y conocer el costo hasta tu ciudad.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-5">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-semibold">Retiro en persona</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Podés retirar por el taller, en Juan de Herrera 2651, Villa
                    de Mayo, Malvinas Argentinas. Marcá &ldquo;Retiro en
                    persona&rdquo; en el checkout y coordinamos día y horario por
                    WhatsApp. Si además pagás en efectivo o por transferencia,
                    abonás una <strong>seña del 50%</strong> por transferencia
                    para reservar la pieza y el saldo lo pagás al retirar.
                  </p>
                </div>
              </div>
              <p>
                Los muebles se fabrican a pedido: el plazo estimado es de hasta 3
                semanas y te avisamos por WhatsApp en cada etapa. El detalle
                completo está en{' '}
                <Link
                  href="/shipping"
                  className="text-primary hover:underline"
                >
                  Envíos y devoluciones
                </Link>
                .
              </p>
            </section>

            {/* After the purchase */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Después de la compra
              </h2>
              <ul className="space-y-3">
                {[
                  'Te escribimos por WhatsApp para confirmar la fecha de fabricación y la entrega.',
                  'Si elegiste un tinte (petiribí, nogal o nogal oscuro), lo coordinamos en ese momento.',
                  'En sillas tapizadas, la tela y el color se eligen antes de la compra: escribinos y te mostramos las opciones.',
                  'Si pagaste por transferencia o efectivo, en esa misma conversación coordinamos el pago.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Account */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">¿Hace falta tener cuenta?</h2>
              <p>
                No. Podés comprar como invitado. Si entrás con Google tenés
                además el historial en{' '}
                <Link href="/orders" className="text-primary hover:underline">
                  Mis pedidos
                </Link>
                , tus datos de envío guardados y la lista de favoritos.
              </p>
            </section>

            {/* Help */}
            <section className="space-y-4 rounded-lg border bg-muted/30 p-6">
              <h2 className="flex items-center gap-2 text-2xl font-semibold">
                <MessageCircle className="h-6 w-6 text-primary" />
                ¿Te quedan dudas?
              </h2>
              <p className="text-muted-foreground">
                Escribinos por WhatsApp al{' '}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {WHATSAPP_DISPLAY}
                </a>{' '}
                o por email a{' '}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {EMAIL}
                </a>
                . Atendemos de lunes a viernes de 9 a 18 y sábados de 10 a 14.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ver la colección
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 font-semibold transition-colors hover:bg-muted/50"
                >
                  <Package className="h-5 w-5" />
                  Contacto
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
