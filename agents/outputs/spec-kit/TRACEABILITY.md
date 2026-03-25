# Trazabilidad FR → HU → validación

**PDR:** `pdr/PDR-02-functional-requirements.md`  
**HUs:** `hus/HU_RUN-MVP-2026-03-24-all.md`, `hus/INDEX.md`

| FR | Descripción breve | HU | Validación sugerida |
|:---|:---|:---|:---|
| FR-001 | Login, sesión, recovery | HU-002, HU-005 | pytest API auth; E2E login |
| FR-002 | RBAC | HU-003 | pytest permisos por rol; E2E rutas bloqueadas |
| FR-003 | Auditoría | HU-004 | pytest insert audit log; revisión tabla |
| FR-004 | Perfiles | HU-003 | matriz roles en test parametrizado |
| FR-010–011 | Catálogo + precio día | HU-007 | pytest CRUD producto; reglas precio |
| FR-010a | Sin imagen | HU-007 | assert no campo imagen en schema |
| FR-013–016 | Import Excel + OpenAPI | HU-008, HU-009 | pytest upload multipart; snapshot OpenAPI |
| FR-014 | Estados import | HU-009 | transiciones de estado lote |
| FR-020–021 | Cliente, obra, siglas | HU-010 | pytest client/site; unique siglas |
| FR-022–023 | Crédito | HU-011 | pytest expediente estado |
| FR-030–033 | Tickets | HU-012, HU-013 | pytest ticket FSM; fechas SLA |
| FR-040–042 | Remisión | HU-014 | pytest código formato + unicidad |
| FR-041 | Código cliente+timestamp | HU-014 | regex test; timezone |
| FR-043 | Venta directa | HU-015 | pytest venta líneas |
| FR-044 | PDF remisión | HU-016 | test genera PDF no vacío |
| FR-060–062 | Kardex reportes | HU-017 | pytest export CSV columnas mínimas |
| FR-070–073 | Proforma / export Siigo | HU-018 | assert no endpoint CPE; export file |
| FR-072 | CPE solo Siigo | HU-018 | revisión estática código + contrato |
| FR-080–082 | Cartera | HU-019, HU-020 | pytest import factura; job recordatorio mock |
| FR-081 | Canales pago | HU-021 | pytest registro pago |
| FR-090–092 | Dashboards / BI | HU-022, HU-023 | API agregados; smoke |
| FR-110 | Multi-instancia | HU-024 | pytest settings tenant |
| FR-101 | Email tickets | HU-025 | mock SMTP |
| FR-045 | Exclusión transporte | HU-026 | lint rutas prohibidas |

**FRs omitidos MVP:** FR-050–052 (devoluciones), FR-063 (excluido), FR-100 (WhatsApp opcional).

---

## Leyenda validación

- **pytest API:** pruebas automatizadas FastAPI.
- **E2E:** Playwright/Cypress (cuando exista front).
- **manual:** revisión UAT / checklist `VALIDATION-PROTOCOL.md`.
