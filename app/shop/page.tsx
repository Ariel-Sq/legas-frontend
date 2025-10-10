import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShopContent } from "@/components/shop-content";
import { getShopProducts, getFilterOptions } from "@/lib/data";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const products = await getShopProducts();
  const filterOptions = await getFilterOptions();
  const params = await searchParams;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ShopContent
        products={products}
        filterOptions={filterOptions}
        searchQuery={params.search}
      />
      <Footer />
    </div>
  );
}
