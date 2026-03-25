# Templates Guide (Guía de Plantillas)

Este documento define cómo deben usarse las plantillas existentes en `templates/` para producir salidas consistentes por agente y por proceso.

## Plantillas canónicas

- `templates/folder-structure.md`
  - Propósito: estandarizar Clean Architecture y cómo organizar el código del caso de uso (ej. Login).
- `templates/solid-patterns.md`
  - Propósito: referencia de SOLID (ejemplos cortos y reglas de refactor).
- `templates/architecture-patterns.md`
  - Propósito: patrones como Repository, Use-Case/Service, Adapter, C4 y Bounded Contexts.
- `templates/README.md`
  - Propósito: orientación general y redirects a plantillas.

## Regla de aplicación

Cuando un agente deba implementar o refactorizar:

1. Alinea la estructura de carpetas con `templates/folder-structure.md`.
2. Si hay cambio de diseño o separación de capas: usa `templates/architecture-patterns.md`.
3. Si hay refactor: usa `templates/solid-patterns.md` como criterio de verificación.
4. En caso de tareas con formato específico:
   - Respeta el “output contract” del agente (definido en `agents/<agent>.md` y en `spec-kit/AGENT_SPEC_SCHEMA.md`).

## Caso de referencia: Login

El Login es el caso de uso de referencia para todas las especialidades.

Plantillas esperadas:
- Estructura Clean Architecture (src/core, src/infrastructure, src/presentation)
- Flujo login con:
  - validación
  - use-case
  - repositorio/adapter
  - manejo de tokens (según plataforma)
  - estados UI de carga/error/success

## Salida “exitosa” (criterios de consistencia)

Una respuesta exitosa debe incluir:
- Secciones que sigan el contrato del agente (si aplica)
- Respeto de Clean Architecture (no mezclar negocio en controller/UI)
- Evidencia de seguridad (OWASP/CSRF/XSS/SQLi según aplique)
- Ausencia de secretos en el output

