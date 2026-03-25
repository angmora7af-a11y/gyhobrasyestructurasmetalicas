import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable, type Column } from "@/components/ui/DataTable";

type DashboardKpis = {
  active_rentals: number;
  open_tickets: number;
  pending_invoices: number;
  overdue_amount: number;
};

type RecentTicket = {
  id: string;
  reference: string;
  status: string;
  updated_at: string;
};

const fallbackKpis: DashboardKpis = {
  active_rentals: 0,
  open_tickets: 0,
  pending_invoices: 0,
  overdue_amount: 0,
};

const statusTone: Record<string, "draft" | "pending" | "process" | "done"> = {
  draft: "draft",
  submitted: "pending",
  quoted: "process",
  approved: "done",
  in_progress: "process",
  completed: "done",
};

const ticketColumns: Column<RecentTicket>[] = [
  {
    header: "Referencia",
    accessor: "reference",
    render: (row) => <span className="font-semibold">{row.reference}</span>,
  },
  {
    header: "Estado",
    accessor: "status",
    render: (row) => <Badge tone={statusTone[row.status] ?? "draft"}>{row.status}</Badge>,
  },
  { header: "Actualización", accessor: "updated_at" },
];

export function AdminDashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpis>(fallbackKpis);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiData, ticketsData] = await Promise.all([
        api.get<DashboardKpis>("/dashboard/kpis"),
        api.get<RecentTicket[]>("/dashboard/recent-tickets"),
      ]);
      setKpis(kpiData);
      setRecentTickets(ticketsData);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">
            Operations Overview
          </h2>
          <p className="text-sm font-medium text-on-surface-variant">
            Estado en tiempo real de activos logísticos (HU-022 — KPIs).
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/tickets">
            <Button>
              <MaterialIcon name="add" className="text-sm" />
              Nueva solicitud
            </Button>
          </Link>
          {error && (
            <Button variant="secondary" onClick={load}>
              <MaterialIcon name="refresh" className="text-sm" />
              Reintentar
            </Button>
          )}
        </div>
      </section>

      {loading ? (
        <section className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse border-t-4 border-primary bg-surface-container-lowest shadow-ambient" />
          ))}
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Equipos en arriendo" value={kpis.active_rentals} tone="process" toneLabel="Activo" />
          <KpiCard label="Tickets abiertos" value={kpis.open_tickets} tone="pending" toneLabel="Abierto" />
          <KpiCard label="Facturas pendientes" value={kpis.pending_invoices} tone="draft" toneLabel="Pendiente" />
          <KpiCard
            label="Cartera vencida"
            value={`$${kpis.overdue_amount.toLocaleString()}`}
            tone={kpis.overdue_amount > 0 ? "draft" : "done"}
            toneLabel={kpis.overdue_amount > 0 ? "Alerta" : "Al día"}
          />
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        <Link to="/admin/catalog">
          <Button variant="secondary">
            <MaterialIcon name="inventory" className="text-sm" />
            Catálogo
          </Button>
        </Link>
        <Link to="/admin/clients">
          <Button variant="secondary">
            <MaterialIcon name="business" className="text-sm" />
            Clientes
          </Button>
        </Link>
        <Link to="/admin/shipments">
          <Button variant="secondary">
            <MaterialIcon name="local_shipping" className="text-sm" />
            Remisiones
          </Button>
        </Link>
        <Link to="/admin/reports/kardex">
          <Button variant="secondary">
            <MaterialIcon name="analytics" className="text-sm" />
            Kardex
          </Button>
        </Link>
      </section>

      <section className="bg-surface-container-low p-6">
        <h3 className="mb-4 font-headline text-lg font-bold uppercase text-on-surface">Bandeja reciente</h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse bg-surface-container" />
            ))}
          </div>
        ) : (
          <DataTable columns={ticketColumns} data={recentTickets} emptyMessage="Sin tickets recientes." />
        )}
      </section>

      <div className="bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
        <MaterialIcon name="info" className="mr-1 text-sm" />
        Transporte, daños y repuestos están fuera del alcance MVP.
      </div>
    </div>
  );
}
