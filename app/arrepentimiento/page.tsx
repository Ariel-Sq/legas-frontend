import type { Metadata } from 'next';
import { CancellationForm } from '@/components/cancellation-form';

export const metadata: Metadata = {
  title: 'Botón de arrepentimiento',
  description:
    'Solicitá la cancelación de tu compra dentro de los 10 días corridos, sin costo (Ley 24.240 y Resolución 424/2020).',
  alternates: { canonical: '/arrepentimiento' },
};

export default function ArrepentimientoPage() {
  return (
    <main className="flex-1">
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Botón de arrepentimiento</h1>
          <p className="text-muted-foreground mb-2">
            Si te arrepentiste de una compra, podés pedir la cancelación dentro
            de los <strong>10 días corridos</strong> desde que recibiste el
            producto (o desde la compra, lo que ocurra después), sin ningún
            costo para vos. Los gastos de devolución corren por nuestra cuenta
            y el reintegro se hace al mismo medio de pago.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Conforme al art. 34 de la Ley 24.240, el art. 1110 del Código Civil
            y Comercial, y la Resolución 424/2020 de la Secretaría de Comercio
            Interior. No hace falta tener cuenta ni estar registrado.
          </p>

          <CancellationForm />
        </div>
      </section>
    </main>
  );
}
