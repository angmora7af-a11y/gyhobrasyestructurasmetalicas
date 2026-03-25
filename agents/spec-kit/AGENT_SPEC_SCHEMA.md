# Agente Spec Schema (Contrato Unificado)

Este documento define el **formato mínimo** que debe respetar cada especificación de agente para que el sistema pueda orquestarlo de forma consistente.

> Nota: `agents/*.md` son “fuentes canónicas”; este schema define cómo deben lucir y qué deben contener para ser operables desde hooks y fase contracts.

---

## Campos obligatorios (mínimos)

1. **ID**  
   - Campo: `agent_id` (string, estable en el tiempo).  
   - Ejemplo: `architect.v1`.

2. **Nombre y versión**  
   - Campo: `name`  
   - Campo: `version` (semver recomendado: `x.y.z`).

3. **Rol / Misión**  
   - Campo: `role`  
   - Campo: `mission` (qué pretende lograr en el flujo).

4. **Entrada sugerida (Suggested Input)**  
   - Campo: `suggested_input` (prompt recomendado).

5. **Foco del Login (caso de uso de referencia)**  
   - Campo: `login_focus`  
   - Debe describir un objetivo concreto de autenticación acorde al rol del agente.

6. **Contexto MCP**  
   - Campo: `mcp_context_obligatory[]` (lista de artefactos que siempre se deben consumir).  
   - Campo: `mcp_context_optional[]` (artefactos recomendados).

7. **Conducta (Behavior)**  
   - Campo: `behavior_must[]`
   - Campo: `behavior_must_not[]`

8. **Restricciones**  
   - Campo: `constraints[]`  
   - Incluir explícitamente: límites de alcance, no inventar datos, formatos de salida, seguridad, etc.

9. **Handoff / Output contract**  
   - Campo: `handoff_type` (ej. Human in the Loop / automático).
   - Campo: `output_contract` (qué debe entregar exactamente, en qué formato).

10. **Verificación (Definition of Done para output)**  
   - Campo: `output_acceptance_criteria[]` (checklist de “la salida es válida”).

---

## Reglas de adaptación desde esta repo

- Si el agente ya existe en `agents/` con un formato distinto (ej. ProjectBrain / UserStoryWriter), **no se elimina**; se documenta una capa de compatibilidad en `spec-kit/` para mapear campos del schema.
- Cuando un participante del diagrama **no tenga spec en `agents/`**, el contrato por fase debe marcarlo como:
  - `status: missing_spec`
  - `next_step: create spec in agents/`

---

## Ejemplo mínimo (por referencia)

```yaml
agent_id: architect.v1
name: Architect
version: 1.0.0
role: Senior Architect
mission: Define C4, bounded contexts y contratos antes de código
suggested_input: "Define la topología del sistema usando C4..."
login_focus: Flujo auth (OAuth2/OpenID) + contrato de UI
mcp_context_obligatory: ["architecture.md", "claude.md"]
mcp_context_optional: ["docs/api-contracts.md"]
behavior_must:
  - "Generar diagramas"
  - "Definir contratos antes de implementar"
behavior_must_not:
  - "No generar código de producción"
constraints:
  - "No inventar tecnologías"
  - "Salida en secciones markdown"
handoff_type: Human in the Loop
output_contract: "C4 + diagramas de auth + contrato UI"
output_acceptance_criteria:
  - "Incluye OAuth2/OpenID"
  - "Incluye contrato UI"
  - "No incluye código de producción"
```

