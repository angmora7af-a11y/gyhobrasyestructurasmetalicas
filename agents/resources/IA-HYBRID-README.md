# IA Hybrid Teams — Estandarización de Agentes Claude

Iniciativa de **Imagine Apps** para estandarizar el uso de agentes Claude en el ciclo de desarrollo de software. Este repositorio define roles, contexto MCP, restricciones, diagramas de flujo por fase, hooks y plantillas para que cada agente opere de forma **conductual, restringida y reproducible** en cada etapa del proceso y para cada proyecto de la empresa.

---

## Objetivo

- **Estandarizar** el comportamiento de los agentes Claude por fase y especialidad.
- Usar **diagramas** como mapa y norte de la estrategia de agentización para cada fase y proceso.
- Definir **agentes** con grupos/contexto MCP, rol, conducta y restricciones claras.
- Asegurar **seguridad, aplicabilidad y ahorro de token** mediante **hooks** (rutinas pre/post consulta).
- Ofrecer **templates** por agente y proceso con ejemplos de salida exitosa.

- **Lineamientos de desarrollo**: arquitectura (Clean Architecture), estándares (Clean Code, SOTA), hooks y uso del ejemplo de referencia `@EJEMPLO`. Ver [LINEAMIENTOS.md](LINEAMIENTOS.md).

---

## Estructura del repositorio

```
ia-hybrid-teams/
├── README.md                 # Este documento
├── LINEAMIENTOS.md           # Arquitectura, estándares, hooks, resumen por agente
├── agents/                   # Grupos de contexto MCP, rol, entrada sugerida y foco Login por agente
├── spec-kit/                 # Contratos por fase + esquema unificado de agente + ejecución segura
├── config/                   # Reglas Cursor y principios Claude (templates)
├── deploy/                   # Docker y CI/CD (generate-docker.sh, Bitbucket Pipelines)
├── diagrams/                 # Mapas de flujo por fase (norte de la estrategia de agentización)
├── hooks/                    # Pre-project (claude.md, architecture.md), Post-query (kpi.txt)
├── templates/                # Estructura Clean Architecture, SOLID, patrones de arquitectura
├── tests/                    # Pruebas de escenarios (integración funcional, reporte HTML)
└── .cursor/rules/            # Regla específica para archivos claude.md / .claude/
```

---

## Agentes

En **`agents/`** se registran los **grupos de contexto MCP** por agente: rol, qué debe tener el agente (conducta) y **restricciones**. Cada entrada debe ser conducente y restrictiva para que el agente no se desvíe del propósito.

| Agente | Rol | Alcance |
|--------|-----|---------|
| **Architect** | Diseño de sistemas y validación de patrones. | Arquitectura, capas, escalabilidad, patrones. |
| **Fullstack Developer** | Implementación de lógica de negocio y UI. | Backend + Frontend web, APIs, componentes. |
| **Flutter Developer** | Desarrollo móvil y manejo de widgets. | Apps móviles (Flutter), widgets, estado, integración. |
| **Fixed Errors** | Debugging y parches de seguridad. | Análisis de errores, correcciones, CVE y parches. |
| **Data Engineer** | Pipelines de datos y optimización de queries. | Modelo de datos, ETL, SQL, rendimiento. |
| **Auditor** | Revisión de código, cumplimiento de estándares y seguridad. | Code review, estándares, OWASP, buenas prácticas. |

Cada agente en `agents/` incluye:

- **Rol** (descripción corta).
- **Entrada sugerida** (prompt recomendado para invocar al agente).
- **Foco del Login** (objetivo aplicado al flujo de autenticación, como caso de uso de referencia).
- **Contexto MCP** (grupos/archivos de contexto asociados).
- **Conducta** (qué debe y no debe hacer).
- **Restricciones** (límites de alcance, formato de salida, no inventar datos, uso de `@EJEMPLO`).
- **Versión** del agente y changelog cuando aplique.

Detalle por agente: [agents/](agents/). Resumen en [LINEAMIENTOS.md](LINEAMIENTOS.md).

---

## Diagramas

En **`diagrams/`** están los diagramas Mermaid que sirven como **mapa y norte** de la estrategia de agentización para cada fase y proceso del desarrollo:

| Diagrama | Fase / Proceso |
|----------|-----------------|
| `phase1_planning.mmd` | Planeación: PO → hu-work-planner → gimena-scheduler → HUs y scheduler. |
| `phase2_backend.mmd` | Backend: Leaders → data-engineer (DBML) → TDD/backend → QA integrador (OpenAPI/Swagger). |
| `phase3_a_frontend_web.mmd` | Frontend Web: Leaders → Figma → frontend (React/Angular) → Integration. |
| `phase3_b_frontend_app.mmd` | Frontend App: Leaders → Figma → frontend (Flutter/React Native) → Integration. |
| `phase4_integration_test.mmd` | Integración y calidad: Sonar, MCP integration, videos de pruebas, estándares de unit tests. |
| `phase5_a_deploy_cicd_container.mmd` | Despliegue CI/CD: APIs/web en contenedores (Bitbucket, Jenkins, AWS, ECR). |
| `phase5_b_deploy_cicd_app.mmd` | Despliegue CI/CD: Apps a tiendas (CodeMagic → Play Console / App Store Connect). |

