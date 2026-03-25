import { useState, useEffect, useCallback, type FormEvent } from "react";
import { z } from "zod";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Modal } from "@/components/ui/Modal";

type Site = {
  id: string;
  name: string;
  address: string;
};

type Branch = {
  id: string;
  name: string;
  city: string;
  sites: Site[];
};

type Client = {
  id: string;
  nit: string;
  razon_social: string;
  siglas: string;
  status: string;
  branches: Branch[];
};

const statusTone: Record<string, "draft" | "pending" | "process" | "done"> = {
  active: "done",
  inactive: "draft",
  pending: "pending",
};

const columns: Column<Client>[] = [
  { header: "NIT", accessor: "nit" },
  { header: "Razón social", accessor: "razon_social" },
  { header: "Siglas", accessor: "siglas" },
  {
    header: "Estado",
    accessor: "status",
    render: (row) => <Badge tone={statusTone[row.status] ?? "draft"}>{row.status}</Badge>,
  },
];

const clientSchema = z.object({
  nit: z.string().min(1, "NIT requerido"),
  razon_social: z.string().min(1, "Razón social requerida"),
  siglas: z.string().min(1, "Siglas requeridas"),
  branch_name: z.string().optional(),
  branch_city: z.string().optional(),
  site_name: z.string().optional(),
  site_address: z.string().optional(),
});

type FormValues = z.infer<typeof clientSchema>;

const emptyForm: FormValues = {
  nit: "",
  razon_social: "",
  siglas: "",
  branch_name: "",
  branch_city: "",
  site_name: "",
  site_address: "",
};

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setClients(await api.get<Client[]>("/clients"));
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
    setSelected(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(client: Client) {
    setSelected(client);
    setForm({
      nit: client.nit,
      razon_social: client.razon_social,
      siglas: client.siglas,
    });
    setFormErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = clientSchema.safeParse(form);
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
      if (selected) {
        await api.patch(`/clients/${selected.id}`, parsed.data);
      } else {
        await api.post("/clients", parsed.data);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      setFormErrors({ nit: e instanceof ApiError ? e.message : "Error al guardar" });
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
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Clientes</h2>
          <p className="text-sm text-on-surface-variant">HU-010 — Empresas, sucursales y obras.</p>
        </div>
        <Button onClick={openNew}>
          <MaterialIcon name="add" className="text-sm" />
          Nuevo cliente
        </Button>
      </header>

      <DataTable columns={columns} data={clients} onRowClick={openEdit} emptyMessage="No hay clientes registrados." />

      {selected && (
        <section className="space-y-3 bg-surface-container-lowest p-6 shadow-ambient">
          <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">
            Sucursales — {selected.razon_social}
          </h3>
          {selected.branches.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Sin sucursales registradas.</p>
          ) : (
            selected.branches.map((branch) => (
              <div key={branch.id} className="bg-surface-container-low p-4">
                <p className="font-headline text-sm font-bold uppercase">{branch.name}</p>
                <p className="text-xs text-on-surface-variant">{branch.city}</p>
                {branch.sites.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {branch.sites.map((site) => (
                      <li key={site.id} className="text-xs text-on-surface-variant">
                        <MaterialIcon name="location_on" className="mr-1 text-xs" />
                        {site.name} — {site.address}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </section>
      )}

      {modalOpen && (
        <Modal title={selected ? "Editar cliente" : "Nuevo cliente"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="NIT"
              name="nit"
              value={form.nit}
              onChange={(e) => setForm((f) => ({ ...f, nit: e.target.value }))}
              error={formErrors.nit}
            />
            <Input
              label="Razón social"
              name="razon_social"
              value={form.razon_social}
              onChange={(e) => setForm((f) => ({ ...f, razon_social: e.target.value }))}
              error={formErrors.razon_social}
            />
            <Input
              label="Siglas"
              name="siglas"
              value={form.siglas}
              onChange={(e) => setForm((f) => ({ ...f, siglas: e.target.value }))}
              error={formErrors.siglas}
            />
            <fieldset className="space-y-3 bg-surface-container-low p-4">
              <legend className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Sucursal (opcional)
              </legend>
              <Input
                label="Nombre sucursal"
                name="branch_name"
                value={form.branch_name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, branch_name: e.target.value }))}
              />
              <Input
                label="Ciudad"
                name="branch_city"
                value={form.branch_city ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, branch_city: e.target.value }))}
              />
              <Input
                label="Nombre obra"
                name="site_name"
                value={form.site_name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))}
              />
              <Input
                label="Dirección obra"
                name="site_address"
                value={form.site_address ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, site_address: e.target.value }))}
              />
            </fieldset>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
