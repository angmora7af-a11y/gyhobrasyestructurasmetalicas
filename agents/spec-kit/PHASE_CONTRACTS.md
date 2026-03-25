# Phase Contracts (Contratos por Fase)

Este documento traduce los diagramas de `diagrams/` a un **contrato operacional**:

- Qué **debe entrar** (inputs) a la fase
- Qué **debe salir** (outputs)
- Qué **agentes** participan (según `spec-kit/AGENT_REGISTRY.md`)
- Qué **hooks** se ejecutan (según `hooks/`)
- Qué se considera “Done” para el output

> Importante: donde el diagrama menciona un participante que no existe como spec en `agents/`, se marca `missing_spec`.

---

## Fase 1: Planeación y Scheduler

### Diagrama de referencia
- `diagrams/phase1_planning.mmd`

### Inputs (de entrada a la fase)
- Conversación/brief en `.txt`
- `database design.sql`
- Arquitectura (documentos)
- Notas técnicas adicionales
- HUs/conceptos a construir (si aplica)

### Outputs (salida requerida)
- Conjunto de **HUs para todos los módulos**
- Scheduler final con:
  - Módulos
  - HUs por módulo
  - Timing por módulo (en horas)
  - Estimaciones por fases / hitos
  - Asignación de recursos (Backend/Frontend)

### Agentes involucrados (mapping)
- `Project Brain` (template) => `agents/Gabriela-ProjectBrain.md`
- `HU Work Planner` (diagrama) => `agents/hu-work-planner.md`
- `User Story Planner / HU Writer` (diagrama conceptual) => `agents/Gimena-userstorywriter.md`
- `Gimena Scheduler` => `agents/gimena-scheduler.md`

### Hooks
- Pre-Project Hook: validar `claude.md` y `architecture.md`
- Post-Query Hook: escribir `kpi.txt` por interacción

### Definition of Done (DoD de output)
- El scheduler incluye módulos + HUs por módulo + timing + hitos.
- No hay supuestos no declarados: si falta info, se incluye sección de aclaraciones.
- Las salidas están alineadas con la arquitectura y bounded contexts definidos.

---

## Fase 2: Backend Development + API Documentation

### Diagrama de referencia
- `diagrams/phase2_backend.mmd`

### Inputs
- HUs y requerimientos técnicos entregados por Leaders (Tech Lead + PDM)
- DB/data needs derivadas del diseño de datos (DBML)
- Contratos de autenticación y endpoints (si existen)

### Outputs
- Implementación validada (según rol de revisión)
- Documentación completa:
  - OpenAPI/Swagger URL del backend
- Evidencia de QA:
  - Reportes de pruebas automatizadas de API
  - Evidencia de cobertura mínima (si aplica)

### Agentes involucrados (mapping)
- Data Model Engineering => `agents/data-engineer.md` (DBML)
- Planificación TDD => `agents/Gabi-workplanner.md` (si se usa para preparar tests)
- Arquitectura => `agents/architect.md`
- Revisión de seguridad y estándares => `agents/auditor.md`
- Debugging / patches => `agents/fixed-errors.md`
- QA integrador de API => `agents/qa-integrator.md`

### Hooks
- Pre-Project Hook
- Post-Query Hook (KPIs)

### Definition of Done
- Swagger/OpenAPI corresponde al backend real (no un placeholder).
- Reportes de pruebas automatizadas de API incluyen:
  - Validación de contrato OpenAPI
  - E2E flujos principales
  - Manejo de errores (happy + edge cases)

---

## Fase 3: Frontend Web o App (Integración UI)

### Diagramas de referencia
- `diagrams/phase3_a_frontend_web.mmd`
- `diagrams/phase3_b_frontend_app.mmd`

### Inputs
- HUs y UI/UX requirements entregadas por Leaders
- Figma design file (URL o tokens de acceso según contexto)
- Contratos API (OpenAPI/Swagger) del backend

### Outputs
- Frontend funcional (web o app)
- Unit tests (según contrato de salida de Integration)
- Swagger/OpenAPI API URL (de referencia para integración)
- Reportes E2E (si la fase lo define)

### Agentes involucrados (mapping)
- Implementación frontend (React/Angular) o (Flutter/React Native):
  - Web => `agents/fullstack-developer.md` (mapping frontend web)
  - App => `agents/flutter-developer.md`
- Revisión seguridad/estándares => `agents/auditor.md`
- Debugging parches => `agents/fixed-errors.md`
- Integración => `agents/integration.md`

### Hooks
- Pre-Project Hook
- Post-Query Hook (KPIs)

---

## Fase 4: Integración & Calidad (Sonar + MCP Integration + Videos)

### Diagrama de referencia
- `diagrams/phase4_integration_test.mmd`

### Inputs
- Backend OpenAPI/Swagger
- Frontend web y/o app
- Suite de pruebas unitarias y/o contratos

### Outputs
- Gate de calidad Sonar (resultados)
- Validación de estándares de pruebas unitarias
- Evidencia de integración:
  - Resultados de MCP integration testing
  - Videos/screenshot de ejecuciones
- Recomendación Go/No-Go

### Agentes involucrados (mapping)
- Sonar quality gate => `agents/sonar-quality-gate.md`
- Unit test standard reviewer => `agents/unit-test-standards-reviewer.md`
- MCP integration tester + video recorder => `agents/mcp-integration-tester.md` + `agents/test-video-recorder.md`
- Quality report consolidation => `agents/quality-report-generator.md`

### Hooks
- Pre-Project Hook
- Post-Query Hook (KPIs)

---

## Fase 5: Despliegue CI/CD (Containers o Apps)

### Diagramas
- `diagrams/phase5_a_deploy_cicd_container.mmd`
- `diagrams/phase5_b_deploy_cicd_app.mmd`

### Inputs
- Artefactos construidos y aprobados (backend/frontends)
- Secrets/certs (IaC + CI/CD)
- Configuración de pipeline (Jenkins/CodeMagic)

### Outputs
- Servicio desplegado (containers) o app publicada en tiendas
- Evidencia de logs y/o estado del pipeline
- Información de disponibilidad por entorno (internal testing / prod)

### Agentes
- En esta fase predominan herramientas/automatización (no necesariamente agentes Claude).
- Recomendación: crear specs para un “Deployment Operator Agent” si el objetivo es agentizar también este paso.

