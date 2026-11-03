import Link from 'next/link';
import { listAdminOrders } from '@/lib/admin-api';
import { OrdersTable } from '@/components/admin/orders-table';

export const dynamic = 'force-dynamic';

const FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'pending_transfer', label: 'Pendientes' },
  { value: 'paid_preparing', label: 'En fabricación' },
  { value: 'paid_ready_to_ship', label: 'Listos' },
  { value: 'paid_shipped', label: 'Enviados' },
  { value: 'paid_delivered', label: 'Entregados' },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await listAdminOrders(status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          {orders.length} pedido{orders.length === 1 ? '' : 's'}
          {status ? ' con el filtro aplicado' : ''}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value || 'all'}
            href={filter.value ? `/admin/orders?status=${filter.value}` : '/admin/orders'}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              (status ?? '') === filter.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/70'
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