Estos diagramas definen **qué agentes intervienen en cada paso** y el orden esperado; las definiciones en `agents/` deben alinearse con ellos.

---

## Diagrama Del Sistema Agentizado

Este diagrama resume el flujo **end-to-end** del sistema agentizado (Bitbucket Issue -> runner -> fases/agents -> hooks/kpi -> PR -> Pipelines -> deploy -> feedback):

- Ver `diagrams/system0_agentized_sdlc.mmd`

---

## Hooks

En **`hooks/`** se definen **rutinas que se ejecutan antes y después** de las consultas o del uso del agente, con el objetivo de:

- **Seguridad**: validación de inputs, sanitización, límites de ejecución.
- **Aplicabilidad**: asegurar que el prompt/contexto se ajuste al rol y fase.
- **Ahorro de token**: recorte de contexto innecesario, resúmenes, cacheo cuando aplique.
- **Contractualización y veracidad**: que la salida quede acotada a lo acordado (formato, no alucinaciones, citas a fuentes cuando corresponda).

- **Pre-Project Hook**: valida existencia de `claude.md` y `architecture.md` antes de iniciar cualquier tarea. Ver [hooks/pre-project-validate.md](hooks/pre-project-validate.md) y [hooks/scripts/validate-pre-project.sh](hooks/scripts/validate-pre-project.sh).
- **Post-Query Hook (KPIs)**: actualiza `kpi.txt` tras cada interacción con formato `[FECHA] | Query: "..." | Tokens: N | Status: SUCCESS|FAIL`. Ver [hooks/post-query-kpi.md](hooks/post-query-kpi.md) y [hooks/kpi.txt.example](hooks/kpi.txt.example).

Cada hook documenta: nombre, fase/agente asociado, pre o post, y qué garantiza (seguridad / token / contractualización). Ver [hooks/README.md](hooks/README.md).

---

## Templates

En **`templates/`** se mantienen **plantillas por agente y por proceso** que muestran **ejemplos de salida exitosa** para cada especialidad. El objetivo es que el agente tenga una referencia clara de:

- Formato esperado (ej. markdown, JSON, estructura de HUs, reportes de auditoría).
- Nivel de detalle (ej. HUs, APIs, código de ejemplo, reportes de seguridad).
- Estilo (conciso, técnico, listas, tablas, etc.).

Cada template indica: agente, proceso/fase, y al menos un ejemplo de salida considerada correcta. La estructura de carpetas base (Clean Architecture) y el Login como caso de referencia se documentan en [templates/folder-structure.md](templates/folder-structure.md).

### Templates por propósito

| Template | Uso |
|----------|-----|
| [folder-structure.md](templates/folder-structure.md) | Estructura de capas Clean Architecture (domain, use-cases, infrastructure, presentation) |
| [solid-patterns.md](templates/solid-patterns.md) | Principios SOLID con ejemplos cortos; usar al implementar o refactorizar |
| [architecture-patterns.md](templates/architecture-patterns.md) | Patrones: Repository, Use-Case, Adapter, C4, Bounded Contexts |

---

## Recursos adicionales

### config/ — Reglas Cursor y principios Claude

Plantillas para configurar el comportamiento de agentes en Cursor IDE.

| Recurso | Qué hace | Requiere |
|---------|-----------|----------|
| [cursor-rules-template.mdc](config/cursor-rules-template.mdc) | Protocolo autónomo: fuentes de conocimiento, verificación, logging | Copiar a `.cursor/rules/`, reemplazar placeholders `{{...}}` |
| [claude-rules-principles.mdc](config/claude-rules-principles.mdc) | Aplica constitución de Claude: Safety → Ethics → Guidelines → Helpfulness | Copiar a `.cursor/rules/`, definir vars en Bitbucket si aplica |

**Uso:** `cp config/cursor-rules-template.mdc .cursor/rules/agent-protocol.mdc` y personalizar.

---

### deploy/ — Docker y CI/CD

