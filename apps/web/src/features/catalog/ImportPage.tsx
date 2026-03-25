import { useState, useCallback, type DragEvent, type ChangeEvent } from "react";

import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { DataTable, type Column } from "@/components/ui/DataTable";

type ImportBatch = {
  id: string;
  filename: string;
  status: string;
  row_count: number;
  error_count: number;
  created_at: string;
};

const batchStatusTone: Record<string, "draft" | "pending" | "process" | "done"> = {
  pending_review: "pending",
  approved: "done",
  rejected: "draft",
  processing: "process",
};

const columns: Column<ImportBatch>[] = [
  { header: "Archivo", accessor: "filename" },
  {
    header: "Estado",
    accessor: "status",
    render: (row) => <Badge tone={batchStatusTone[row.status] ?? "draft"}>{row.status}</Badge>,
  },
  { header: "Filas", accessor: "row_count" },
  { header: "Errores", accessor: "error_count" },
  { header: "Fecha", accessor: "created_at" },
];

export function ImportPage() {
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBatches = useCallback(async () => {
    try {
      setBatches(await api.get<ImportBatch[]>("/products/imports"));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    }
  }, []);

  async function uploadFile(file: File) {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Solo se aceptan archivos .xlsx");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api.upload<ImportBatch>("/products/imports", fd);
      await loadBatches();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error al subir archivo");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  async function handleAction(batchId: string, action: "approve" | "reject") {
    try {
      await api.post(`/products/imports/${batchId}/${action}`);
      await loadBatches();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error al procesar");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">
          Importación masiva
        </h2>
        <p className="text-sm text-on-surface-variant">HU-008/009 — Carga de catálogo vía Excel.</p>
      </header>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center gap-4 bg-surface-container-lowest p-12 text-center transition-colors ${
          dragOver ? "bg-primary-fixed" : ""
        }`}
      >
        <MaterialIcon name="upload_file" className="text-5xl text-on-surface-variant" />
        <p className="text-sm text-on-surface-variant">
          {uploading ? "Subiendo archivo…" : "Arrastre un archivo .xlsx aquí o haga clic para seleccionar"}
        </p>
        <label className="cursor-pointer">
          <Button variant="secondary" className="pointer-events-none">
            <MaterialIcon name="folder_open" className="text-sm" />
            Seleccionar archivo
          </Button>
          <input type="file" accept=".xlsx,.xls" onChange={handleFileInput} className="hidden" />
        </label>
      </div>

      {error && (
        <div className="bg-error-container p-4">
          <p className="text-sm text-on-surface">{error}</p>
        </div>
      )}

      {batches.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">Lotes cargados</h3>
          <DataTable
            columns={columns}
            data={batches}
            onRowClick={(batch) => {
              if (batch.status === "pending_review") {
                handleAction(batch.id, "approve");
              }
            }}
          />
          <div className="flex gap-3">
            {batches
              .filter((b) => b.status === "pending_review")
              .map((b) => (
                <div key={b.id} className="flex gap-2">
                  <Button onClick={() => handleAction(b.id, "approve")}>
                    <MaterialIcon name="check" className="text-sm" />
                    Aprobar {b.filename}
                  </Button>
                  <Button variant="secondary" onClick={() => handleAction(b.id, "reject")}>
                    <MaterialIcon name="close" className="text-sm" />
                    Rechazar
                  </Button>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
