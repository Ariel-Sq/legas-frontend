import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import { getAboutContent } from '@/lib/company';

export default async function AboutPage() {
  const aboutContent = await getAboutContent();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold mb-6 text-center">
              {aboutContent.title}
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-12">
              {aboutContent.subtitle}
            </p>

            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-12">
              <Image
                src={aboutContent.workshopImage || '/placeholder.svg'}
                alt="Woodland workshop"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6 text-lg leading-relaxed">
              {aboutContent.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {aboutContent.statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
