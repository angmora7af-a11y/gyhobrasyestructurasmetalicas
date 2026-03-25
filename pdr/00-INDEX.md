# PDR — Índice de entregables (Product Delivery Requirements)

**Proyecto:** Plataforma digital G&H — alquiler, inventario por movimientos, integración operativa  
**Stack acordado (PDR):** Monorepo · **API Python (FastAPI)** · **Aplicación web** multi-rol  
**Fuentes analizadas:** `BUSSINESS_CASE.md`, `call.txt`, **`call2.txt` (validaciones — prevalece sobre alcance MVP)**, `INDEX.md`, `WEB_PAGE.md`, `OPORTUNITIES_OPERATION.md` (referencia operativa)

**Última revisión:** ver [REVISION-CALL2.md](./REVISION-CALL2.md).

---

## Documentos PDR

| # | Documento | Contenido |
|---|-----------|-----------|
| 01 | [PDR-01-product-scope.md](./PDR-01-product-scope.md) | Visión, objetivos, alcance, fuera de alcance, actores |
| 02 | [PDR-02-functional-requirements.md](./PDR-02-functional-requirements.md) | Requerimientos funcionales (FR-xxx), trazabilidad a procesos |
| 03 | [PDR-03-nonfunctional-requirements.md](./PDR-03-nonfunctional-requirements.md) | Seguridad, rendimiento, auditoría, integraciones |
| 04 | [PDR-04-data-and-formats.md](./PDR-04-data-and-formats.md) | Datos y formatos según `INDEX.md` / referencias documentales |
| 05 | [PDR-05-sdd-monorepo-fastapi-web.md](./PDR-05-sdd-monorepo-fastapi-web.md) | SDD: estructura monorepo, capas, API, front, despliegue |
| 06 | [PDR-06-module-specs-and-delivery-order.md](./PDR-06-module-specs-and-delivery-order.md) | Especificación por módulo + **orden lógico de desarrollo** |
| 07 | [PDR-07-gaps-review.md](./PDR-07-gaps-review.md) | Incongruencias, vacíos, ambigüedades del planteamiento |
| — | [QUESTIONS.md](./QUESTIONS.md) | Preguntas abiertas para el cliente / producto |
| — | [REVISION-CALL2.md](./REVISION-CALL2.md) | Resumen de cambios tras `call2.txt` |

## Diagramas (Mermaid `.mmd`)

| Archivo | Uso |
|---------|-----|
| [diagrams/architecture-agnostic.mmd](./diagrams/architecture-agnostic.mmd) | Arquitectura lógica agnóstica de proveedor cloud |
| [diagrams/flows-core.mmd](./diagrams/flows-core.mmd) | Flujos y secuencias del negocio (solicitud → kardex → cobro) |

## UX / construcción de UI

| Archivo | Uso |
|---------|-----|
| [ux/SITEMAPS-CHECKLIST-BY-ROLE.md](./ux/SITEMAPS-CHECKLIST-BY-ROLE.md) | Sitemap + checklist por rol y módulo |

---

## Lectura recomendada

1. `PDR-01` → `PDR-06` (orden de negocio y entrega).  
2. `diagrams/*.mmd` en visor compatible con Mermaid.  
3. `QUESTIONS.md` antes de cerrar alcance de MVP.

---

*Versión del índice: 2.0 — alineada a `call2.txt`*
