# Template: Folder Structure (Clean Architecture)

Standard structure for backend/fullstack and reference for mobile (Flutter). Each agent must produce a **functional Login** aligned with this organization.

---

## Directory Tree

```
/src
  /core
    /domain              # Entities and business rules (no external dependencies)
    /use-cases           # Use cases (e.g., LoginUser.ts, LogoutUser.ts)
  /infrastructure
    /persistence         # Repositories (Postgres, Firebase, ORM)
    /external-api        # External services (OAuth, notifications, etc.)
  /presentation
    /controllers         # HTTP entry layer (Express, FastAPI, Nest)
    /views-widgets       # UI: React/Next components or Flutter widgets
```

---

## Layer Responsibilities

| Layer | Responsibility | Must Not |
|-------|----------------|----------|
| **domain** | Entities, value objects, pure business rules. | Access DB, HTTP, frameworks. |
| **use-cases** | Orchestrate domain and infra (inject repositories/services). | Know UI details or DB driver details. |
| **infrastructure** | Implement repositories, API calls, persistence. | Contain business logic. |
| **presentation** | Controllers: validate input, call use-case, return response. Views: bind state, call services/hooks. | Business logic or direct DB access. |

---

## Login Flow Example (Reference)

1. **presentation/controllers**: Receives `email` + `password`, validates with Zod/Yup, calls `LoginUser.execute()`.
2. **use-cases/LoginUser**: Validates credentials via `UserRepository`, issues token/session, logs audit if applicable.
3. **domain**: `User` entity, rules (e.g., active user, password not expired).
4. **infrastructure/persistence**: `UserRepository` implementation (DB); hashing with Argon2/Bcrypt in application or infra layer.
5. **presentation/views-widgets**: Login form, loading/error/success states, service/hook call that invokes API.

---

This document serves as the **structure template**; successful output examples per agent (diagrams, code, reports) are referenced from `agents/` and prompts via `@EJEMPLO`.
