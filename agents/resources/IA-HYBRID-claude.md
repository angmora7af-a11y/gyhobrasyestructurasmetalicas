# claude.md

Contexto base para IA generativa dentro de `ia-hybrid-teams`.

## Reglas

1. Respetar la arquitectura (Clean Architecture) y bounded contexts descritos en `architecture.md`.
2. No inventar endpoints, tablas, librerías ni métricas que no estén en la documentación del proyecto.
3. Si falta información: incluir una sección `Aclaraciones Necesarias` con marcadores `[BLOCKER] [IMPORTANT] [NICE_TO_HAVE]`.
4. Ahorro de token: responder con el contrato de salida solicitado y resumir contexto no relevante.
5. Seguridad:
   - No exponer secretos (tokens, claves, passwords).
   - No incluir datos sensibles en logs/reports.

## Caso de referencia (Login)

- El flujo de autenticación debe describirse con contrato (OAuth2/OpenID) y considerar seguridad + pruebas.

