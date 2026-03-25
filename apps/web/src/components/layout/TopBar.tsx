import { MaterialIcon } from "@/components/ui/MaterialIcon";

type Props = {
  title?: string;
};

export function TopBar({ title = "Industrial Ledger" }: Props) {
  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between bg-stone-50/90 px-8 py-4 backdrop-blur-md dark:bg-stone-950/90">
      <div className="flex items-center gap-6">
        <div className="group relative">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-primary"
          />
          <input
            type="search"
            placeholder="Buscar en el libro industrial…"
            className="w-64 border-0 border-b-2 border-transparent bg-stone-100 py-2 pl-10 pr-4 text-sm transition-all focus:border-primary focus:bg-white focus:ring-0"
            aria-label="Búsqueda global"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button type="button" className="relative text-stone-600 transition-colors hover:text-primary" aria-label="Notificaciones">
            <MaterialIcon name="notifications" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
          </button>
          <button type="button" className="text-stone-600 transition-colors hover:text-primary" aria-label="Ayuda">
            <MaterialIcon name="help_outline" />
          </button>
        </div>
        <div className="h-6 w-px bg-stone-300" />
        <span className="font-headline text-sm font-semibold">{title}</span>
      </div>
    </header>
  );
}
