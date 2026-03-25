import type { Role } from "@/types/role";

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: readonly Role[];
  children?: readonly NavItem[];
};

export const adminShellNav: readonly NavItem[] = [
  {
    id: "operation",
    label: "Operation",
    icon: "engineering",
    path: "/admin",
    roles: ["admin", "logistica"],
  },
  {
    id: "catalog",
    label: "Catálogo",
    icon: "inventory",
    path: "/admin/catalog",
    roles: ["admin", "logistica", "aportante_catalogo"],
  },
  {
    id: "clients",
    label: "Clientes",
    icon: "business",
    path: "/admin/clients",
    roles: ["admin", "logistica", "facturacion", "credito"],
  },
  {
    id: "credit",
    label: "Crédito",
    icon: "credit_score",
    path: "/admin/credit",
    roles: ["admin", "credito"],
  },
  {
    id: "tickets",
    label: "Tickets",
    icon: "assignment",
    path: "/admin/tickets",
    roles: ["admin", "logistica"],
  },
  {
    id: "shipments",
    label: "Remisiones",
    icon: "local_shipping",
    path: "/admin/shipments",
    roles: ["admin", "logistica"],
  },
  {
    id: "reports",
    label: "Reportes",
    icon: "analytics",
    path: "/admin/reports/kardex",
    roles: ["admin", "logistica"],
  },
  {
    id: "billing",
    label: "Facturación",
    icon: "receipt_long",
    path: "/admin/billing",
    roles: ["admin", "facturacion"],
  },
  {
    id: "finance",
    label: "Cartera",
    icon: "account_balance",
    path: "/admin/finance/invoices",
    roles: ["admin", "cartera", "credito"],
  },
  {
    id: "users",
    label: "Usuarios",
    icon: "group",
    path: "/admin/users",
    roles: ["admin"],
  },
  {
    id: "audit",
    label: "Auditoría",
    icon: "history",
    path: "/admin/audit",
    roles: ["admin"],
  },
  {
    id: "administration",
    label: "Configuración",
    icon: "admin_panel_settings",
    path: "/admin/settings",
    roles: ["admin"],
  },
] as const;

export const clientShellNav: readonly NavItem[] = [
  {
    id: "home",
    label: "Inicio",
    icon: "home",
    path: "/cliente",
    roles: ["cliente"],
  },
  {
    id: "solicitudes",
    label: "Solicitudes",
    icon: "assignment",
    path: "/cliente/solicitudes",
    roles: ["cliente"],
  },
  {
    id: "movimientos",
    label: "Movimientos",
    icon: "inventory_2",
    path: "/cliente/movimientos",
    roles: ["cliente"],
  },
] as const;

export function navVisibleForRole(items: readonly NavItem[], role: Role): NavItem[] {
  return items.filter((item) => item.roles.includes(role));
}

export function navForUser(role: Role, area: "admin" | "cliente"): NavItem[] {
  const pool = area === "cliente" ? clientShellNav : adminShellNav;
  return navVisibleForRole(pool, role);
}
