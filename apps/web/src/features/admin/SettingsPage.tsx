import { useState, useEffect, useCallback, type FormEvent } from "react";

import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type TenantSettings = {
  tenant_id: string;
  city_code: string;
  company_name: string;
  brand_primary_color: string;
  brand_logo_url: string;
};

const fallback: TenantSettings = {
  tenant_id: "—",
  city_code: "—",
  company_name: "G&H Obras y Estructuras Metálicas",
  brand_primary_color: "#b5000b",
  brand_logo_url: "",
};

export function SettingsPage() {
  const [settings, setSettings] = useState<TenantSettings>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSettings(await api.get<TenantSettings>("/settings"));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.patch("/settings", settings);
      setSaved(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse bg-surface-container-low" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Configuración</h2>
        <p className="text-sm text-on-surface-variant">HU-024 — Parámetros del tenant.</p>
      </header>

      {error && (
        <div className="bg-error-container p-4">
          <p className="text-sm text-on-surface">{error}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="max-w-xl space-y-6 bg-surface-container-lowest p-6 shadow-ambient">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Tenant ID</p>
            <p className="mt-1 font-headline text-lg font-bold text-on-surface">{settings.tenant_id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Código ciudad</p>
            <p className="mt-1 font-headline text-lg font-bold text-on-surface">{settings.city_code}</p>
          </div>
        </div>

        <Input
          label="Nombre empresa"
          name="company_name"
          value={settings.company_name}
          onChange={(e) => setSettings((s) => ({ ...s, company_name: e.target.value }))}
        />
        <Input
          label="Color primario"
          name="brand_primary_color"
          value={settings.brand_primary_color}
          onChange={(e) => setSettings((s) => ({ ...s, brand_primary_color: e.target.value }))}
        />
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded" style={{ backgroundColor: settings.brand_primary_color }} />
          <span className="text-sm text-on-surface-variant">{settings.brand_primary_color}</span>
        </div>
        <Input
          label="URL logo"
          name="brand_logo_url"
          value={settings.brand_logo_url}
          onChange={(e) => setSettings((s) => ({ ...s, brand_logo_url: e.target.value }))}
        />

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            <MaterialIcon name="save" className="text-sm" />
            {saving ? "Guardando…" : "Guardar"}
          </Button>
          {saved && <span className="text-xs text-tertiary">Guardado correctamente</span>}
        </div>
      </form>

      <div className="max-w-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
        <MaterialIcon name="info" className="mr-1 text-sm" />
        Transporte, daños y repuestos están fuera del alcance MVP.
      </div>
    </div>
  );
}
