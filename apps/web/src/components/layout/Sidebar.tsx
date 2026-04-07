import { NavLink } from "react-router-dom";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useAuth } from "@/hooks/useAuth";
import type { NavItem } from "@/navigation/navConfig";
import { cn } from "@/lib/cn";

type Props = {
  items: NavItem[];
};

export function Sidebar({ items }: Props) {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-stone-900">
      <div className="px-6 py-8">
        <h1 className="font-headline text-xl font-black uppercase tracking-tighter text-white">G&amp;H Obras</h1>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Industrial Ledger</p>
      </div>
      <nav className="mt-4 flex-1">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                end={item.path === "/cliente" || item.path === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-3 pl-4 font-headline text-xs font-bold uppercase tracking-tight transition-all",
                    isActive
                      ? "border-l-4 border-primary bg-stone-800/50 pl-3 text-red-500"
                      : "pl-5 text-stone-400 hover:bg-stone-800/80 hover:text-stone-100",
                  )
                }
              >
                <MaterialIcon name={item.icon} className="mr-3 text-sm" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pb-8">
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex w-full items-center py-3 pl-5 font-headline text-xs font-bold uppercase tracking-tight text-stone-400 transition-colors hover:bg-stone-800/80 hover:text-stone-100"
            >
              <MaterialIcon name="logout" className="mr-3 text-sm" />
              Salir
            </button>
          </li>
        </ul>
        {user ? (
          <div className="mt-6 flex items-center gap-3 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-stone-700 text-[10px] font-bold text-white">
              {user.email.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-bold text-white">{user.role}</p>
              <p className="text-[10px] text-stone-500">{user.email}</p>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
