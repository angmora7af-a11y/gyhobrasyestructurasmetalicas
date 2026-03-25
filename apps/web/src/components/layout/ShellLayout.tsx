import { Outlet, useLocation } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { navForUser } from "@/navigation/navConfig";

type Area = "admin" | "cliente";

function detectArea(pathname: string): Area {
  if (pathname.startsWith("/cliente")) return "cliente";
  return "admin";
}

export function ShellLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const area = detectArea(location.pathname);
  const items = user ? navForUser(user.role, area) : [];

  return (
    <AppShell sidebarItems={items} topBarTitle={area === "cliente" ? "Portal cliente" : "Industrial Ledger"}>
      <Outlet />
    </AppShell>
  );
}
