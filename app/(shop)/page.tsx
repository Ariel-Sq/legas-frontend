import { getFeaturedProducts, getNewArrivals } from '@/lib/products';
import { getHero } from '@/lib/hero';
import { HeroSection } from '@/components/hero-section';
import { FeaturedProducts } from '@/components/featured-products';
import { NewArrivals } from '@/components/new-arrivals';
import { CTASection } from '@/components/cta-section';
import { InstagramSection } from '@/components/instagram-section';
import { SITE_URL } from '@/utils/environments';

// Organization + WebSite structured data (schema.org) for the home page —
// helps Google associate the site with the brand and show the site name.
const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FurnitureStore',
      name: 'Legas Muebles',
      url: SITE_URL,
      sameAs: ['https://www.instagram.com/legasmuebles/'],
      email: 'legasmuebles@gmail.com',
      description:
        'Muebles de madera artesanales: mesas de comedor, sillas, racks y más. Petiribí macizo y álamo.',
      currenciesAccepted: 'ARS',
      paymentAccepted: 'Efectivo, Transferencia, MercadoPago',
    },
    {
      '@type': 'WebSite',
      name: 'Legas Muebles',
      url: SITE_URL,
    },
  ],
};

export default async function Home() {
  const [hero, featuredProducts, newArrivals] = await Promise.all([
    getHero(),
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ORGANIZATION_JSON_LD),
        }}
      />
      <main className="flex-grow">
        <HeroSection content={hero} />
        <FeaturedProducts products={featuredProducts} />
        <NewArrivals products={newArrivals} />
        <InstagramSection />
        <CTASection />
      </main>
    </div>
  );
}
