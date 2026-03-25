# Templates for Agents and Processes

Each agent and process has templates that provide **examples of successful output** and **reference patterns**. The base folder structure is shared; **Login** is the reference use case across all specializations.

---

## Templates Overview

| Template | Purpose |
|----------|---------|
| **folder-structure.md** | Clean Architecture folder structure and layer responsibilities |
| **solid-patterns.md** | SOLID principles with short examples for implementation and refactoring |
| **architecture-patterns.md** | Architecture patterns (Repository, Use-Case, Adapter, C4, Bounded Contexts) |

---

## Base Folder Structure (Clean Architecture)

```
/src
  /core
    /domain           # Entities and business rules
    /use-cases        # Orchestration (e.g., LoginUser.ts)
  /infrastructure
    /persistence      # Repositories (Postgres, Firebase, etc.)
    /external-api     # External services (auth, notifications)
  /presentation
    /controllers      # Express / FastAPI / Nest
    /views-widgets    # React / Flutter components
```

- **domain**: Pure entities, value objects, business rules.
- **use-cases**: Orchestration (e.g., `LoginUser.ts`); no infra details.
- **infrastructure**: Concrete implementations (DB, external APIs).
- **presentation**: HTTP or UI I/O; delegates to use-cases.

Each agent must produce a **functional Login** organized according to this structure and the focus defined in `agents/<agent>.md`.

---

## Redirect Patterns (for Agents)

Agents use these templates to stay consistent:

- **Implementing or refactoring** → `templates/solid-patterns.md`
- **Designing layers, repositories, adapters** → `templates/architecture-patterns.md`
- **Checking folder structure** → `templates/folder-structure.md`

---

## Prompt Reference

Use the example reference when indicated in the task, e.g.:  
"Generate the login flow following the defined architecture and the example reference [@EJEMPLO]."

Concrete templates per agent (e.g., Architect output, Auditor report) are documented in `templates/` or in the `agents/` files.
