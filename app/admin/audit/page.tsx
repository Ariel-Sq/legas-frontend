import { notFound } from 'next/navigation';
import { getAdminMe, listAudit } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export default async function AdminAuditPage() {
  const me = await getAdminMe();
  if (!me.isOwner && me.role !== 'admin') notFound();

  const rows = await listAudit();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial de cambios</h1>
        <p className="text-sm text-muted-foreground">
          Últimos 100 movimientos hechos desde el panel.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Cuándo</th>
              <th className="p-3">Quién</th>
              <th className="p-3">Acción</th>
              <th className="p-3">Entidad</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.createdAt}-${index}`} className="border-t">
                <td className="p-3 text-muted-foreground">
                  {new Date(row.createdAt).toLocaleString('es-AR')}
                </td>
                <td className="p-3">{row.actorEmail ?? '—'}</td>
                <td className="p-3">{row.action}</td>
                <td className="p-3 text-muted-foreground">
                  {row.entity}
                  {row.entityId ? ` · ${row.entityId.slice(0, 8)}` : ''}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  Todavía no hay cambios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
