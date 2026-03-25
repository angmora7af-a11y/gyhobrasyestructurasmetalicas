import { useState, useEffect, useCallback, type FormEvent } from "react";
import { z } from "zod";

import { api, ApiError } from "@/lib/api";
import { ROLES, type Role } from "@/types/role";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Modal } from "@/components/ui/Modal";

type User = {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  status: string;
};

const roleLabels: Record<Role, string> = {
  cliente: "Cliente",
  aportante_catalogo: "Aportante catálogo",
  admin: "Administrador",
  logistica: "Logística",
  facturacion: "Facturación",
  cartera: "Cartera",
  credito: "Crédito",
};

const columns: Column<User>[] = [
  { header: "Nombre", accessor: "name" },
  { header: "Email", accessor: "email" },
  {
    header: "Roles",
    accessor: "roles",
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.roles.map((r) => (
          <Badge key={r} tone="process">
            {roleLabels[r] ?? r}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    header: "Estado",
    accessor: "status",
    render: (row) => (
      <Badge tone={row.status === "active" ? "done" : "draft"}>{row.status}</Badge>
    ),
  },
];

const userSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(1, "Nombre requerido"),
  password: z.string().min(8, "Mínimo 8 caracteres").optional().or(z.literal("")),
  roles: z.array(z.enum(ROLES as unknown as [string, ...string[]])).min(1, "Al menos un rol"),
});

type FormValues = z.infer<typeof userSchema>;

const emptyForm: FormValues = { email: "", name: "", password: "", roles: [] };

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await api.get<User[]>("/users"));
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
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setForm({ email: user.email, name: user.name, password: "", roles: user.roles });
    setFormErrors({});
    setModalOpen(true);
  }

  function toggleRole(role: Role) {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = userSchema.safeParse(form);
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
      const payload = { ...parsed.data };
      if (!payload.password) delete payload.password;
      if (editing) {
        await api.patch(`/users/${editing.id}`, payload);
      } else {
        await api.post("/users", payload);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      setFormErrors({ email: e instanceof ApiError ? e.message : "Error al guardar" });
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
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Usuarios</h2>
          <p className="text-sm text-on-surface-variant">HU-003 — Gestión de usuarios y roles.</p>
        </div>
        <Button onClick={openNew}>
          <MaterialIcon name="person_add" className="text-sm" />
          Nuevo usuario
        </Button>
      </header>

      <DataTable columns={columns} data={users} onRowClick={openEdit} emptyMessage="No hay usuarios registrados." />

      {modalOpen && (
        <Modal title={editing ? "Editar usuario" : "Nuevo usuario"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={formErrors.email}
            />
            <Input
              label="Nombre"
              name="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={formErrors.name}
            />
            <Input
              label={editing ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
              name="password"
              type="password"
              value={form.password ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              error={formErrors.password}
            />
            <fieldset className="space-y-2">
              <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Roles</legend>
              {formErrors.roles && <p className="text-xs text-error">{formErrors.roles}</p>}
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((role) => (
                  <label key={role} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.roles.includes(role as Role)}
                      onChange={() => toggleRole(role)}
                      className="accent-primary"
                    />
                    {roleLabels[role]}
                  </label>
                ))}
              </div>
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
