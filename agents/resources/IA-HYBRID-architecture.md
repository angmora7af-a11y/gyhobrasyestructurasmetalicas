# architecture.md

Ejemplo mínimo de arquitectura para que el estándar sea ejecutable desde el primer día.

Este archivo debe ser reemplazado/ajustado por proyecto con:
- endpoints reales
- contratos de error
- bounded contexts
- flujos de autenticación (OAuth2/OpenID)
- estándares de logging y seguridad

---

## Clean Architecture

- `domain`: entidades y reglas de negocio (sin frameworks)
- `use-cases`: orquestación (aplica TDD y SOLID)
- `infrastructure`: persistencia, adapters y externos
- `presentation`: controllers/endpoints y/o capa UI

---

## Contrato de Autenticación (Login)

### OAuth2 / OpenID (alto nivel)
- Request login: `POST /auth/login` con payload `{ email, password }`
- Response: `{ accessToken, refreshToken?, user }` según contrato

### Errores
- `400`: validación de input
- `401`: credenciales inválidas
- `429`: rate limiting (si aplica)

---

## Seguridad y Logging

- No imprimir tokens/contraseñas en logs.
- Usar `correlationId` para trazabilidad si el sistema lo define.

---

## Calidad y Tests

- Sugerencia: cobertura mínima > 80% donde aplique.
- Contrato: OpenAPI/Swagger debe corresponder a la implementación real.

