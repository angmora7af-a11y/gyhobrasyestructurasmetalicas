import { useState, useEffect, useCallback, type FormEvent, type ChangeEvent } from "react";
import { z } from "zod";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Modal } from "@/components/ui/Modal";

type CreditApplication = {
  id: string;
  client_name: string;
  nit: string;
  amount: number;
  status: string;
  created_at: string;
  notes: string;
};

const statusTone: Record<string, "draft" | "pending" | "process" | "done"> = {
  in_review: "process",
  approved: "done",
  rejected: "draft",
  conditioned: "pending",
};

const columns: Column<CreditApplication>[] = [
  { header: "Cliente", accessor: "client_name" },
  { header: "NIT", accessor: "nit" },
  {
    header: "Monto",
    accessor: "amount",
    render: (row) => `$${row.amount.toLocaleString()}`,
  },
  {
    header: "Estado",
    accessor: "status",
    render: (row) => <Badge tone={statusTone[row.status] ?? "pending"}>{row.status.replace("_", " ")}</Badge>,
  },
  { header: "Fecha", accessor: "created_at" },
];

const creditSchema = z.object({
  client_nit: z.string().min(1, "NIT del cliente requerido"),
  amount: z.coerce.number().positive("Monto debe ser positivo"),
  notes: z.string(),
});

type FormValues = z.infer<typeof creditSchema>;

const emptyForm: FormValues = { client_nit: "", amount: 0, notes: "" };

export function CreditPage() {
  const [items, setItems] = useState<CreditApplication[]>([]);
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
      setItems(await api.get<CreditApplication[]>("/credit"));
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
    const parsed = creditSchema.safeParse(form);
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
      fd.append("client_nit", parsed.data.client_nit);
      fd.append("amount", String(parsed.data.amount));
      fd.append("notes", parsed.data.notes);
      if (attachment) fd.append("file", attachment);
      await api.upload<CreditApplication>("/credit", fd);
      setModalOpen(false);
      load();
    } catch (e) {
      setFormErrors({ client_nit: e instanceof ApiError ? e.message : "Error al guardar" });
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
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Crédito</h2>
          <p className="text-sm text-on-surface-variant">HU-011 — Solicitudes de estudio de crédito.</p>
        </div>
        <Button onClick={openNew}>
          <MaterialIcon name="add" className="text-sm" />
          Nueva solicitud
        </Button>
      </header>

      <DataTable columns={columns} data={items} emptyMessage="No hay solicitudes de crédito." />

      {modalOpen && (
        <Modal title="Nueva solicitud de crédito" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="NIT del cliente"
              name="client_nit"
              value={form.client_nit}
              onChange={(e) => setForm((f) => ({ ...f, client_nit: e.target.value }))}
              error={formErrors.client_nit}
            />
            <Input
              label="Monto solicitado"
              name="amount"
              type="number"
              min={0}
              value={form.amount || ""}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
              error={formErrors.amount}
            />
            <Input
              label="Notas"
              name="notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Adjunto
              </label>
              <input type="file" onChange={handleFile} className="text-sm text-on-surface-variant" />
              {attachment && <p className="mt-1 text-xs text-on-surface-variant">{attachment.name}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
