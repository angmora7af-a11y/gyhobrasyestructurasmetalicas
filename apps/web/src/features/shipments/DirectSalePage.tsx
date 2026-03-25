import { useState, useEffect, useCallback, type FormEvent } from "react";
import { z } from "zod";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Modal } from "@/components/ui/Modal";

type SaleLine = {
  product_sku: string;
  description: string;
  quantity: number;
  unit_price: number;
};

type DirectSale = {
  id: string;
  display_code: string;
  client_name: string;
  site_name: string;
  date: string;
  total: number;
  lines: SaleLine[];
};

const columns: Column<DirectSale>[] = [
  {
    header: "Código",
    accessor: "display_code",
    render: (row) => <span className="font-headline text-sm font-bold text-primary">{row.display_code}</span>,
  },
  { header: "Cliente", accessor: "client_name" },
  { header: "Obra", accessor: "site_name" },
  { header: "Fecha", accessor: "date" },
  {
    header: "Total",
    accessor: "total",
    render: (row) => `$${row.total.toLocaleString()}`,
  },
];

const saleSchema = z.object({
  client_nit: z.string().min(1, "Cliente requerido"),
  site_name: z.string().min(1, "Obra requerida"),
  date: z.string().min(1, "Fecha requerida"),
});

type FormValues = z.infer<typeof saleSchema>;

const emptyForm: FormValues = { client_nit: "", site_name: "", date: "" };

export function DirectSalePage() {
  const [sales, setSales] = useState<DirectSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [lines, setLines] = useState<SaleLine[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSales(await api.get<DirectSale[]>("/shipments/direct-sales"));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function addLine() {
    setLines((prev) => [...prev, { product_sku: "", description: "", quantity: 1, unit_price: 0 }]);
  }

  function updateLine(idx: number, field: keyof SaleLine, value: string | number) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = saleSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") errs[key as keyof FormValues] = issue.message;
      }
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
    try {
      await api.post("/shipments/direct-sales", { ...parsed.data, lines });
      setModalOpen(false);
      load();
    } catch (e) {
      setFormErrors({ client_nit: e instanceof ApiError ? e.message : "Error al crear" });
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Ventas directas</h2>
          <p className="text-sm text-on-surface-variant">HU-015 — Remisiones de venta con precio unitario.</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setFormErrors({}); setLines([]); setModalOpen(true); }}>
          <MaterialIcon name="add" className="text-sm" />
          Nueva venta
        </Button>
      </header>

      <div className="bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
        <MaterialIcon name="info" className="mr-1 text-sm" />
        La aplicación NO emite factura electrónica (CPE). Las ventas se registran como remisión.
      </div>

      <DataTable columns={columns} data={sales} emptyMessage="No hay ventas directas." />

      {modalOpen && (
        <Modal title="Nueva venta directa" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="NIT cliente"
              name="client_nit"
              value={form.client_nit}
              onChange={(e) => setForm((f) => ({ ...f, client_nit: e.target.value }))}
              error={formErrors.client_nit}
            />
            <Input
              label="Obra / sitio"
              name="site_name"
              value={form.site_name}
              onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))}
              error={formErrors.site_name}
            />
            <Input
              label="Fecha"
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              error={formErrors.date}
            />

            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Líneas de venta
              </legend>
              {lines.map((line, idx) => (
                <div key={idx} className="flex items-end gap-2 bg-surface-container-low p-3">
                  <Input
                    label="SKU"
                    name={`sku-${idx}`}
                    value={line.product_sku}
                    onChange={(e) => updateLine(idx, "product_sku", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    label="Cant."
                    name={`qty-${idx}`}
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) => updateLine(idx, "quantity", Number(e.target.value))}
                    className="w-20"
                  />
                  <Input
                    label="Precio unit."
                    name={`price-${idx}`}
                    type="number"
                    min={0}
                    step="0.01"
                    value={line.unit_price || ""}
                    onChange={(e) => updateLine(idx, "unit_price", Number(e.target.value))}
                    className="w-32"
                  />
                  <button type="button" onClick={() => removeLine(idx)} className="text-on-surface-variant hover:text-error">
                    <MaterialIcon name="delete" className="text-sm" />
                  </button>
                </div>
              ))}
              <Button variant="ghost" onClick={addLine}>
                <MaterialIcon name="add" className="text-sm" />
                Agregar línea
              </Button>
            </fieldset>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear venta</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
