export default function TermsPage() {
  return (
    <main className="flex-1">
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Términos del Servicio</h1>
          <p className="text-muted-foreground mb-12">
            Última actualización: 17 de mayo de 2026
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Aceptación</h2>
              <p>
                Al usar Woodland aceptás estos términos. Si no estás de acuerdo,
                te pedimos que no uses el sitio.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Cuentas</h2>
              <p>
                Sos responsable de mantener la confidencialidad de tu cuenta y
                contraseña, y de todas las actividades que se realicen desde
                ella. Avisanos si detectás un uso no autorizado.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">3. Pedidos y pagos</h2>
              <p>
                Los precios y la disponibilidad pueden cambiar sin aviso previo.
                Nos reservamos el derecho de cancelar pedidos por errores de
                precio, falta de stock o sospecha de fraude. Los pagos se
                procesan a través de Mercado Pago.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Devoluciones</h2>
              <p>
                Para condiciones de devolución y reintegros, mirá nuestra página
                de{' '}
                <a href="/shipping" className="text-primary hover:underline">
                  Envíos & Devoluciones
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Propiedad intelectual</h2>
              <p>
                Todo el contenido del sitio (textos, imágenes, logo, diseño) es
                propiedad de Woodland y no puede reutilizarse sin nuestra
                autorización escrita.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Contacto</h2>
              <p>
                Por dudas sobre estos términos escribinos a{' '}
                <a
                  href="mailto:hola@woodland.com"
                  className="text-primary hover:underline"
                >
                  hola@woodland.com
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
