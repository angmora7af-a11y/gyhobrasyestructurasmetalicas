# Project Brain — Plantilla Gabriela (genérica)

> **Proyecto activo gyhobras:** el cerebro parametrizado y mantenido está en  
> **`agents/project_brain_gyhobras.md`**  
> Usar ese archivo como fuente de verdad; este documento conserva la plantilla ia-hybrid-teams.

*[Subtitle: Business and Operations Vision]*

### Control de Versiones del Documento
| Version | Status | Description of Changes |
| :--- | :--- | :--- |
| **V2.0.0** | **Template** | Plantilla estándar. |
| **V1.0** | Deprecated | Initial generic project template. |

---
## Agent Setup (gyhobras — valores reales)

*   **[project_name]**: **gyhobras**
*   **[project_repo]**: *(raíz del workspace / URL cuando exista)*
*   **[Project_description]**: Ver **`agents/project_brain_gyhobras.md`** y **`BUSSINESS_CASE.md`**
*   **[project_architecture]**: **`pdr/PDR-05-sdd-monorepo-fastapi-web.md`**
*   **[project_brain]**: **`agents/project_brain_gyhobras.md`** (no este archivo vacío)

## Orchestration Instructions
*These instructions guide the agent on how to utilize this Project Brain effectively.*
- Agents (User Story writer, User Story Planner, and others) must use this document as the primary source of truth for understanding the project's business and operational context.
- Before making decisions or proposing changes, agents must consult the "Dynamic Knowledge & Meeting Logs" section to ensure alignment with the latest project developments.
- Any discrepancies between this document and the `[Decision_Log_project_name]` file must be resolved in favor of the latter, as it contains the most up-to-date decisions.


## 1. Strategic Definition & Governance
*The "Why" and "Who" of the project.*

### Executive Summary (Business Goal)
[High-level description of the business value this product provides.]

### Stakeholders and Approvers
| Role | Name | Responsibility | Works for |
| :--- | :--- | :--- | :--- |
| **Project/Product Owner** | [Nombre] | Visión estratégica y presupuesto. | Client / Imagine |
| **Product Delivery Manager** | [Nombre] | Priorización del backlog y aprobación de UAT. | Client / Imagine |
| **Tech Lead** | [Nombre] | Factibilidad técnica. | Client / Imagine |
| **Sales Rep** | [Nombre] | Contacto comercial / KAM. | Client / Imagine |

---

## 2. Scope Management (Límites del Proyecto)
*Critical definition to avoid "scope creep". The agent must validate requirements against this table.*

### Scope Matrix (In/Out)
| Module / Epic | IN SCOPE (What we will do) | OUT OF SCOPE (What we will NOT do) |
| :--- | :--- | :--- |
| **[Module A]** | [Specific functionality] | [Future or discarded functionalities] |
| **[Module B]** | [Specific functionality] | [Complex unapproved integrations] |
| **Platforms** | [e.g., Web Mobile & Desktop] | [e.g., Native iOS App] |

---

## 3. Timeline & Milestones
*The time factor for the agent to understand urgency and phases.*

* **Start Date:** `[YYYY-MM-DD]`
* **Estimated End Date:** `[YYYY-MM-DD]`

### Delivery Roadmap
| Milestone | Target Date | Key Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **MVP / Phase 1** | `[Date]` | [List of core functionalities] | 🟡 In Progress |
| **UAT** | `[Date]` | [User validation] | 🔴 Pending |
| **Go-Live** | `[Date]` | [Go-live deployment] | 🔴 Pending |

---

## 4. Dynamic Knowledge & Meeting Logs
*Living memory of the project. This section centralizes links to master tracking documents.*

### 4.1. Master Meeting Doc (Meeting Minutes)
> **File Access:** `[INSERT URL TO MEETING MINUTES DOC]`
> *This document contains detailed transcripts and notes from each session.*

**Index of Recent Sessions (H1):**
*The agent should consult the linked document for details. The latest sessions are listed here for quick context.*
1. **[e.g., Week X – YYYY-MM-DD – Weekly Follow-Up]**
2. **[e.g., Sprint Planning Q1]**

### 4.2. Change Log 
> **File Access:** `[INSERT URL TO DECISION LOG FILE]`
> *This file is the source of truth regarding scope changes, approvals, and blockers.*
> References to the file: `[Decision_Log_project_name]` == `[INSERT URL TO DECISION LOG FILE]`

**Instruction for the System:**
Any technical or business decision that contradicts the initial documentation should first be sought in this linked file. If the file indicates an approved change, that change takes precedence over the original "Scope Management".

---

## 5. Functional Requirements (Business Logic)
*The "What" the system should do at a business level.*

### Key Characteristics (Business Features)
1.  **[Feature 1]:** [Description of the user story or business flow].
2.  **[Feature 2]:** [Description of the user story or business flow].

### Critical Business Rules
* [Rule 1].
* [Rule 2].