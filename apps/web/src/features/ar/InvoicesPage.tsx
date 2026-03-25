import { useState, useEffect, useCallback } from "react";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type Invoice = {
  id: string;
  number: string;
  client_name: string;
  amount: number;
  paid_amount: number;
  status: string;
  due_date: string;
  is_overdue: boolean;
};

const statusTone: Record<string, "draft" | "pending" | "process" | "done"> = {
  pending: "pending",
  partial: "process",
  paid: "done",
  overdue: "draft",
};

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  partial: "Pago parcial",
  paid: "Pagada",
  overdue: "Vencida",
};

const columns: Column<Invoice>[] = [
  {
    header: "Número",
    accessor: "number",
    render: (row) => <span className="font-semibold">{row.number}</span>,
  },
  { header: "Cliente", accessor: "client_name" },
  {
    header: "Monto",
    accessor: "amount",
    render: (row) => `$${row.amount.toLocaleString()}`,
  },
  {
    header: "Pagado",
    accessor: "paid_amount",
    render: (row) => `$${row.paid_amount.toLocaleString()}`,
  },
  {
    header: "Estado",
    accessor: "status",
    render: (row) => (
      <Badge tone={statusTone[row.status] ?? "pending"}>
        {statusLabel[row.status] ?? row.status}
      </Badge>
    ),
  },
  {
    header: "Vencimiento",
    accessor: "due_date",
    render: (row) => (
      <span className={row.is_overdue ? "font-bold text-error" : ""}>
        {row.due_date}
      </span>
    ),
  },
];

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setInvoices(await api.get<Invoice[]>("/finance/invoices"));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function sendReminder(invoiceId: string) {
    try {
      await api.post(`/finance/invoices/${invoiceId}/reminder`);
    } catch {
      /* reminder failed */
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse bg-surface-container-low" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-container p-6">
        <p className="text-sm text-on-surface">{error}</p>
        <Button variant="secondary" onClick={load} className="mt-4">
          <MaterialIcon name="refresh" className="text-sm" />
          Reintentar
        </Button>
      </div>
    );
  }

  const overdue = invoices.filter((i) => i.is_overdue);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Cartera</h2>
        <p className="text-sm text-on-surface-variant">HU-019/020 — Facturas espejo Siigo y seguimiento de cartera.</p>
      </header>

      {overdue.length > 0 && (
        <div className="bg-error-container p-4">
          <p className="text-sm font-semibold text-on-surface">
            <MaterialIcon name="warning" className="mr-1 text-sm" />
            {overdue.length} factura(s) vencida(s)
          </p>
        </div>
      )}

      <DataTable columns={columns} data={invoices} emptyMessage="No hay facturas registradas." />

      {overdue.length > 0 && (
        <section className="space-y-2">
          <p className="font-headline text-sm font-bold uppercase text-on-surface">Acciones sobre vencidas</p>
          {overdue.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between bg-surface-container-lowest p-3">
              <span className="text-sm">
                {inv.number} — {inv.client_name} — ${inv.amount.toLocaleString()}
              </span>
              <Button variant="secondary" onClick={() => sendReminder(inv.id)}>
                <MaterialIcon name="mail" className="text-sm" />
                Enviar recordatorio
              </Button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
