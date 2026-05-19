export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Política de Privacidad</h1>
          <p className="text-muted-foreground mb-12">
            Última actualización: 17 de mayo de 2026
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                1. Información que recopilamos
              </h2>
              <p>
                Recopilamos los datos que nos proporcionás al crear una cuenta,
                realizar una compra o contactarnos: nombre, email, dirección de
                envío, número de teléfono e información de pago procesada por
                nuestros proveedores.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Cómo usamos tus datos</h2>
              <p>
                Usamos tu información para procesar tus pedidos, enviarte
                actualizaciones del envío, responder consultas y mejorar nuestros
                productos. Nunca vendemos tus datos a terceros.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">3. Cookies y sesión</h2>
              <p>
                Usamos cookies para mantener tu sesión y tu carrito incluso si
                navegás sin iniciar sesión. Podés deshabilitarlas desde tu
                navegador, pero algunas funciones del sitio podrían dejar de
                funcionar.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Tus derechos</h2>
              <p>
                Tenés derecho a acceder, corregir o eliminar tus datos personales
                en cualquier momento. Para ejercerlos, escribinos a{' '}
                <a
                  href="mailto:hola@legas.com"
                  className="text-primary hover:underline"
                >
                  hola@legas.com
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Contacto</h2>
              <p>
                Si tenés dudas sobre esta política, escribinos a{' '}
                <a
                  href="mailto:hola@legas.com"
                  className="text-primary hover:underline"
                >
                  hola@legas.com
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
