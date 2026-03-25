# Pre-Project Hook: Validación de artefactos

**Tipo:** Pre-query / Pre-project  
**Fase/Agente:** Todos. Se ejecuta antes de iniciar cualquier tarea del agente.  
**Garantiza:** Aplicabilidad (contexto mínimo presente), contractualización (trabajo alineado con arquitectura y rol).

---

## Objetivo

Antes de iniciar cualquier tarea, el sistema debe validar la existencia de:

1. **claude.md**  
   Instrucciones de contexto para el modelo (rol del agente, alcance del proyecto, convenciones).

2. **architecture.md**  
   Documentación detallada de la arquitectura (capas, bounded contexts, flujos, contratos de API).

Si alguno falta, el hook **debe fallar** y reportar qué archivo falta. No se debe iniciar la tarea hasta que ambos existan (o se documente una excepción aprobada).

---

## Comportamiento esperado

| Condición | Acción |
|-----------|--------|
| `claude.md` y `architecture.md` existen | Continuar; inyectar ambos en contexto del agente cuando aplique. |
| Falta `claude.md` | Fallar con mensaje: "Pre-Project Hook: falta claude.md". |
| Falta `architecture.md` | Fallar con mensaje: "Pre-Project Hook: falta architecture.md". |
| Faltan ambos | Fallar listando ambos. |

---

## Integración

- El script `scripts/validate-pre-project.sh` implementa esta validación desde la raíz del proyecto.
- Herramientas de orquestación (IDE, CLI, CI) deben invocar este hook antes de lanzar la consulta al agente.
