# Protocolo de validación — MVP G&H

## 1. Definición de “HU lista” (DoD)

Para cada HU en `hus/`:

1. **Criterios de aceptación** del documento HU cumplidos (demo o evidencia).
2. **Pruebas:** según `TRACEABILITY.md` — mínimo pytest para lógica backend; front con checklist hasta E2E disponible.
3. **Sin regresión:** suite CI verde.
4. **Trazabilidad:** FR asociado en `hus/INDEX.md` verificado.
5. **Reglas MVP:** `call2.txt` — no CPE en app, sin devoluciones, precio día.

## 2. Gates por fase (`pdr/PDR-06`)

| Fase | Gate |
|:---|:---|
| 0–1 Fundación + Auth | Login, RBAC, auditoría smoke |
| 2 Catálogo | CRUD + import + aprobación |
| 3–5 Clientes, crédito, tickets | Flujo ticket completo |
| 6 Remisión + venta | Código único + PDF |
| 7 Kardex | Export con columnas mínimas |
| 8–9 Proforma + Siigo | Export sin CPE |
| 10 Cartera | Import + recordatorio mock |
| 11 Dashboard | KPIs no vacíos con datos seed |

## 3. UAT con negocio

- Checklist por rol según `pdr/ux/SITEMAPS-CHECKLIST-BY-ROLE.md`.
- Datos de prueba: clientes y productos coherentes con `INDEX.md` (formatos).

## 4. Bloqueantes

- **CPE emitida desde la app:** rechazo en code review.
- **Módulo devoluciones** en MVP: rechazo salvo cambio de alcance documentado.

---

*Versión 1.0 — alineada a PDR v2.0 y `call2.txt`.*
