# Agentes y spec-kit — proyecto G&H

Directorio unificado para **desarrollo con agentes** (roles IA Hybrid Teams + agentes de producto G&H) y **especificación / validación** (spec-kit: trazabilidad FR↔HU, contratos por fase).

**Índice detallado:** [`INDEX.md`](./INDEX.md) (mapa de archivos, tablas por rol, rutas a templates y hooks).

---

## Lectura rápida (contexto de negocio)

1. [`PARAMETERS.md`](./PARAMETERS.md) — Variables globales y reglas MVP (`call2.txt`).
2. [`project_brain_gyhobras.md`](./project_brain_gyhobras.md) — Alcance, Siigo, módulos.
3. [`../pdr/00-INDEX.md`](../pdr/00-INDEX.md) — Índice PDR.

---

## Spec-kit

- **Metodología + validación G&H:** [`spec-kit/README.md`](./spec-kit/README.md)
- **Trazabilidad y protocolo:** `spec-kit/TRACEABILITY.md`, `spec-kit/VALIDATION-PROTOCOL.md`
- **Validación automática** (desde la raíz del repo): `./agents/spec-kit/validate.sh`

El directorio `spec-kit/` en la raíz del proyecto mantiene los mismos artefactos G&H; la documentación ampliada (IA Hybrid) está en **`agents/spec-kit/`**.

---

## Agentes G&H (producto y planificación)

| Archivo | Rol |
|:--------|:----|
| `Gimena-userstorywriter.md` | Historias de usuario técnicas |
| `Gabi-workplanner.md` | Plan TDD / implementación |
| `gimena-scheduler.md` | Schedule e hitos |
| `Gabriela-ProjectBrain.md` | Plantilla Project Brain |
| `project_brain_gyhobras.md` | Contenido vivo del “cerebro” del proyecto |

## Agentes de desarrollo y QA (IA Hybrid Teams)

Implementación: `architect.md`, `fullstack-developer.md`, `flutter-developer.md`, `data-engineer.md`, `fixed-errors.md`, `auditor.md`.  
Planificación adicional: `hu-work-planner.md`.  
Calidad e integración: `qa-integrator.md`, `integration.md`, `sonar-quality-gate.md`, `unit-test-standards-reviewer.md`, `mcp-integration-tester.md`, `test-video-recorder.md`, `quality-report-generator.md`.

Patrones compartidos: `templates/solid-patterns.md`, `templates/architecture-patterns.md`, `templates/folder-structure.md`.

---

## Otros recursos bajo `agents/`

| Carpeta | Contenido |
|---------|-----------|
| `templates/` | SOLID, estructura de carpetas, patrones de arquitectura |
| `diagrams/` | Diagramas Mermaid por fase (SDLC agentizado) |
| `hooks/` | Validación pre-proyecto, KPI post-consulta |
| `config/` | Plantillas de reglas Cursor |
| `resources/` | Copias de README, metodología y lineamientos upstream (`IA-HYBRID-*.md`) |
| `outputs/` | Entregables generados (backlog, schedule, plan, espejos de spec-kit) |

---

## Uso en el chat (Cursor)

Adjuntar al menos:

`@agents/PARAMETERS.md` **y** `@agents/project_brain_gyhobras.md`

Para HUs: `@pdr/PDR-02-functional-requirements.md`  
Para datos/reportes: `@docs/INDEX.md` (o `INDEX.md` en la raíz de `docs/` según el repo)

Para implementación full-stack: además `@agents/spec-kit/PHASE_CONTRACTS.md` y `@pdr/PDR-05-sdd-monorepo-fastapi-web.md`.

---

*Mantener sincronizado con `pdr/` cuando cambie el alcance.*