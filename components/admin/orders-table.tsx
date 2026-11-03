'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  markDepositPaid,
  updateOrderStatus,
  type AdminOrderRow,
} from '@/lib/admin-api';

const STATUSES = [
  { value: 'pending_transfer', label: 'Pendiente de pago' },
  { value: 'paid_preparing', label: 'En fabricación' },
  { value: 'paid_ready_to_ship', label: 'Listo para enviar' },
  { value: 'paid_shipped', label: 'Enviado' },
  { value: 'paid_delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'refunded', label: 'Reembolsado' },
];

const money = (value: string | number | null) =>
  value === null
    ? '—'
    : new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
      }).format(Number(value));

const statusLabel = (status: string) =>
  STATUSES.find((s) => s.value === status)?.label ?? status;

const statusClass = (status: string) => {
  if (status.startsWith('paid_')) return 'bg-green-100 text-green-800';
  if (status === 'pending_transfer' || status === 'processing_payment')
    return 'bg-amber-100 text-amber-900';
  return 'bg-muted text-muted-foreground';
};

export function OrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const changeStatus = (order: AdminOrderRow, status: string) => {
    setDraft((prev) => ({ ...prev, [order.id]: status }));
    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, status);
        toast.success('Estado actualizado');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo cambiar');
      }
    });
  };

  const markDeposit = (order: AdminOrderRow) => {
    startTransition(async () => {
      try {
        await markDepositPaid(order.id);
        toast.success('Seña marcada como acreditada');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo marcar');
      }
    });
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const current = draft[order.id] ?? order.status;
        const shortId = order.id.slice(0, 8).toUpperCase();
        return (
          <div key={order.id} className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">#{shortId}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(current)}`}
                  >
                    {statusLabel(current)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString('es-AR')} ·{' '}
                  {order.customerEmail ?? 'sin email'}
                </p>
                <p className="text-sm">
                  {order.titles ?? '—'}{' '}
                  <span className="text-muted-foreground">
                    ({order.items} ítem{order.items === 1 ? '' : 's'})
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{money(order.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">
                  {order.deliveryMethod === 'pickup' ? 'Retiro' : 'Envío'}
                </p>
              </div>
            </div>

            {order.deliveryMethod !== 'pickup' && order.deliveryAddress && (
              <p className="mt-2 whitespace-pre-line rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">
                {order.deliveryAddress}
              </p>
            )}

            {order.depositAmount ? (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span>
                  Seña: <strong>{money(order.depositAmount)}</strong> · Saldo:{' '}
                  {money(order.balanceAmount)}
                </span>
                {order.depositPaidAt ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    seña acreditada
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markDeposit(order)}
                    disabled={pending}
                  >
                    Marcar seña acreditada
                  </Button>
                )}
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Select
                value={current}
                onValueChange={(value) => changeStatus(order, value)}
                disabled={pending}
              >
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                {order.customerPhone ?? ''}
              </span>
            </div>
          </div>
        );
      })}

      {orders.length === 0 && (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          Todavía no hay pedidos.
        </div>
      )}
    </div>
  );
}
