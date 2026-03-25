import { Badge } from "@/components/ui/Badge";

export function ClienteHomePage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">Resumen</h2>
        <p className="text-sm text-on-surface-variant">Portal cliente — `pdr/ux/SITEMAPS-CHECKLIST-BY-ROLE.md` §1.</p>
      </header>
      <div className="bg-surface-container-lowest p-8 shadow-ambient">
        <p className="font-body text-on-surface">
          Accesos rápidos a solicitudes y movimientos se conectarán a la API en HU-012 y HU-014.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="done">es-CO</Badge>
          <Badge tone="process">MVP</Badge>
        </div>
      </div>
    </div>
  );
}
