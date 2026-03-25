# Spec-kit — Metodología (IA Hybrid Teams) + validación G&H

**Ubicación en este repo:** `agents/spec-kit/` (metodología y contratos).  
**Proyecto G&H:** trazabilidad FR↔HU, protocolo UAT/CI y `validate.sh` viven **aquí mismo** (copiados desde `spec-kit/` en la raíz del repo para trabajo unificado bajo `agents/`).

---

## Proyecto G&H (validación PDR ↔ HU)

| Archivo | Uso |
|:---|:---|
| [TRACEABILITY.md](./TRACEABILITY.md) | Matriz FR → HU → tipo de prueba |
| [VALIDATION-PROTOCOL.md](./VALIDATION-PROTOCOL.md) | Cómo dar por hecha una HU en UAT y en CI |
| [validate.sh](./validate.sh) | Comprobación de artefactos (`hus/`, índices) — ejecutar desde la **raíz del repo**: `./agents/spec-kit/validate.sh` |

El `spec-kit/` en la **raíz** (`gyhobras/spec-kit/`) puede mantenerse como espejo; la fuente operativa para el equipo híbrido está en **`agents/spec-kit/`**.

---

## Spec-Kit IA Hybrid Teams (contratos operacionales)

Este `spec-kit/` consolida la metodología de `agents/`, `agents/hooks/`, `agents/templates/` y `agents/diagrams/` en un formato de **contrato operacional** para que:

1. Cada agente tenga **contexto MCP** explícito (grupos/archivos), **rol**, **conducta** y **restricciones**.
2. Cada fase del ciclo de desarrollo tenga **inputs/outputs** acordados y su flujo conecte con los agentes.
3. Los hooks garanticen **seguridad**, **aplicabilidad** y **ahorro de token** mediante validaciones y KPIs.

## Fuentes canónicas (dónde “vive” cada verdad)

Rutas relativas a la **raíz del repo** `gyhobras/`:

- Agentes (definición de rol/entrada/restricciones): `agents/*.md`
- Hooks (pre/post y kpi.txt): `agents/hooks/`
- Plantillas (ejemplos y estructura): `agents/templates/`
- Flujo por fase (norte de la agentización): `agents/diagrams/`
- Documentación metodológica upstream: `agents/resources/IA-HYBRID-*.md`

Este `spec-kit/` agrega “pegamento”:

- Un esquema de especificación de agente unificado.
- Un registro de agentes (y cómo se mapearán a las fases).
- Contratos por fase: qué debe entrar y qué debe salir.
- Recomendaciones para completar faltantes (p. ej. participantes del diagrama que aún no tienen spec en `agents/`).

## Versión

- `spec-kit` versión: **0.1.0**

## Qué NO hace este spec-kit

- No implementa código.
- No ejecuta tests.
- No reemplaza los diagramas: los diagramas siguen siendo el norte de flujo.

## Cómo usarlo (proceso recomendado)

1. Preparar los artefactos requeridos en la raíz del proyecto: `claude.md` y `architecture.md` (ver `agents/hooks/`; ejemplos en `agents/resources/IA-HYBRID-claude.md`).
2. Elegir la fase (según `diagrams/`).
3. Consultar el contrato de fase (inputs/outputs + agentes involucrados).
4. Invocar el/los agentes de `agents/` con el contexto MCP correspondiente (asegurado por los hooks).
5. Verificar que el output respete el “contrato” (formato, URLs esperadas, reportes, etc.).

