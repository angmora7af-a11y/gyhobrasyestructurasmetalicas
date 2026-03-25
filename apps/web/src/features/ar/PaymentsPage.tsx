import { useState, useEffect, useCallback, type FormEvent, type ChangeEvent } from "react";
import { z } from "zod";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";

type Payment = {
  id: string;
  invoice_number: string;
  channel: string;
  reference: string;
  amount: number;
  date: string;
  attachment_url: string | null;
};

const columns: Column<Payment>[] = [
  { header: "Factura", accessor: "invoice_number" },
  { header: "Canal", accessor: "channel" },
  { header: "Referencia", accessor: "reference" },
  {
    header: "Monto",
    accessor: "amount",
    render: (row) => `$${row.amount.toLocaleString()}`,
  },
  { header: "Fecha", accessor: "date" },
  {
    header: "Adjunto",
    accessor: "attachment_url",
    render: (row) =>
      row.attachment_url ? (
        <a href={row.attachment_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          <MaterialIcon name="attach_file" className="text-sm" />
        </a>
      ) : (
        "—"
      ),
  },
];

const channels = [
  { value: "", label: "— Seleccione —" },
  { value: "transferencia", label: "Transferencia" },
  { value: "cheque", label: "Cheque" },
  { value: "efectivo", label: "Efectivo" },
  { value: "pse", label: "PSE" },
  { value: "otro", label: "Otro" },
];

const paymentSchema = z.object({
  invoice_number: z.string().min(1, "Factura requerida"),
  channel: z.string().min(1, "Canal requerido"),
  reference: z.string().min(1, "Referencia requerida"),
  amount: z.coerce.number().positive("Monto debe ser positivo"),
  date: z.string().min(1, "Fecha requerida"),
});

type FormValues = z.infer<typeof paymentSchema>;

const emptyForm: FormValues = { invoice_number: "", channel: "", reference: "", amount: 0, date: "" };

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [attachment, setAttachment] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPayments(await api.get<Payment[]>("/finance/payments"));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setForm(emptyForm);
    setFormErrors({});
    setAttachment(null);
    setModalOpen(true);
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setAttachment(e.target.files?.[0] ?? null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = paymentSchema.safeParse(form);
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
      const fd = new FormData();
      fd.append("invoice_number", parsed.data.invoice_number);
      fd.append("channel", parsed.data.channel);
      fd.append("reference", parsed.data.reference);
      fd.append("amount", String(parsed.data.amount));
      fd.append("date", parsed.data.date);
      if (attachment) fd.append("file", attachment);
      await api.upload<Payment>("/finance/payments", fd);
      setModalOpen(false);
      load();
    } catch (e) {
      setFormErrors({ invoice_number: e instanceof ApiError ? e.message : "Error al registrar" });
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
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Pagos</h2>
          <p className="text-sm text-on-surface-variant">HU-021 — Registro de pagos contra facturas.</p>
        </div>
        <Button onClick={openNew}>
          <MaterialIcon name="add" className="text-sm" />
          Registrar pago
        </Button>
      </header>

      <DataTable columns={columns} data={payments} emptyMessage="No hay pagos registrados." />

      {modalOpen && (
        <Modal title="Registrar pago" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Número de factura"
              name="invoice_number"
              value={form.invoice_number}
              onChange={(e) => setForm((f) => ({ ...f, invoice_number: e.target.value }))}
              error={formErrors.invoice_number}
            />
            <Select
              label="Canal"
              name="channel"
              options={channels}
              value={form.channel}
              onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))}
              error={formErrors.channel}
            />
            <Input
              label="Referencia"
              name="reference"
              value={form.reference}
              onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
              error={formErrors.reference}
            />
            <Input
              label="Monto"
              name="amount"
              type="number"
              min={0}
              step="0.01"
              value={form.amount || ""}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
              error={formErrors.amount}
            />
            <Input
              label="Fecha"
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              error={formErrors.date}
            />
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Archivo adjunto
              </label>
              <input type="file" onChange={handleFile} className="text-sm text-on-surface-variant" />
              {attachment && <p className="mt-1 text-xs text-on-surface-variant">{attachment.name}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Registrar</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
