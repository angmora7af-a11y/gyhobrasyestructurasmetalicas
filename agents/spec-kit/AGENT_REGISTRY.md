# Agent Registry (Mapa de Agentes)

Este registro consolida las especificaciones existentes en `agents/` y las conecta con el ciclo definido por `diagrams/`.

> La idea del `spec-kit` es evitar “interpretaciones libres” y forzar consistencia: si un diagrama menciona un participante, debe existir su spec o quedar marcado como faltante.

---

## 1) Agentes “especialistas de implementación” (Login-focused)

| Agent (canon) | agent_id | version | Spec fuente |
|---|---:|---:|---|
| Architect | architect.v1 | 1.0.0 | `agents/architect.md` |
| Fullstack Developer | fullstack.v1 | 1.0.0 | `agents/fullstack-developer.md` |
| Flutter Developer | flutter.v1 | 1.0.0 | `agents/flutter-developer.md` |
| Fixed Errors | fixed-errors.v1 | 1.0.0 | `agents/fixed-errors.md` |
| Data Engineer | data-engineer.v1 | 1.0.0 | `agents/data-engineer.md` |
| Auditor | auditor.v1 | 1.0.0 | `agents/auditor.md` |

---

## 2) Agentes de Product/Backlog/Planificación (metodología existente)

| Agent (canon) | Spec fuente | Notas de compatibilidad con schema |
|---|---|---|
| Project Brain (Template) | `agents/Gabriela-ProjectBrain.md` | Incluye governance, scope matrix y logs. Falta estandarizar hacia el schema (en spec-kit se hace mapping). |
| User Story Writer (Gimena) | `agents/Gimena-userstorywriter.md` | Incluye Contexto MCP + persistencia backlog.md + formato HU. |
| Workplanner (Gabi) | `agents/Gabi-workplanner.md` | Incluye TDD + SOLID + definición de terminado (solo plan; no código). |

---

## 3) Participantes de los diagramas que aún no tienen spec en `agents/`

Estos participantes aparecen en `diagrams/` (como “nombre de rol” en el diagrama) pero **no existe** todavía una especificación canónica equivalente en `agents/`:

| Participante en diagrama | Diagrama | Status |
|---|---|---|
| *(ninguno por ahora)* | | |

---

## 4) Cómo usar el registry

- En `spec-kit/PHASE_CONTRACTS.md`, cada fase referencia agentes del registry.
- Si una fase menciona un agente con `missing_spec`, el contrato de fase fuerza un “next_step” de creación.

---

## 5) Agentes de Calidad e Integración (creados)

| Agent (canon) | agent_id | version | Spec fuente |
|---|---:|---:|---|
| HU Work Planner | hu-work-planner.v1 | 1.0.0 | `agents/hu-work-planner.md` |
| Gimena Scheduler | gimena-scheduler.v1 | 1.0.0 | `agents/gimena-scheduler.md` |
| QA Integrator (API Testing) | qa-integrator.v1 | 1.0.0 | `agents/qa-integrator.md` |
| Integration (UI ↔ API) | integration.v1 | 1.0.0 | `agents/integration.md` |
| Sonar Quality Gate | sonar-quality-gate.v1 | 1.0.0 | `agents/sonar-quality-gate.md` |
| MCP Integration Tester | mcp-integration-tester.v1 | 1.0.0 | `agents/mcp-integration-tester.md` |
| Test Video Recorder | test-video-recorder.v1 | 1.0.0 | `agents/test-video-recorder.md` |
| Unit Test Standards Reviewer | unit-test-standards-reviewer.v1 | 1.0.0 | `agents/unit-test-standards-reviewer.md` |
| Quality Report Generator | quality-report-generator.v1 | 1.0.0 | `agents/quality-report-generator.md` |

