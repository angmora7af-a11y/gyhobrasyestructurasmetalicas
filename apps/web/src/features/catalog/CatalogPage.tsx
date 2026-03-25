import { useState, useEffect, useCallback, type FormEvent } from "react";
import { z } from "zod";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";

type Product = {
  id: string;
  sku_code: string;
  description: string;
  category: string;
  is_rental: boolean;
  is_sale: boolean;
  price_per_day: number | null;
  price_sale: number | null;
  status: string;
  notes: string;
};

const statusTone: Record<string, "draft" | "pending" | "process" | "done"> = {
  active: "done",
  inactive: "draft",
  pending: "pending",
};

const columns: Column<Product>[] = [
  { header: "SKU", accessor: "sku_code" },
  { header: "Descripción", accessor: "description" },
  { header: "Categoría", accessor: "category" },
  {
    header: "Precio/día",
    accessor: "price_per_day",
    render: (row) => (row.price_per_day != null ? `$${row.price_per_day.toLocaleString()}` : "—"),
  },
  {
    header: "Precio venta",
    accessor: "price_sale",
    render: (row) => (row.price_sale != null ? `$${row.price_sale.toLocaleString()}` : "—"),
  },
  {
    header: "Estado",
    accessor: "status",
    render: (row) => <Badge tone={statusTone[row.status] ?? "draft"}>{row.status}</Badge>,
  },
];

const productSchema = z
  .object({
    sku_code: z.string().min(1, "Código requerido"),
    description: z.string().min(1, "Descripción requerida"),
    category: z.string().min(1, "Categoría requerida"),
    is_rental: z.boolean(),
    is_sale: z.boolean(),
    price_per_day: z.coerce.number().nullable(),
    price_sale: z.coerce.number().nullable(),
    notes: z.string(),
  })
  .refine((d) => !d.is_rental || (d.price_per_day != null && d.price_per_day > 0), {
    message: "Precio/día debe ser > 0 si modalidad arriendo",
    path: ["price_per_day"],
  });

type FormValues = z.infer<typeof productSchema>;

const emptyForm: FormValues = {
  sku_code: "",
  description: "",
  category: "",
  is_rental: false,
  is_sale: false,
  price_per_day: null,
  price_sale: null,
  notes: "",
};

const categories = [
  { value: "", label: "— Seleccione —" },
  { value: "estructura", label: "Estructura metálica" },
  { value: "andamio", label: "Andamio" },
  { value: "encofrado", label: "Encofrado" },
  { value: "herramienta", label: "Herramienta" },
  { value: "otro", label: "Otro" },
];

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await api.get<Product[]>("/products"));
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
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = productSchema.safeParse(form);
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
      await api.post("/products", parsed.data);
      setModalOpen(false);
      load();
    } catch (e) {
      setFormErrors({ sku_code: e instanceof ApiError ? e.message : "Error al guardar" });
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
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Catálogo</h2>
          <p className="text-sm text-on-surface-variant">HU-007 — Gestión de productos y equipos.</p>
        </div>
        <Button onClick={openNew}>
          <MaterialIcon name="add" className="text-sm" />
          Nuevo producto
        </Button>
      </header>

      <DataTable columns={columns} data={products} emptyMessage="No hay productos registrados." />

      {modalOpen && (
        <Modal title="Nuevo producto" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Código SKU"
              name="sku_code"
              value={form.sku_code}
              onChange={(e) => setForm((f) => ({ ...f, sku_code: e.target.value }))}
              error={formErrors.sku_code}
            />
            <Input
              label="Descripción"
              name="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              error={formErrors.description}
            />
            <Select
              label="Categoría"
              name="category"
              options={categories}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              error={formErrors.category}
            />
            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Modalidad</legend>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_rental}
                  onChange={(e) => setForm((f) => ({ ...f, is_rental: e.target.checked }))}
                  className="accent-primary"
                />
                Arriendo
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_sale}
                  onChange={(e) => setForm((f) => ({ ...f, is_sale: e.target.checked }))}
                  className="accent-primary"
                />
                Venta
              </label>
            </fieldset>
            {form.is_rental && (
              <Input
                label="Precio por día"
                name="price_per_day"
                type="number"
                min={0}
                step="0.01"
                value={form.price_per_day ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, price_per_day: e.target.value ? Number(e.target.value) : null }))}
                error={formErrors.price_per_day}
              />
            )}
            {form.is_sale && (
              <Input
                label="Precio venta"
                name="price_sale"
                type="number"
                min={0}
                step="0.01"
                value={form.price_sale ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, price_sale: e.target.value ? Number(e.target.value) : null }))}
                error={formErrors.price_sale}
              />
            )}
            <Input
              label="Notas"
              name="notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
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
