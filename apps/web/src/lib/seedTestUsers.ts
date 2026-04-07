/**
 * Debe coincidir con `apps/api/tests/seed.py` (ROLE_DEFS + DEFAULT_PASSWORD + patrón de email).
 * Si cambia el seed, actualizar este archivo.
 */
import type { Role } from "@/types/role";

export const SEED_TEST_EMAIL_DOMAIN = "gyhobras.com";

/** Misma contraseña que `DEFAULT_PASSWORD` en `tests/seed.py`. */
export const SEED_TEST_PASSWORD = "Test1234!";

/** Código de usuario en seed (`{code}@gyhobras.com`) por rol de la UI. */
export const UI_ROLE_TO_SEED_CODE: Record<Role, string> = {
  admin: "admin",
  cliente: "client",
  aportante_catalogo: "catalog_contributor",
  logistica: "logistics",
  facturacion: "billing",
  cartera: "ar",
  credito: "credit",
};

export function emailForUiRole(role: Role): string {
  return `${UI_ROLE_TO_SEED_CODE[role]}@${SEED_TEST_EMAIL_DOMAIN}`;
}
