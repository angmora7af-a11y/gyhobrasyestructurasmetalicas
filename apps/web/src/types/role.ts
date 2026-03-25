/**
 * Roles MVP — `hus/HU_RUN-MVP-2026-03-24-all.md` HU-003, `pdr/ux/SITEMAPS-CHECKLIST-BY-ROLE.md`
 */
export const ROLES = [
  "cliente",
  "aportante_catalogo",
  "admin",
  "logistica",
  "facturacion",
  "cartera",
  "credito",
] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
