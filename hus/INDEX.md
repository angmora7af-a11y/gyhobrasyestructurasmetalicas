# Índice de historias de usuario — MVP G&H (PDR)

**Fuente:** `pdr/PDR-02`, `pdr/PDR-06`, `call2.txt`  
**Corrida:** RUN-MVP-2026-03-24  
**Archivo maestro:** [HU_RUN-MVP-2026-03-24-all.md](./HU_RUN-MVP-2026-03-24-all.md)  
**Checklist implementación (React/API):** [SPECS-IMPLEMENTATION.md](./SPECS-IMPLEMENTATION.md) — estado por HU, rutas y referencias PDR.

## Mapa HU → FR

| HU | Título | FRs cubiertos |
|:---|:---|:---|
| HU-001 | Fundación monorepo, Docker dev, CI | PDR-06 Fase 0 |
| HU-002 | Login y sesión segura | FR-001 |
| HU-003 | RBAC por rol y recurso | FR-002, FR-004 |
| HU-004 | Auditoría de eventos críticos | FR-003 |
| HU-005 | Recuperación de contraseña | FR-001 |
| HU-006 | Shell web: sidebar + workspace | — (UX/NFR) |
| HU-007 | Catálogo productos Alforequipos (sin imagen, precio día/venta) | FR-010, FR-010a, FR-011 |
| HU-008 | Importación masiva Excel + endpoints API migración | FR-013, FR-015, FR-016 |
| HU-009 | Flujo aprobación lote import | FR-014 |
| HU-010 | Clientes, sucursales, obras, siglas remisión | FR-020, FR-021 |
| HU-011 | Módulo crédito v1 | FR-022, FR-023 |
| HU-012 | Tickets solicitud/cotización | FR-030–FR-032 |
| HU-013 | Estados ticket y SLA interno | FR-031, FR-033 |
| HU-014 | Remisión envío con código cliente + timestamp | FR-040–FR-042, FR-041 |
| HU-015 | Venta directa | FR-043 |
| HU-016 | Export PDF remisión | FR-044 |
| HU-017 | Kardex y reportes (export INDEX-compatible) | FR-060–FR-062 |
| HU-018 | Proforma/insumos para Siigo (sin CPE) | FR-070–FR-073, FR-072 |
| HU-019 | Integración datos facturas para cartera | FR-080, FR-073 |
| HU-020 | Cartera: pendientes, mora, recordatorios | FR-082 |
| HU-021 | Canales recolección información de pago | FR-081 |
| HU-022 | Dashboard administrativo KPIs | FR-090, FR-091 |
| HU-023 | Export datos BI / reporting | FR-092 |
| HU-024 | Configuración multi-instancia (ciudad/tenant) | FR-110 |
| HU-025 | Notificaciones email en tickets | FR-101 |
| HU-026 | Exclusión explícita transporte/daños/repuestos en UI | FR-045, FR-063 |

**Fuera de MVP:** FR-050–052 (devoluciones), FR-100 (WhatsApp opcional).

---

## Validación

Ver `spec-kit/VALIDATION-PROTOCOL.md` y `spec-kit/TRACEABILITY.md`.
