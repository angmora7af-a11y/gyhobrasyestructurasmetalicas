import type { Role } from "@/types/role";

/** Prioridad: rol de staff antes que cliente (mismo usuario no debería mezclar en MVP). */
export function mapApiRolesToUiRole(apiRoles: string[]): Role {
  const r = new Set(apiRoles);
  if (r.has("admin")) return "admin";
  if (r.has("catalog_contributor")) return "aportante_catalogo";
  if (r.has("logistics")) return "logistica";
  if (r.has("billing")) return "facturacion";
  if (r.has("ar")) return "cartera";
  if (r.has("credit")) return "credito";
  if (r.has("client")) return "cliente";
  return "admin";
}
