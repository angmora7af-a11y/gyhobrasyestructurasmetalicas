import { useState, useEffect, useCallback, type FormEvent } from "react";
import { z } from "zod";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Modal } from "@/components/ui/Modal";

type BillingLine = {
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

type BillingDraft = {
  id: string;
  period: string;
  client_name: string;
  status: string;
  total: number;
  lines: BillingLine[];
};

type ApiBillingDraftLine = {
  product_id: string;
  description: string | null;
  quantity: number;
  unit_price: number;
};

type ApiBillingDraft = {
  id: string;
  client_id: string;
  period_start: string;
  period_end: string;
  status: string;
  lines: ApiBillingDraftLine[];
};

const statusTone: Record<string, "draft" | "pending" | "process" | "done"> = {
  draft: "draft",
  pending: "pending",
  sent: "process",
  approved: "done",
};

const columns: Column<BillingDraft>[] = [
  { header: "Periodo", accessor: "period" },
  { header: "Cliente", accessor: "client_name" },
  {
    header: "Estado",
    accessor: "status",
    render: (row) => <Badge tone={statusTone[row.status] ?? "draft"}>{row.status}</Badge>,
  },
  {
    header: "Total",
    accessor: "total",
    render: (row) => `$${row.total.toLocaleString()}`,
  },
];

const draftSchema = z.object({
  client_nit: z.string().min(1, "Cliente requerido"),
  period: z.string().min(1, "Periodo requerido"),
});

type FormValues = z.infer<typeof draftSchema>;

const emptyForm: FormValues = { client_nit: "", period: "" };

export function BillingPage() {
  const [drafts, setDrafts] = useState<BillingDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [lines, setLines] = useState<BillingLine[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await api.get<ApiBillingDraft[]>("/billing-drafts");
      setDrafts(
        raw.map((d) => ({
          id: d.id,
          period: `${d.period_start} — ${d.period_end}`,
          client_name: d.client_id,
          status: d.status,
          total: d.lines.reduce((s, l) => s + l.quantity * l.unit_price, 0),
          lines: d.lines.map((l) => ({
            description: l.description ?? "",
            quantity: l.quantity,
            unit_price: l.unit_price,
            subtotal: l.quantity * l.unit_price,
          })),
        })),
      );
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
    setLines((prev) => [...prev, { description: "", quantity: 1, unit_price: 0, subtotal: 0 }]);
  }

  function updateLine(idx: number, field: keyof BillingLine, value: string | number) {
    setLines((prev) =>
      prev.map((l, i) => {
        if (i !== idx) return l;
        const updated = { ...l, [field]: value };
        updated.subtotal = updated.quantity * updated.unit_price;
        return updated;
      }),
    );
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = draftSchema.safeParse(form);
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
      await api.post("/billing/drafts", { ...parsed.data, lines });
      setModalOpen(false);
      load();
    } catch (e) {
      setFormErrors({ client_nit: e instanceof ApiError ? e.message : "Error al crear" });
    }
  }

  async function exportCsv() {
    try {
      const res = await fetch("/api/v1/billing-drafts/export", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "facturacion.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* export failed */
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
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Facturación</h2>
          <p className="text-sm text-on-surface-variant">HU-018 — Pre-facturas y proformas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportCsv}>
            <MaterialIcon name="download" className="text-sm" />
            Exportar CSV
          </Button>
          <Button onClick={() => { setForm(emptyForm); setFormErrors({}); setLines([]); setModalOpen(true); }}>
            <MaterialIcon name="add" className="text-sm" />
            Nuevo borrador
          </Button>
        </div>
      </header>

      <div className="bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
        <MaterialIcon name="info" className="mr-1 text-sm" />
        La aplicación NO emite factura electrónica (CPE). Este módulo genera pre-facturas para integración.
      </div>

      <DataTable columns={columns} data={drafts} emptyMessage="No hay borradores de facturación." />

      {modalOpen && (
        <Modal title="Nuevo borrador" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="NIT cliente"
              name="client_nit"
              value={form.client_nit}
              onChange={(e) => setForm((f) => ({ ...f, client_nit: e.target.value }))}
              error={formErrors.client_nit}
            />
            <Input
              label="Periodo (ej. 2026-03)"
              name="period"
              value={form.period}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
              error={formErrors.period}
            />

            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Líneas</legend>
              {lines.map((line, idx) => (
                <div key={idx} className="flex items-end gap-2 bg-surface-container-low p-3">
                  <Input
                    label="Descripción"
                    name={`desc-${idx}`}
                    value={line.description}
                    onChange={(e) => updateLine(idx, "description", e.target.value)}
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
              <Button type="submit">Crear borrador</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
