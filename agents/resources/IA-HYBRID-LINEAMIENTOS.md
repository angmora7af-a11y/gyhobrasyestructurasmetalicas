# Lineamientos de desarrollo

Aplicables a todos los agentes y proyectos que usen este estándar de agentización.

---

## Arquitectura

- **Clean Architecture**: separación clara de capas.
  - **Dominio**: entidades y reglas de negocio (sin dependencias de frameworks).
  - **Casos de uso**: orquestación de la lógica (dependen solo de dominio e interfaces de infra).
  - **Infraestructura**: implementaciones concretas (persistencia, APIs externas, frameworks).
- La dependencia debe apuntar siempre hacia adentro (Infra → Use-cases → Domain). **Inversión de dependencia** en límites (interfaces en core, implementaciones en infra).

---

## Estándares de código

- **Clean Code** y **Programación Pragmática**.
- Uso de recursos del estado del arte (SOTA) para la lógica de los agentes (librerías, patrones y prácticas actuales).
- Cada agente debe incluir una **plantilla de un Login funcional** organizado por carpetas según la arquitectura definida (ver `templates/folder-structure.md`).

---

## Automatización (hooks de control)

- **Pre-Project Hook**: antes de iniciar cualquier tarea, validar existencia de:
  - `claude.md`: instrucciones de contexto para el modelo.
  - `architecture.md`: documentación detallada de la arquitectura.
- **Post-Query Hook (KPIs)**: después de cada interacción, generar o actualizar `kpi.txt` con formato:
  - `[FECHA] | [CONSULTA] | [TOKENS_CONSUMIDOS] | Status: SUCCESS|FAIL`
- Ver detalles en `hooks/README.md`.

---

## Ejemplo de referencia en prompts

En las tareas se puede indicar que la salida debe alinearse con un ejemplo de referencia, por ejemplo:

- "Genera el flujo de login siguiendo la arquitectura definida y el ejemplo de referencia **[@EJEMPLO]**."

Los agentes deben respetar ese ancla para mantener consistencia de formato y nivel de detalle.

---

## Resumen por agente (entrada y foco Login)

| Agente | Entrada sugerida (resumen) | Foco del Login |
|--------|----------------------------|----------------|
| Architect | Topología C4, Bounded Contexts, capas e inversión de dependencia. | Diagrama flujo auth (OAuth2/OpenID), contrato UI antes de código. |
| Fullstack Developer | Monorepo type-safe (Next.js + NestJS), entidades compartidas o mapeadas. | Carpetas use-cases/hooks, validación Zod/Yup. |
| Flutter Developer | Estado reactivo (BLoC/Riverpod), Repository, Clean UI atómica. | Biometría, tokens en Secure Storage, estados carga/error. |
| Fixed Errors | Stack trace + OWASP Top 10, parche + refactor SOLID. | Error Boundaries, logs intentos fallidos, excepciones personalizadas. |
| Data Engineer | Pipeline idempotente, índices cubiertos, Argon2/Bcrypt. | Migraciones users, auditoría de sesiones, pools de conexión. |
| Auditor | Análisis estático, deuda técnica, architecture.md vs implementación, cobertura tests. | Checklist seguridad (SQLi, XSS, CSRF), estándares de logs en login. |

Detalle completo en `agents/`.
