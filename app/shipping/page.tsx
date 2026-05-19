export default function ShippingPage() {
  return (
    <main className="flex-1">
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Envíos & Devoluciones</h1>
          <p className="text-muted-foreground mb-12">
            Todo lo que necesitás saber sobre cómo te llegan tus muebles y qué
            hacer si algo no es lo que esperabas.
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Envíos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Envío estándar gratis en compras superiores a $500.000.
                </li>
                <li>
                  Tiempo estimado de entrega: 5 a 7 días hábiles en CABA y GBA;
                  7 a 10 días en el resto del país.
                </li>
                <li>
                  Los muebles grandes se entregan en planta baja. Subir piezas
                  por escalera o ascensor pequeño puede tener un cargo adicional
                  (te lo coordinamos por email antes del envío).
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Seguimiento</h2>
              <p>
                Cuando despachamos tu pedido te llega un email con el código de
                tracking. También podés ver el estado desde tu cuenta en{' '}
                <a href="/orders" className="text-primary hover:underline">
                  Mis pedidos
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Devoluciones</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Tenés 30 días desde la recepción para pedir un cambio o
                  devolución.
                </li>
                <li>
                  El mueble tiene que estar en su estado original, sin uso ni
                  ensamblado.
                </li>
                <li>
                  Los costos de logística inversa los cubre el cliente, salvo en
                  casos de defecto de fabricación o error de despacho de nuestra
                  parte.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Reintegros</h2>
              <p>
                Una vez que recibimos y verificamos el producto, procesamos el
                reintegro al mismo medio de pago en un plazo de 5 días hábiles.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">¿Dudas?</h2>
              <p>
                Escribinos a{' '}
                <a
                  href="mailto:hola@legas.com"
                  className="text-primary hover:underline"
                >
                  hola@legas.com
                </a>{' '}
                o usá el{' '}
                <a href="/contact" className="text-primary hover:underline">
                  formulario de contacto
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
