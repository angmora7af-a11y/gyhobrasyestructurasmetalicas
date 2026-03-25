import { useState, useEffect, useCallback, type FormEvent } from "react";
import { z } from "zod";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Modal } from "@/components/ui/Modal";

type TicketLine = {
  product_sku: string;
  description: string;
  quantity: number;
};

type TicketComment = {
  id: string;
  author: string;
  text: string;
  created_at: string;
};

type Ticket = {
  id: string;
  reference: string;
  client_name: string;
  site_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  first_response_at: string | null;
  quotation_sent_at: string | null;
  lines: TicketLine[];
  comments: TicketComment[];
  valid_transitions: string[];
};

const statusTone: Record<string, "draft" | "pending" | "process" | "done"> = {
  draft: "draft",
  submitted: "pending",
  quoted: "process",
  approved: "done",
  in_progress: "process",
  completed: "done",
  cancelled: "draft",
};

const statusLabel: Record<string, string> = {
  draft: "Borrador",
  submitted: "Enviado",
  quoted: "Cotizado",
  approved: "Aprobado",
  in_progress: "En proceso",
  completed: "Completado",
  cancelled: "Cancelado",
};

const columns: Column<Ticket>[] = [
  { header: "Referencia", accessor: "reference", render: (row) => <span className="font-semibold">{row.reference}</span> },
  { header: "Cliente", accessor: "client_name" },
  {
    header: "Estado",
    accessor: "status",
    render: (row) => <Badge tone={statusTone[row.status] ?? "draft"}>{statusLabel[row.status] ?? row.status}</Badge>,
  },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" },
];

const ticketSchema = z.object({
  client_nit: z.string().min(1, "Cliente requerido"),
  site_name: z.string().min(1, "Obra requerida"),
  requested_date: z.string().min(1, "Fecha requerida"),
  comment: z.string(),
});

type FormValues = z.infer<typeof ticketSchema>;

const emptyForm: FormValues = { client_nit: "", site_name: "", requested_date: "", comment: "" };

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [lines, setLines] = useState<TicketLine[]>([]);
  const [newComment, setNewComment] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTickets(await api.get<Ticket[]>("/tickets"));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(emptyForm);
    setFormErrors({});
    setLines([]);
    setCreateOpen(true);
  }

  function openDetail(ticket: Ticket) {
    setSelected(ticket);
    setNewComment("");
    setDetailOpen(true);
  }

  function addLine() {
    setLines((prev) => [...prev, { product_sku: "", description: "", quantity: 1 }]);
  }

  function updateLine(idx: number, field: keyof TicketLine, value: string | number) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const parsed = ticketSchema.safeParse(form);
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
      await api.post("/tickets", { ...parsed.data, lines });
      setCreateOpen(false);
      load();
    } catch (e) {
      setFormErrors({ client_nit: e instanceof ApiError ? e.message : "Error al crear" });
    }
  }

  async function transitionStatus(ticketId: string, nextStatus: string) {
    try {
      await api.post(`/tickets/${ticketId}/transition`, { status: nextStatus });
      load();
      setDetailOpen(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error al cambiar estado");
    }
  }

  async function addComment(ticketId: string) {
    if (!newComment.trim()) return;
    try {
      await api.post(`/tickets/${ticketId}/comments`, { text: newComment });
      setNewComment("");
      const updated = await api.get<Ticket>(`/tickets/${ticketId}`);
      setSelected(updated);
    } catch {
      /* swallow */
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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Tickets</h2>
          <p className="text-sm text-on-surface-variant">HU-012/013 — Solicitudes de cotización y seguimiento.</p>
        </div>
        <Button onClick={openCreate}>
          <MaterialIcon name="add" className="text-sm" />
          Nuevo ticket
        </Button>
      </header>

      <DataTable columns={columns} data={tickets} onRowClick={openDetail} emptyMessage="No hay tickets." />

      {createOpen && (
        <Modal title="Nuevo ticket" onClose={() => setCreateOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
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
              label="Fecha requerida"
              name="requested_date"
              type="date"
              value={form.requested_date}
              onChange={(e) => setForm((f) => ({ ...f, requested_date: e.target.value }))}
              error={formErrors.requested_date}
            />

            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Líneas de producto
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

            <Input
              label="Comentario"
              name="comment"
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear ticket</Button>
            </div>
          </form>
        </Modal>
      )}

      {detailOpen && selected && (
        <Modal title={`Ticket ${selected.reference}`} onClose={() => setDetailOpen(false)}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                <strong className="text-on-surface-variant">Cliente:</strong> {selected.client_name}
              </span>
              <span>
                <strong className="text-on-surface-variant">Obra:</strong> {selected.site_name}
              </span>
              <Badge tone={statusTone[selected.status] ?? "draft"}>
                {statusLabel[selected.status] ?? selected.status}
              </Badge>
            </div>

            <div className="flex gap-4 text-xs text-on-surface-variant">
              <span>SLA respuesta: {selected.first_response_at ?? "Pendiente"}</span>
              <span>SLA cotización: {selected.quotation_sent_at ?? "Pendiente"}</span>
            </div>

            {selected.lines.length > 0 && (
              <div className="bg-surface-container-low p-4">
                <p className="mb-2 font-headline text-xs font-bold uppercase text-on-surface">Productos</p>
                {selected.lines.map((line, idx) => (
                  <div key={idx} className="flex justify-between py-1 text-sm">
                    <span>
                      {line.product_sku} — {line.description}
                    </span>
                    <span className="font-semibold">×{line.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <section className="space-y-2">
              <p className="font-headline text-xs font-bold uppercase text-on-surface">Comentarios</p>
              {selected.comments.map((c) => (
                <div key={c.id} className="bg-surface-container-low p-3">
                  <p className="text-xs font-semibold text-on-surface-variant">{c.author} — {c.created_at}</p>
                  <p className="text-sm">{c.text}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  name="new-comment"
                  placeholder="Agregar comentario…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="secondary" onClick={() => addComment(selected.id)}>
                  <MaterialIcon name="send" className="text-sm" />
                </Button>
              </div>
            </section>

            {selected.valid_transitions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selected.valid_transitions.map((next) => (
                  <Button key={next} variant="secondary" onClick={() => transitionStatus(selected.id, next)}>
                    {statusLabel[next] ?? next}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
