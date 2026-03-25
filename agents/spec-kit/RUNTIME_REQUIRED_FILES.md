# Runtime Required Files (Archivos Requeridos)

Este documento especifica qué debe existir en el proyecto destino para que la metodología sea ejecutable con los hooks definidos.

## Requeridos por el Pre-Project Hook

El hook `hooks/scripts/validate-pre-project.sh` exige:

- `./claude.md`
  - Instrucciones de contexto para el modelo (políticas del agente, rol, convenciones de salida).
- `./architecture.md`
  - Arquitectura detallada del sistema:
    - capas (Dominio / Aplicación / Infraestructura)
    - bounded contexts (si aplica)
    - contratos y flujos (ej. auth/login)
    - convenciones de endpoints y errores

Si falta alguno: el hook debe fallar y el agente no debe ejecutarse.

## Requeridos por agentes de planificación (si se usan)

Para `Gimena-userstorywriter.md` y `Gabi-workplanner.md`:

- `backlog.md`
  - Registro maestro de historias de usuario generadas.
- `project_brain_[project_name].md`
  - Documento “source of truth” de negocio/operación.
- Opcional: `figma/screens.md`, `/docs/business-rules.md`

Para `ProjectBrain`:
- `project_brain_[project_name].md` puede generarse/llenarse como plantilla.

## Requeridos para el caso de uso de referencia (Login)

- Contratos de API (idealmente desde OpenAPI/Swagger cuando aplique).
- Esquema de datos (DBML o migraciones) si el agente Data Engineer participa.

> Este spec-kit no implementa los archivos: solo define su obligatoriedad para que el proceso sea seguro y consistente.

