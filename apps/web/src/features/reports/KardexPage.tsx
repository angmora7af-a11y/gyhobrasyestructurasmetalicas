import { useState, type FormEvent } from "react";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Badge } from "@/components/ui/Badge";

type KardexEntry = {
  id: string;
  date: string;
  product_sku: string;
  product_name: string;
  client_name: string;
  site_name: string;
  movement_type: string;
  quantity: number;
  balance: number;
};

const movementTone: Record<string, "draft" | "pending" | "process" | "done"> = {
  dispatch: "process",
  return: "done",
  sale: "pending",
  adjustment: "draft",
};

const columns: Column<KardexEntry>[] = [
  { header: "Fecha", accessor: "date" },
  { header: "Producto", accessor: "product_sku", render: (row) => `${row.product_sku} — ${row.product_name}` },
  { header: "Cliente", accessor: "client_name" },
  { header: "Obra", accessor: "site_name" },
  {
    header: "Tipo",
    accessor: "movement_type",
    render: (row) => <Badge tone={movementTone[row.movement_type] ?? "draft"}>{row.movement_type}</Badge>,
  },
  { header: "Cantidad", accessor: "quantity", render: (row) => String(row.quantity) },
  { header: "Saldo", accessor: "balance", render: (row) => <span className="font-semibold">{row.balance}</span> },
];

type Filters = {
  nit: string;
  product: string;
  site: string;
  date_from: string;
  date_to: string;
};

const emptyFilters: Filters = { nit: "", product: "", site: "", date_from: "", date_to: "" };

export function KardexPage() {
  const [entries, setEntries] = useState<KardexEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.nit) params.set("nit", filters.nit);
      if (filters.product) params.set("product_id", filters.product);
      if (filters.site) params.set("site_id", filters.site);
      if (filters.date_from) params.set("date_from", filters.date_from);
      if (filters.date_to) params.set("date_to", filters.date_to);
      setEntries(await api.get<KardexEntry[]>(`/reports/kardex?${params.toString()}`));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function exportReport(format: "excel" | "pdf") {
    const params = new URLSearchParams();
    if (filters.nit) params.set("nit", filters.nit);
    if (filters.product) params.set("product_id", filters.product);
    if (filters.site) params.set("site_id", filters.site);
    if (filters.date_from) params.set("date_from", filters.date_from);
    if (filters.date_to) params.set("date_to", filters.date_to);

    try {
      const res = await fetch(`/api/v1/reports/kardex?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kardex-${format}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* export failed */
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Kardex</h2>
        <p className="text-sm text-on-surface-variant">HU-017 — Movimientos de inventario por producto/cliente.</p>
      </header>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 bg-surface-container-lowest p-6 shadow-ambient">
        <Input
          label="NIT"
          name="nit"
          value={filters.nit}
          onChange={(e) => setFilters((f) => ({ ...f, nit: e.target.value }))}
          className="w-40"
        />
        <Input
          label="Producto"
          name="product"
          value={filters.product}
          onChange={(e) => setFilters((f) => ({ ...f, product: e.target.value }))}
          className="w-40"
        />
        <Input
          label="Obra"
          name="site"
          value={filters.site}
          onChange={(e) => setFilters((f) => ({ ...f, site: e.target.value }))}
          className="w-40"
        />
        <Input
          label="Desde"
          name="date_from"
          type="date"
          value={filters.date_from}
          onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
          className="w-40"
        />
        <Input
          label="Hasta"
          name="date_to"
          type="date"
          value={filters.date_to}
          onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
          className="w-40"
        />
        <div className="flex items-end gap-2">
          <Button type="submit" disabled={loading}>
            <MaterialIcon name="search" className="text-sm" />
            {loading ? "Buscando…" : "Buscar"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="bg-error-container p-4">
          <p className="text-sm text-on-surface">{error}</p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => exportReport("excel")}>
            <MaterialIcon name="table_view" className="text-sm" />
            Exportar Excel
          </Button>
          <Button variant="secondary" onClick={() => exportReport("pdf")}>
            <MaterialIcon name="picture_as_pdf" className="text-sm" />
            Exportar PDF
          </Button>
        </div>
      )}

      <DataTable columns={columns} data={entries} emptyMessage="Aplique filtros para ver movimientos." />
    </div>
  );
}
