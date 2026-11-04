import { getAdminHero } from '@/lib/admin-api';
import { HeroForm } from '@/components/admin/hero-form';
import { SITE_URL } from '@/utils/environments';

export const dynamic = 'force-dynamic';

export default async function AdminHeroPage() {
  const hero = await getAdminHero();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Portada</h1>
        <p className="text-sm text-muted-foreground">
          Es lo primero que se ve en la tienda. Cambiala cuando tengas una
          promo o una foto nueva: no hace falta tocar código.
        </p>
      </div>

      <HeroForm hero={hero} siteUrl={SITE_URL} />
    </div>
  );
}
