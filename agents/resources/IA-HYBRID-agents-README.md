# Specialized Agents

Each agent acts as a **Senior Software Architect and Generative AI Expert**, with a narrow, well-defined role. Definitions include **Suggested Input**, **Login Focus** (reference use case), and restrictions to align with the agentization strategy.

---

## Fields

| Field | Purpose |
|-------|---------|
| **Suggested Input** | Recommended prompt to invoke the agent. |
| **Login Focus** | Concrete objective for the authentication flow (reference per agent). |
| **MCP Context** | Files and context groups the agent must consume. |
| **Behavior** | What the agent must and must not do; scope and output format. |
| **Best Practices** | Role-specific practices for consistent, high-quality output. |
| **Redirect Patterns** | When to reference `templates/solid-patterns.md` or `templates/architecture-patterns.md`. |

---

## Pattern Redirects

All agents reference shared templates for consistency:

- **`templates/solid-patterns.md`** — SOLID principles with short examples. Use when implementing, refactoring, or verifying code structure.
- **`templates/architecture-patterns.md`** — Architecture patterns (Clean Architecture, Repository, Use-Case, Adapter, C4, Bounded Contexts). Use when designing or verifying layer boundaries.
- **`templates/folder-structure.md`** — Folder structure and layer responsibilities.

---

## Agent Set

| Agent | Role | Scope |
|-------|------|-------|
| **Architect** | System design, pattern validation | Architecture, layers, bounded contexts, C4 |
| **Fullstack Developer** | Business logic and UI implementation | Backend + frontend, monorepo, type safety |
| **Flutter Developer** | Mobile development | Flutter, BLoC/Riverpod, widgets |
| **Fixed Errors** | Debugging and security patches | Error handling, OWASP, SOLID refactors |
| **Data Engineer** | Pipelines and query optimization | Schema, migrations, hashing, auditing |
| **Auditor** | Code review and standards | Static analysis, architecture compliance, security |

## Agents QA / Integration / Planning (añadidos)

| Agent | Role | Scope |
|-------|------|-------|
| **HU Work Planner** | Generación/organización de HUs por módulos | Planificación de entregables para implementación |
| **Gimena Scheduler** | Consolidación y schedule con timing/hitos | Modulación + estimación por fases |
| **QA Integrator (API Testing)** | Validación automatizada de APIs (OpenAPI + E2E) | Contratos + seguridad + performance + reportes |
| **Integration** | Evidencia de integración UI ↔ API y preparación de QA | Unit tests UI/services + plan E2E |
| **Sonar Quality Gate** | Análisis tipo Sonar + pass/fail | Calidad, seguridad, duplications, coverage |
| **Unit Test Standards Reviewer** | Verificar estándares de unit tests | Naming, aislamiento, coverage, aserciones |
| **MCP Integration Tester** | Ejecutar/definir tests end-to-end vía MCP | Escenarios cross-módulo + evidencias |
| **Test Video Recorder** | Capturar evidencia visual de ejecuciones | Videos + screenshots indexados |
| **Quality Report Generator** | Consolidar todo en reporte final Go/No-Go | Decisión final para Leaders |

---

**Agent set version:** 1.2.0
