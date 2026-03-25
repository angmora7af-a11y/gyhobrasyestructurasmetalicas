import { useState, useEffect, useCallback } from "react";

import { api, ApiError } from "@/lib/api";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type AuditEntry = {
  id: string;
  timestamp: string;
  user_email: string;
  entity: string;
  action: string;
  detail: string;
};

const columns: Column<AuditEntry>[] = [
  { header: "Fecha/Hora", accessor: "timestamp" },
  { header: "Usuario", accessor: "user_email" },
  { header: "Entidad", accessor: "entity" },
  { header: "Acción", accessor: "action" },
  { header: "Detalle", accessor: "detail" },
];

export function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUser, setFilterUser] = useState("");
  const [filterEntity, setFilterEntity] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterUser) params.set("user", filterUser);
      if (filterEntity) params.set("entity", filterEntity);
      const qs = params.toString();
      setEntries(await api.get<AuditEntry[]>(`/audit${qs ? `?${qs}` : ""}`));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [filterUser, filterEntity]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse bg-surface-container-low" />
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
      <header>
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Auditoría</h2>
        <p className="text-sm text-on-surface-variant">HU-004 — Log de acciones del sistema (solo lectura).</p>
      </header>

      <div className="flex flex-wrap gap-3 bg-surface-container-lowest p-4 shadow-ambient">
        <Input
          label="Usuario"
          name="filterUser"
          placeholder="email@ejemplo.com"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="w-56"
        />
        <Input
          label="Entidad"
          name="filterEntity"
          placeholder="ticket, product…"
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="w-56"
        />
        <div className="flex items-end">
          <Button variant="secondary" onClick={load}>
            <MaterialIcon name="filter_list" className="text-sm" />
            Filtrar
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={entries} emptyMessage="No hay registros de auditoría." />
    </div>
  );
}
