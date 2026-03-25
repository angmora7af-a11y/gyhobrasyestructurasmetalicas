# Project Plan — Work planner (agente Gabi-workplanner)

**Proyecto:** gyhobras — Plataforma G&H  
**Arquitectura:** `pdr/PDR-05-sdd-monorepo-fastapi-web.md`  
**Brain:** `agents/project_brain_gyhobras.md`

---

## Resumen ejecutivo

Se planifica el MVP en **orden PDR-06**: fundación → auth → catálogo e import Excel → clientes/crédito → solicitudes → remisiones y venta directa → kardex → insumos Siigo (sin CPE) → integración cartera → dashboards → multi-instancia y notificaciones. **TDD** aplicado por módulo con tests mapeados en `spec-kit/TRACEABILITY.md`.

---

## Servicios afectados (futuro repo)

- `apps/api`: FastAPI — routers por dominio (auth, catalog, clients, tickets, shipments, reports, billing_export, ar, admin).
- `apps/web`: SPA — layouts por rol según `pdr/ux/SITEMAPS-CHECKLIST-BY-ROLE.md`.

---

## Estrategia de pruebas (TDD)

1. **Contrato API:** OpenAPI generado; pruebas de contrato en import Excel y auth.
2. **Unitarias:** servicios de dominio (código remisión, saldos sin devolución).
3. **Integración:** DB + migraciones Alembic.
4. **E2E:** prioridad flujos HU-002, HU-014, HU-017 (post-MVP parcial aceptable).

---

## Hoja de ruta de implementación (alto nivel)

### Fase 1: Base de datos y modelos
- Usuarios, roles, auditoría.
- Productos, precios, bodegas opcional.
- Clientes, sucursales, obras, siglas.
- Tickets, remisiones, líneas, ventas directas.
- Tablas cartera y snapshot facturas importadas.

### Fase 2: Backend FastAPI
- `deps` seguridad JWT/RBAC.
- Servicios por módulo; sin lógica en routers pesada.

### Fase 3: API pública estable
- Versionado `/api/v1/`; migración bajo `/api/v1/migration/...`.

### Fase 4: Frontend
- Shell → módulos en orden de `schedule.md`.

### Fase 5: Integración y despliegue
- Docker; variables tenant; jobs Redis.

---

## Riesgos

| Riesgo | Mitigación |
|:---|:---|
| Integración Siigo no API | Plan B CSV; spike temprano |
| Saldos sin devoluciones | Documentar fórmula en código + `pdr/PDR-04` |

---

## Rama sugerida (primer entregable)

`feature/M1-fundacion-auth`

---

## Archivos de referencia (no modificar en planificación)

- `hus/HU_RUN-MVP-2026-03-24-all.md`
- `spec-kit/TRACEABILITY.md`

---

*Documento generado para handoff a desarrollo; no incluye código.*
