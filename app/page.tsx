import { getFeaturedProducts, getNewArrivals } from "@/lib/data"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { NewArrivals } from "@/components/new-arrivals"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default async function Home() {
  const [featuredProducts, newArrivals] = await Promise.all([getFeaturedProducts(), getNewArrivals()])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedProducts products={featuredProducts} />
        <NewArrivals products={newArrivals} />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