| Recurso | Qué hace | Requiere |
|---------|----------|----------|
| [generate-docker.sh](deploy/generate-docker.sh) | Genera Dockerfile, docker-compose.yml y .dockerignore seguros | Proyecto con `package.json`, `requirements.txt`, `go.mod`, etc. Ejecutar desde raíz del proyecto. |
| [cicd/bitbucket-pipelines.yml.template](deploy/cicd/bitbucket-pipelines.yml.template) | Pipeline: un servicio → EC2 vía SSH | Vars en Bitbucket: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` (base64), `APP_PORT`, `DEPLOY_PATH` |
| [cicd/bitbucket-pipelines-monorepo.yml.template](deploy/cicd/bitbucket-pipelines-monorepo.yml.template) | Pipeline Bitbucket: monorepo (varios servicios) → EC2 | Mismas vars + todas las vars de la app. `size: 2x` para builds pesados. |

**Uso:** `./deploy/generate-docker.sh` desde el proyecto. Para CI/CD: copiar el template a `bitbucket-pipelines.yml` y configurar variables en el repositorio.

---

### tests/ — Pruebas de escenarios

Pruebas de integración que validan **flujos completos** (no unit tests): listar → comprar → pagar → verificar, o CRUD en orden.

| Recurso | Qué hace | Requiere |
|---------|----------|----------|
| [SCENARIO-DESIGN.md](tests/SCENARIO-DESIGN.md) | Guía para diseñar escenarios: orden, dependencias, ejemplos (marketplace, CRUD) | — |
| [python/](tests/python/) | Implementación pytest con reporte HTML | `pip install -r tests/python/requirements-test.txt`, API corriendo |
| [scenarios/](tests/scenarios/) | Definiciones YAML de flujos (marketplace, crud-order) | Referencia; implementar en `test_*.py` |

**Uso:** `cd tests/python && pip install -r requirements-test.txt && pytest -v --html=../reports/report.html --self-contained-html`. Abrir `tests/reports/report.html`.

---

### .cursor/rules/claude-code.mdc

Regla que aplica al editar `claude.md`, `CLAUDE.md` o `.claude/`. Incluye protocolo autónomo y convenciones para archivos de contexto Claude.

**Uso:** Automático cuando se abren esos archivos. Ya está en `.cursor/rules/`.

---

## Forma de contribución

El trabajo es **colaborativo** para todo el equipo de Imagine Apps. Cualquier mejora (agente, hook, template, diagrama o documentación) debe seguir este flujo:

1. **Crear un PR** con los cambios (agentes, hooks, templates, diagramas o README).
2. **Solicitar aprobación** siguiendo el patrón de revisión por **líderes técnicos**:
   - **Daniel Muñoz**
   - **Mauricio**
   - **Diego Achury**
   - **Angela Forero**
3. En el PR es **clave** incluir:
   - **Versión** en la que queda el agente (o el artefacto que se versiona).
   - **Documentación del objetivo de la mejora** (qué problema resuelve o qué estandariza).
   - **Ejemplos de resultados** (antes/después, capturas o fragmentos de salida esperada).

Sin aprobación de al menos un líder técnico, no se hará merge a la rama principal.

---

## Resumen de responsabilidades por artefacto

| Artefacto | Responsabilidad |
|-----------|------------------|
| **Agents** | Contexto MCP, rol, conducta y restricciones por agente; versión y changelog; redirects a templates. |
| **Spec-kit** | Contratos por fase, esquema unificado de agente, mapping a diagramas y contratos runtime/hook. |
| **Config** | Reglas Cursor (protocolo autónomo, principios Claude) reutilizables por proyecto. |
| **Deploy** | Docker seguro (generate-docker.sh) y pipelines Bitbucket (un servicio / monorepo → EC2). |
| **Diagrams** | Norte de la agentización por fase; alineación con agents, hooks y templates. |
| **Hooks** | Seguridad, aplicabilidad y ahorro de token; contractualización y veracidad pre/post consulta. |
| **Templates** | Estructura Clean Architecture, SOLID, patrones de arquitectura; ejemplos por agente. |
| **Tests** | Pruebas de escenarios (flujos funcionales, reporte HTML); guía de diseño. |
| **Contribución** | PR + aprobación por líderes técnicos + versión + objetivo + ejemplos. |

---

## Entregables por curso / proyecto

Para cada iniciativa que use este estándar de agentización se espera:

- **Código fuente** del caso de referencia (ej. Login) organizado por la estructura en `templates/folder-structure.md`.
- **Estructura de carpetas** del login (y de otros flujos que se estandaricen) alineada con Clean Architecture.
- **Scripts de validación de hooks**: ejecución del Pre-Project Hook (validación de `claude.md` y `architecture.md`) y registro en `kpi.txt` según Post-Query Hook (ver `hooks/`).
- **Opcional:** Reglas Cursor desde `config/` para el proyecto; Docker/CI/CD desde `deploy/`; pruebas de escenarios desde `tests/`.

---

*Iniciativa de estandarización de agentes Claude — Imagine Apps.*
