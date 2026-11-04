import Link from 'next/link';
import { listAdminProducts } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await listAdminProducts(q);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} producto{products.length === 1 ? '' : 's'}
            {q ? ` para “${q}”` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          + Nuevo producto
        </Link>
        <form className="flex gap-2" action="/admin">
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Buscar por nombre o slug"
            className="w-64 rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Buscar
          </button>
        </form>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="w-16 p-3">Foto</th>
              <th className="p-3">Producto</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Variantes</th>
              <th className="p-3">Desde</th>
              <th className="p-3">Estado</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                    {p.mainImageUrl ? (
                      // Served straight from the CDN; the API proxy needs a
                      // cold start per image and gets rate-limited.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.mainImageUrl}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.slug}</div>
                </td>
                <td className="p-3 text-muted-foreground">{p.category ?? '—'}</td>
                <td className="p-3">{p.variations}</td>
                <td className="p-3">{formatPrice(p.minPrice)}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {p.is_active ? 'activo' : 'oculto'}
                    </span>
                    {p.is_featured && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                        destacado
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  No hay productos que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
