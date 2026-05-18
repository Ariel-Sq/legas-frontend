import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary/20 rounded-xl p-8 sm:p-12 lg:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Explorá toda la colección
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            Descubrí una amplia variedad de muebles de madera artesanales para
            cada rincón de tu hogar.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-block bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all shadow-lg"
            >
              Ver tienda
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
