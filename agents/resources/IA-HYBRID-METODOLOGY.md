# Metodología de Desarrollo — System0 Hub

> **Documento generado:** 2026-03-19  
> **Propósito:** Revisión global del proceso de desarrollo, agentes, scripts, validación de calidad y lecciones aprendidas

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Formato de Trabajo](#2-formato-de-trabajo)
3. [Agentes ADW](#3-agentes-adw)
4. [Scripts y Orquestación](#4-scripts-y-orquestación)
5. [Validación de Calidad](#5-validación-de-calidad)
6. [Aciertos y Desaciertos](#6-aciertos-y-desaciertos)
7. [Estructura de Documentación](#7-estructura-de-documentación)
8. [Documentos Detallados](#8-documentos-detallados)

---

## 1. Resumen Ejecutivo

**System0 Hub** es una plataforma de automatización empresarial desarrollada mediante un enfoque **issue-driven** integrado con **ADW (AI Developer Workflow)**, un sistema que conecta **Bitbucket Issues y sus comentarios** con Claude Code CLI para planificar, implementar, probar y documentar cambios de forma semi-automatizada.

**Stack principal:** React 19 + TypeScript (frontend) | FastAPI + Python 3.11 (backend) | Supabase (PostgreSQL, Auth, Storage)

**Principios arquitectónicos:** Clean Architecture, SOLID, capas estrictas (adapter → core → repositorio)

---

## 2. Formato de Trabajo

### 2.1 Flujo Issue-Driven

```
Bitbucket Issue → Clasificación (/chore | /bug | /feature) → Planificación → Implementación → Tests → Review → Documentación
```

- Cada trabajo parte de un **Bitbucket Issue**.
- Se clasifica con un slash command (`/chore`, `/bug`, `/feature`).
- Se genera un **plan de implementación** detallado por el agente `sdlc_planner`.
- El agente `sdlc_implementor` ejecuta el plan.
- Los resultados se validan con pytest (backend), tsc/build (frontend) y opcionalmente E2E.

### 2.2 Estructura de Especificaciones

**Ubicación (en el proyecto destino):** `specs/`

**Convención de nombres:** `issue-{number}-adw-{adw_id}-sdlc_planner-{slug}.md`

Ejemplo: `specs/issue-44-adw-d99dad11-sdlc_planner-fix-chatbot-not-answering.md`

**Contenido típico de un spec:**

| Sección | Propósito |
|--------|-----------|
| Metadata | issue_number, adw_id, issue_json |
| Bug/Feature Description | Qué hace el cambio |
| Problem Statement | Por qué es necesario |
| Solution Statement | Cómo se resuelve |
| Root Cause Analysis | Causa técnica (bugs) |
| Relevant Files | Archivos a modificar |
| Step by Step Tasks | Tareas numeradas concretas |
| Validation Commands | Comandos para validar |
| Notes | Config, rollback, consideraciones |

### 2.3 Trazabilidad de Implementaciones

**Ubicación (en el proyecto destino):** `implementations/`

**Convención:** `YYYYMMDD_feature_or_fix_description.md`

Ejemplo: `implementations/20251228_helios_fix_grounding_keyerror.md`

**Contenido:** Resumen de cambios, archivos modificados, tests agregados, resultados de validación, notas de despliegue.

### 2.4 Documentación de App

**Ubicación (en el proyecto destino):** `app_docs/`

**Convención:** `{tipo}-{hash}-{descripcion}.md` (ej. `feature-bbc82002-satisfaction-survey-feedback.md`, `bugfix-bf34750f-subcategory-selection-persistence.md`)

---

## 3. Agentes ADW

Los agentes son **prompts estructurados** que se ejecutan vía Claude Code CLI mediante el módulo `adw_modules/agent.py`.

### 3.1 Agentes Principales

| Agente | Slash Command | Función |
|--------|---------------|---------|
| `sdlc_planner` | `/chore` , `/bug` , `/feature` | Genera plan de implementación detallado a partir del issue |
| `sdlc_implementor` | `/implement` | Ejecuta el plan generado |
| `issue_classifier` | `/classify_issue` | Clasifica issue en chore/bug/feature |
| `branch_generator` | `/generate_branch_name` | Genera nombre de rama semántico |
| `plan_finder` | `/find_plan_file` | Localiza plan existente para continuar build |
| `pr_creator` | - | Crea pull request en Bitbucket (por REST API) |

### 3.2 Agentes de Testing

| Agente | Función |
|--------|---------|
| `test_runner` | Ejecuta suite de tests vía `/test` |
| `e2e_test_runner` | Opcional (si tu proyecto soporta E2E). No es parte del set mínimo de `agents_system`. |
| `resolve_failed_test` | Opcional (si deseas auto-remediación de fallas). |

### 3.3 Agentes de Soporte

| Agente | Función |
|--------|---------|
| `adw_classifier` | `/classify_adw` — Extrae workflow e ID desde texto |

### 3.4 Ubicación de Outputs

```
adw_outputs/
├── {adw_id}/              # Ej: a1b2c3d4
│   ├── sdlc_planner/     # (o el agent_name que corresponda)
│   │   └── raw_output.jsonl
│   └── sdlc_implementor/ # (o el agent_name que corresponda)
│       └── raw_output.jsonl
```

### 3.5 Modelos Utilizados

- **sonnet** — Tareas más rápidas (clasificación, planificación)
- **opus** — Tareas complejas (implementación, tests, branch names)

---

## 4. Scripts y Orquestación

### 4.1 Pipeline ADW

**Ubicación / referencia en este estándar:** `system-zero/METODOLOGY/agents_system/`

En este repo `ia-hybrid-teams/` el ADW es un estándar (diagrams/agents/hooks/templates). La ejecución real (runnable) se apoya en `agents_system/run_agent.py` para ejecutar agentes por slash command y en un **runner orquestador** (webhook receiver) para conectarlo con Bitbucket (branching + PR + pipelines).

| Componente | Fases |
|-----------|-------|
| `system-zero/METODOLOGY/agents_system/run_agent.py` | Ejecución de agentes por slash command (`/classify_issue`, `/chore|/bug|/feature`, `/generate_branch_name`, `/implement`, `/test`) |
| Runner orquestador (a implementar) | Bitbucket webhook -> orquestación plan → implement → tests -> `git push` -> PR |
| Bitbucket Pipelines | Validación en PR y despliegue tras merge a `develop`/`main` |

### 4.2 Scripts Compuestos

En Bitbucket, estos “scripts compuestos” viven dentro del **runner orquestador** (porque aquí no existen como archivos ejecutables).

Cadena sugerida (equivalente a `agents_system/`):

1. `/classify_issue` (identifica `/chore|/bug|/feature`)
2. `/chore|/bug|/feature` (planning)
3. `/generate_branch_name` (nombre de rama)
4. `/implement` (ejecuta plan)
5. `/test` (verifica suite disponible)
6. `git push` + `pr_creator` (crea PR en Bitbucket)

### 4.3 Triggers

| Script | Propósito |
|--------|-----------|
| `trigger_cron.py` | Monitoreo cada ~20s: Bitbucket issues sin comentarios o con comentario "adw" |
| `trigger_webhook.py` | Servidor HTTP en puerto 8001 (o similar), recibe eventos de Bitbucket (/bb-webhook) |

### 4.4 Bitbucket Automation (branching + PR + despliegue)

Para conectar el flujo ADW con **Bitbucket** (creación de ramas, creación de PR y ejecución vía **Bitbucket Pipelines**), ver la guía paso a paso en `docs/bitbucket-adw-automation.md`.

Resumen de alto nivel:
- Webhook de Bitbucket -> runner ADW -> genera rama + commits -> crea PR -> pipelines validan.
- Merge a `develop`/`main` -> pipelines realizan deploy usando `deploy/cicd/*` templates.

### 4.5 Scripts de Infraestructura

**Ubicación:** `scripts/`

| Script | Función |
|--------|---------|
| `start.sh` | Inicia backend (uvicorn) y frontend (vite) con soporte worktree |
| `stop_apps.sh` | Detiene procesos uvicorn/vite |
| `copy_dot_env.sh` | Copia .env entre directorios |
| `reset_db.sh` | Reseteo DB (informacional; Supabase se usa en prod) |
| `expose_webhook.sh` | Expone webhook local |
| `delete_pr.sh` | Elimina PR |
| `clear_issue_comments.sh` | Limpia comentarios de issue |

### 4.5 Scripts de Backend

**Ubicación:** `backend/scripts/`

| Script | Función |
|--------|---------|
| `generate_comversa_templates.py` | Genera plantillas Conversa |
| `generate_los_tajibos_templates.py` | Plantillas Los Tajibos |
| `generate_bolivian_foods_templates.py` | Plantillas Bolivian Foods |
| `seed_knowledge_articles.py` | Seed de artículos de KB |

### 4.6 Chaining y Estado

El runner orquestador mantiene **estado persistente** (ej. `ADWState`, `adw_state.json`) para:
- mapear `issue_number` → `adw_id`
- conservar la ruta del plan generado
- registrar el branch name creado
- registrar el PR creado
- reintentar pasos fallidos de forma controlada

Ejemplo conceptual (standalone con `system-zero`):

```bash
uv run system-zero/METODOLOGY/agents_system/run_agent.py /classify_issue '{"number": 123, "title": "...", "body": "..."}'
uv run system-zero/METODOLOGY/agents_system/run_agent.py /chore '123 adw_id {"number": 123, "...": "..."}'
uv run system-zero/METODOLOGY/agents_system/run_agent.py /generate_branch_name 'feature adw_id {"number": 123, "...": "..."}'
uv run system-zero/METODOLOGY/agents_system/run_agent.py /implement 'path/to/plan_file.md'
uv run system-zero/METODOLOGY/agents_system/run_agent.py /test
```

### 4.7 Convención de Ramas

```
{type}-{issue_number}-{adw_id}-{slug}
```

Ejemplo: `feat-456-e5f6g7h8-add-user-authentication`

---

## 5. Validación de Calidad

### 5.1 Backend (Python)

| Capa | Herramienta | Comando |
|------|-------------|---------|
| Unit tests | pytest | `cd backend && uv run pytest tests/ -v` |
| Linting | ruff | `ruff check`, `ruff format` |
| Type hints | — | Requeridos en todas las funciones |

**Módulos con tests dedicados:**

- `tests/test_rag/` — RAG (288 tests según doc)
- `tests/test_legal/`
- `tests/test_servicedesk/`
- `tests/test_cmdb/`
- `tests/test_financial/`
- `tests/test_helios_extraction.py`, `test_landingai_extraction_service.py`

### 5.2 Frontend (TypeScript/React)

| Capa | Herramienta | Comando |
|------|-------------|---------|
| Type check | tsc | `npm run tsc --noEmit` |
| Build | Vite | `npm run build` |
| Lint | ESLint | `npm run lint` |
| E2E | Playwright | `npm run test:e2e` |

### 5.3 Fase de Test en ADW

Orden típico en el runner al ejecutar el comando `/test`:

1. **Unit tests** (pytest backend)
2. **Frontend type check** (tsc)
3. **Frontend build**
4. **E2E** (opcional, según runner; frecuentemente con `--skip-e2e` para acelerar)

### 5.4 E2E Manual

- Guías en `.claude/commands/e2e/` (en el proyecto destino; ej. `test_chatbot_answering.md`, `test_rag_module.md`)
- Screenshots en `e2e/screenshots/` (en el proyecto destino)
- Informes en `e2e/test-results/` (en el proyecto destino)
- Validación backend: `e2e/validate_chatbot_backend.sh` (en el proyecto destino)

### 5.5 Propuestas de Mejora (historial de mejoras/artifacts)

**Problema identificado:** El bug `KeyError: 0` (HeliOS PDF extraction, grounding dict vs list) no fue detectado por:

- Unit tests (mockean APIs con formato fijo)
- E2E (flujos felices, no edge cases)

**Solución propuesta:** Fase de **API Integration Tests** (curl contra endpoints reales):

1. Comando `/test_api` para probar endpoints con curl
2. Integración en el flujo del runner de `/test` entre unit tests y E2E
3. Fixtures con respuestas reales de APIs externas

Estado: documentado en artifacts del proyecto destino (p. ej. `docs/` o historial del issue); implementación parcial.

---

## 6. Aciertos y Desaciertos

### 6.1 Aciertos

| Área | Descripción |
|------|-------------|
| **Arquitectura** | Clean Architecture y SOLID bien aplicados; capas claras |
| **Especificaciones** | Specs muy detalladas con root cause analysis, tareas numeradas, validation commands |
| **Trazabilidad** | `implementations/` y `app_docs/` (en el proyecto destino) documentan cambios de forma consistente |
| **ADW modular** | Scripts encadenables, estado compartido, fases separadas |
| **Suite RAG** | Cobertura amplia del módulo RAG (288 tests) |
| **Guías E2E** | Procedimientos manuales para flujos críticos (chatbot, RAG) |
| **Convenciones** | Nomenclatura de componentes (S0*), commits convencionales |

### 6.2 Desaciertos

| Área | Descripción |
|------|-------------|
| **Gap de tests API** | Unit tests con mocks no detectaron bug de formato de respuesta (grounding dict vs list) |
| **E2E flaky** | Referencias a tests E2E fallidos (ej. en WORKPLAN) |
| **ADW en carpetas "old"** | Scripts en `adws_old 20250103`, `adws_old 20251212`, `adws_old 20251226`; posible migración incompleta |
| **Tests sin cobertura real** | RAG: 211 passed, 47 failed, 30 errors en validación inicial |
| **API Integration** | Propuesta documentada pero no plenamente implementada |

### 6.3 Lecciones Aprendidas

1. **Mocks vs realidad:** Los mocks deben reflejar la variabilidad real de las APIs (list vs dict, etc.).
2. **Tests de integración:** Curl contra endpoints reales detecta bugs que unit tests y E2E pueden no cubrir.
3. **E2E costosos:** Los E2E se omiten a menudo (`--skip-e2e`) por tiempo; priorizar API integration puede dar mejor ROI.

---

## 7. Estructura de Documentación
```
/
├── README.md                   # Visión del estándar ia-hybrid-teams
├── METODOLOGY.md               # Este documento (flujo issue-driven + Bitbucket)
├── LINEAMIENTOS.md             # Lineamientos: arquitectura, hooks, formato y contribución
├── claude.md                   # Contexto base para Claude
├── architecture.md            # Contrato de arquitectura base (ejemplo para arrancar)
├── spec-kit/                  # Contratos operativos: fase, agente, hooks, templates
├── agents/                    # Definiciones de agentes (rol/entrada/conducta/restricciones)
├── diagrams/                  # Norte de la estrategia por fase (Mermaid)
├── hooks/                     # Pre-Project Hook + Post-Query KPIs (kpi.txt)
├── templates/                 # Estructuras y patrones (Clean Architecture, SOLID, etc.)
├── deploy/                    # Plantillas CI/CD para Bitbucket Pipelines
├── tests/                     # Plantillas de pruebas/scenarios (HTML report)
└── docs/                      # Guías operativas (Bitbucket ADW automation, etc.)
```

---

## 8. Documentos Detallados
Para profundizar (en este repo), usa:

| Ruta | Qué encontrarás |
|------|------------------|
| `spec-kit/` | Contratos unificados (schema de agentes, fase, hooks y runtime requirements) |
| `agents/` | Specs canónicas por agente (con entrada sugerida y foco de Login) |
| `hooks/` | Cómo se valida pre-proyecto (`claude.md`, `architecture.md`) y cómo se registran KPIs (`kpi.txt`) |
| `diagrams/` | Norte por fase del flujo de desarrollo |
| `deploy/` | Plantillas Bitbucket Pipelines para despliegue automático |

---

**Última actualización:** 2026-03-19  
**Fuentes:** `claude.md`, `architecture.md`, `spec-kit/`, `agents/`, `hooks/`, `diagrams/`, `deploy/`, `tests/`, `system-zero/METODOLOGY/agents_system/`
