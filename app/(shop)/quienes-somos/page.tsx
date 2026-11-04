import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Hammer,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trees,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quiénes somos',
  description:
    'Legas Muebles: emprendimiento de muebles artesanales en álamo y petiribí, desde Villa de Mayo hacia todo el AMBA y el interior del país. Conocé nuestra historia y cómo trabajamos.',
  alternates: { canonical: '/quienes-somos' },
};

const VALUES = [
  {
    icon: HeartHandshake,
    title: 'Confianza y cercanía',
    body: 'Atendemos de forma directa, sin intermediarios. Nos escribís, te asesoramos y seguimos tu pedido hasta que llega a tu casa.',
  },
  {
    icon: ShieldCheck,
    title: 'Responsabilidad',
    body: 'Cumplimos los plazos y las medidas acordadas. Si algo se puede mejorar, lo hablamos antes de fabricar.',
  },
  {
    icon: Sparkles,
    title: 'Terminaciones cuidadas',
    body: 'Laca poliuretánica, cantos prolijos y detalles revisados uno por uno antes de despachar cada mueble.',
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Intro */}
      <section className="bg-[#f8ebd3] py-16 sm:py-20">
        <div className="container mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-[#2f2418] sm:text-5xl">
            Quiénes somos
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#5f4f3c] text-pretty">
            En <strong>Legas Muebles</strong> somos un emprendimiento dedicado
            a la fabricación y venta de muebles artesanales en madera de álamo y
            petiribí. Nacimos en 2022, impulsados por Leo, un emprendedor
            apasionado por la carpintería, con grandes sueños y el deseo de
            transformar su pasión por la madera en muebles únicos y de calidad.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container mx-auto max-w-3xl px-6 space-y-12">
          {/* Story */}
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Trees className="h-5 w-5 text-primary" />
              Madera con historia
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Creemos que cada mueble es mucho más que un objeto: es parte de un
              hogar, de una historia y de momentos compartidos. Por eso ponemos
              especial dedicación en cada etapa de fabricación, cuidando cada
              detalle y priorizando las terminaciones para lograr productos que
              se destaquen por su estética, resistencia y durabilidad.
            </p>
          </div>

          {/* Differentiator */}
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Hammer className="h-5 w-5 text-primary" />
              Nuestro diferencial: la laca poliuretánica
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Uno de nuestros principales diferenciales es el uso de{' '}
              <strong className="text-foreground">laca poliuretánica</strong>, un
              tratamiento que brinda una mayor protección a la madera y
              contribuye a prolongar la vida útil de nuestros muebles.
              Trabajamos para ofrecer una excelente relación entre calidad y
              precio, sin descuidar aquello que nos caracteriza: el compromiso
              con cada producto que fabricamos.
            </p>
          </div>

          {/* Location */}
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <MapPin className="h-5 w-5 text-primary" />
              Dónde estamos
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Desde Villa de Mayo, partido de Malvinas Argentinas, Buenos Aires,
              llegamos a hogares de todo el AMBA y a distintas localidades del
              interior del país.
            </p>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-2xl font-bold">Lo que nos representa</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="rounded-xl border bg-card p-5"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 font-semibold">{value.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {value.body}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Nos representan la confianza, la responsabilidad, la cercanía y el
              compromiso con nuestros clientes. En Legas Muebles trabajamos día a
              día para crecer, mejorar y ofrecer muebles hechos con dedicación,
              pasión y amor por la carpintería.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="pb-16 sm:pb-20">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="rounded-2xl bg-primary/15 p-8 text-center">
            <p className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
              Legas Muebles
            </p>
            <p className="mt-2 text-lg text-muted-foreground">
              Calidad artesanal, simple, natural y moderno.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Ver la colección
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-muted"
              >
                Hablar con nosotros
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
