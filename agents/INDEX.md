# Índice maestro — Agentes, spec-kit y recursos (G&H)

Este directorio concentra lo necesario para **desarrollo asistido por agentes** (IA Hybrid Teams) y **especificación / validación** (spec-kit), alineado al proyecto **G&H Obras**.

**Raíz del proyecto:** `gyhobras/` (monorepo PDR + `pdr/`, `hus/`, `apps/` futuros).

---

## 1. Origen de los repositorios

| Origen | Ruta en tu máquina | Qué se incorporó |
|--------|-------------------|-------------------|
| **IA Hybrid Teams** | `imagineapps/ia-hybrid-teams/` | Agentes de implementación y QA, `spec-kit/` metodológico, `templates/`, `diagrams/`, `hooks/`, `config/`, documentación en `resources/` |
| **Spec-kit G&H** (repo) | `gyhobras/spec-kit/` | `TRACEABILITY.md`, `VALIDATION-PROTOCOL.md`, `validate.sh` — **también copiados** a `agents/spec-kit/` |

**Versión upstream:** `ia-hybrid-teams` — Imagine Apps; metodología de agentes Claude + contratos por fase.

---

## 2. Mapa rápido (qué abrir primero)

| Prioridad | Ruta | Para qué |
|----------|------|----------|
| 1 | `agents/PARAMETERS.md` | Reglas MVP, `call2.txt`, contexto de producto |
| 2 | `agents/project_brain_gyhobras.md` | Cerebro del proyecto (alcance, Siigo, módulos) |
| 3 | `agents/spec-kit/README.md` | Metodología IA Hybrid + validación G&H unificada |
| 4 | `agents/spec-kit/TRACEABILITY.md` | FR → HU → pruebas |
| 5 | `pdr/00-INDEX.md` | Índice de todos los PDR |

---

## 3. Agentes por rol (archivos `.md` en `agents/`)

### 3.1 Producto, historias y planificación (G&H)

| Archivo | Rol |
|---------|-----|
| `Gabriela-ProjectBrain.md` | Plantilla Project Brain (contenido vivo: `project_brain_gyhobras.md`) |
| `Gimena-userstorywriter.md` | Historias de usuario técnicas desde requerimientos |
| `Gabi-workplanner.md` | Plan de trabajo TDD / implementación (sin código) |
| `gimena-scheduler.md` | Schedule, hitos, dependencias entre módulos |
| `hu-work-planner.md` | Planificación de HUs por módulos (metodología IA Hybrid) |

### 3.2 Implementación (IA Hybrid Teams)

| Archivo | Rol |
|---------|-----|
| `architect.md` | Diseño de sistemas, capas, patrones |
| `fullstack-developer.md` | Backend + frontend web, monorepo |
| `flutter-developer.md` | Móvil Flutter (si aplica) |
| `fixed-errors.md` | Depuración, parches de seguridad |
| `data-engineer.md` | Modelo de datos, migraciones, SQL |
| `auditor.md` | Revisión de código y estándares |

### 3.3 Calidad, integración y reportes (IA Hybrid Teams)

| Archivo | Rol |
|---------|-----|
| `qa-integrator.md` | APIs, OpenAPI, E2E |
| `integration.md` | UI ↔ API, plan de pruebas |
| `sonar-quality-gate.md` | Calidad tipo Sonar |
| `unit-test-standards-reviewer.md` | Estándares de unit tests |
| `mcp-integration-tester.md` | E2E vía MCP |
| `test-video-recorder.md` | Evidencia visual |
| `quality-report-generator.md` | Reporte Go/No-Go |

---

## 4. Spec-kit (`agents/spec-kit/`)

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Metodología + sección G&H (validación) |
| `AGENT_REGISTRY.md` | Registro de agentes ↔ fases |
| `AGENT_SPEC_SCHEMA.md` | Esquema unificado de especificación |
| `PHASE_CONTRACTS.md` | Contratos por fase (inputs/outputs) |
| `HOOKS_CONTRACT.md` | Contrato de hooks |
| `CONTRIBUTION_AND_APPROVALS.md` | Contribución y aprobaciones |
| `RUNTIME_REQUIRED_FILES.md` | Archivos requeridos en runtime |
| `TEMPLATES_GUIDE.md` | Guía de plantillas |
| `TRACEABILITY.md` | FR ↔ HU ↔ pruebas (G&H) |
| `VALIDATION-PROTOCOL.md` | Protocolo UAT/CI (G&H) |
| `validate.sh` | Script de validación de artefactos |
| `examples/` | Ejemplos `claude.md` / `architecture.md` |

**Ejecución:** desde la raíz del repo: `./agents/spec-kit/validate.sh`

---

## 5. Plantillas y diagramas

| Directorio | Uso |
|------------|-----|
| `agents/templates/` | Clean Architecture, SOLID, patrones (`folder-structure.md`, `solid-patterns.md`, `architecture-patterns.md`) |
| `agents/diagrams/` | Fases SDLC agentizado (`system0_agentized_sdlc.mmd`, `phase2_backend.mmd`, etc.) |

---

## 6. Hooks y configuración

| Directorio | Uso |
|------------|-----|
| `agents/hooks/` | Pre-proyecto (`validate-pre-project.sh`), post-query KPI, `kpi.txt.example` |
| `agents/config/` | Plantillas de reglas Cursor (`cursor-rules-template.mdc`, `claude-rules-principles.mdc`) |

---

## 7. Documentación metodológica (copia upstream)

En `agents/resources/`:

| Archivo | Contenido |
|---------|-----------|
| `IA-HYBRID-README.md` | README del repo IA Hybrid Teams |
| `IA-HYBRID-METODOLOGY.md` | Metodología |
| `IA-HYBRID-LINEAMIENTOS.md` | Lineamientos arquitectura y estándares |
| `IA-HYBRID-claude.md` | Ejemplo de contexto `claude.md` |
| `IA-HYBRID-architecture.md` | Ejemplo de `architecture.md` |
| `IA-HYBRID-agents-README.md` | README del directorio `agents/` upstream |
| `IA-HYBRID-tests-README.md` | Pruebas de escenarios (pytest, reporte HTML) |
| `IA-HYBRID-SCENARIO-DESIGN.md` | Diseño de escenarios E2E |

---

## 8. Salidas y espejos (G&H)

| Ruta | Contenido |
|------|-----------|
| `agents/outputs/` | Backlog, schedule, plan de proyecto, copias de spec-kit / HUs |
| `hus/` | Historias de usuario maestras |

---

## 9. Cursor Skills (editor)

Las **Skills** globales de Cursor (reglas, convenciones del proyecto) no viven en este repo; están en `.cursor/skills-cursor/` del usuario. Para crear reglas o skills **del proyecto**, puedes usar la skill `create-rule` o `create-skill` desde Cursor y apuntar a `agents/` y `pdr/` como fuentes de verdad.

---

## 10. Mantenimiento

- Si actualizas **`ia-hybrid-teams`**, vuelve a copiar `spec-kit/`, `templates/`, `diagrams/`, `hooks/`, agentes nuevos y `resources/IA-HYBRID-*` según necesidad.
- El **spec-kit en la raíz** (`spec-kit/`) puede mantenerse sincronizado con `agents/spec-kit/` para `TRACEABILITY.md` y `VALIDATION-PROTOCOL.md`.

---

*Índice generado — integración IA Hybrid Teams + spec-kit G&H.*
