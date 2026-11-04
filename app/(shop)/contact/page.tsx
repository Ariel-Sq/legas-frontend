import { Phone, MapPin, Instagram, Mail } from 'lucide-react';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/company';
import { ContactForm } from '@/components/contact-form';
import { getContactInfo } from '@/lib/company';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Escribinos por WhatsApp para consultas sobre muebles de madera, medidas y envíos.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const contactInfo = await getContactInfo();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-5xl font-bold mb-6 text-center">
              Hablemos
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-12">
              Nos encantaría saber de vos. Mandanos un mensaje y te respondemos
              a la brevedad.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Información de contacto
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Dirección</h3>
                      <p className="text-muted-foreground">
                        {contactInfo.address.street}
                        <br />
                        {contactInfo.address.city}, {contactInfo.address.state}{' '}
                        {contactInfo.address.zip}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Teléfono</h3>
                      <p className="text-muted-foreground">
                        {contactInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-muted-foreground hover:text-primary hover:underline transition-colors break-all"
                      >
                        {contactInfo.email}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Para consultas, pedidos y trámites de privacidad.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <Instagram className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Instagram</h3>
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {INSTAGRAM_HANDLE}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Seguinos para ver las piezas terminadas y las novedades
                        del taller.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Horarios de atención</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>{contactInfo.businessHours.weekdays}</p>
                    <p>{contactInfo.businessHours.saturday}</p>
                    <p>{contactInfo.businessHours.sunday}</p>
                  </div>
                </div>
              </div>

              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
