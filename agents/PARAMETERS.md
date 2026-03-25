# Parámetros globales — Proyecto G&H / Plataforma operativa

**Uso:** todos los agentes en `agents/` deben leer este archivo y **`project_brain_gyhobras.md`** antes de producir entregables.

| Variable | Valor |
|:---|:---|
| **`[project_name]`** | `gyhobras` (Plataforma digital G&H — alquiler, movimientos, cartera) |
| **`[project_repo]`** | *(Raíz del workspace local; añadir URL remota cuando exista)* |
| **`[project_description]`** | Ver `BUSSINESS_CASE.md` y `pdr/PDR-01-product-scope.md` |
| **`[project_brain]`** | `agents/project_brain_gyhobras.md` |
| **`[backlog_path]`** | `agents/outputs/backlog.md` *(crear si no existe)* |
| **`[tech_stack]`** | Monorepo: **Python FastAPI** (API) + **SPA web** (React/Vue/Svelte TBD); PostgreSQL; Redis para jobs |
| **`[platform_standards]`** | RBAC estricto; auditoría; sidebar + workspace; español (es-CO); CPE solo en **Siigo** |
| **`[testing_framework]`** | API: **pytest**; Front: según stack (p. ej. Vitest/Jest) |
| **`[project_architecture]`** | `pdr/PDR-05-sdd-monorepo-fastapi-web.md`, `pdr/diagrams/architecture-agnostic.mmd` |
| **`[pdr_index]`** | `pdr/00-INDEX.md` |
| **`[business_case]`** | `BUSSINESS_CASE.md` |
| **`[docs_index]`** | `INDEX.md` (índice de `docs_reference/`) |
| **`[mvp_scope_authority]`** | `call2.txt` + `pdr/REVISION-CALL2.md` **prevalecen** sobre narrativas amplias del caso de negocio cuando hay conflicto |

---

## Reglas de negocio MVP (obligatorias para agentes)

1. **Facturación electrónica:** solo **Siigo**. La plataforma no emite CPE; aporta insumos, cartera y movimientos.
2. **Precio alquiler:** **por día** (no por hora).
3. **Catálogo:** **Alforequipos**; **sin imágenes** en MVP; migración por **Excel** y endpoints globales API.
4. **Remisiones:** código trazable (**siglas cliente + timestamp**).
5. **Fuera de MVP:** módulo **devoluciones**, **transporte/daños/repuestos**, **WhatsApp** obligatorio (WhatsApp = opcional más adelante).
6. **Datos de referencia** (formatos reportes): `INDEX.md` → ML-FA-001, INACAR, CONSTRUCTORES.pdf, producto terminado.

---

## Archivos que el humano debe adjuntar en conversaciones

| Prioridad | Archivo |
|:---|:---|
| Alta | `@agents/project_brain_gyhobras.md` o `@agents/PARAMETERS.md` |
| Alta | `@pdr/PDR-02-functional-requirements.md` para HUs |
| Media | `@INDEX.md`, `@BUSSINESS_CASE.md` |
| Media | `@pdr/PDR-06-module-specs-and-delivery-order.md` para orden de módulos |

---

*Versión: 1.0 — alineada a PDR v2.0 y `call2.txt`.*
