# Revisión PDR según `call2.txt` (validaciones técnicas)

**Fecha de incorporación:** 2026-03-24  
**Fuente:** `call2.txt` — Validaciones y ajustes técnicos

## Decisiones incorporadas en el PDR

| Tema | Decisión |
|------|----------|
| **Facturación** | **Exclusivamente por Siigo.** No se sustituye el ERP; la plataforma refuerza **cobro y cartera** alineados a lo reportado en Siigo, con canales de recolección y orden frente al desorden inicial de facturas. |
| **Catálogo** | Equipos **Alforequipos**; **sin imágenes** en MVP; datos de producto, uso (opcional) y **precio**; carga/migración vía **Excel** con **endpoints globales** en la API. |
| **Precio alquiler** | **Solo por día** (no por hora). |
| **Multi-ciudad** | Despliegues **independientes** por ciudad/instancia (más adelante). |
| **Remisiones** | Código único con trazabilidad; **doble referencia**: siglas alfanuméricas ligadas al **cliente** + **timestamp** de generación/salida. |
| **Exclusiones explícitas** | No gestión de **transporte, daños ni repuestos** en el sistema. |
| **WhatsApp** | **Módulo opcional**; no implementación directa por ahora. |
| **Devoluciones** | **Fuera del alcance actual**: solo procesos de **alquiler** y **venta directa** registrados; no módulo de devoluciones por el momento. |

## Documentos actualizados

- `00-INDEX.md` (versión y fuentes)  
- `PDR-01` … `PDR-07`, `QUESTIONS.md`  
- `diagrams/flows-core.mmd`  
- `ux/SITEMAPS-CHECKLIST-BY-ROLE.md`

---

*Cualquier conflicto entre este archivo y versiones anteriores de `call.txt` prevalece **call2.txt** para alcance MVP.*
