# Project Brain: gyhobras — Plataforma G&H (Alquiler, Siigo, Cartera)

*Business and Operations Vision — alimentado por `BUSSINESS_CASE.md`, `INDEX.md`, `pdr/*` y validación `call2.txt`.*

### Control de versiones
| Version | Status | Description |
| :--- | :--- | :--- |
| **V1.0** | **Current** | Parametrización inicial desde PDR + caso de negocio + índice documental. |

---

## Agent Setup (valores reales)

| Campo | Valor |
| :--- | :--- |
| **project_name** | gyhobras |
| **project_repo** | *(local: `/Users/angelaforero/Documents/gyhobras` o raíz del clone)* |
| **Project_description** | Plataforma web + API FastAPI para digitalizar solicitudes, catálogo Alforequipos, remisiones (trazabilidad), venta directa, reportes/kardex, insumos hacia **Siigo** y **cartera** alineada a facturas Siigo. |
| **project_architecture** | `pdr/PDR-05-sdd-monorepo-fastapi-web.md`, diagramas en `pdr/diagrams/` |
| **project_brain** | `agents/project_brain_gyhobras.md` (este archivo) |
| **Decision override** | Alcance MVP: **`call2.txt`** / `pdr/REVISION-CALL2.md` por encima de narrativas amplias en `BUSSINESS_CASE.md` si chocan (ej. devoluciones en app). |

---

## 1. Strategic definition

### Executive summary (negocio)

- **G&H OBRAS Y ESTRUCTURAS METÁLICAS S.A.S.** (Bogotá): alquiler de equipos de construcción y venta de productos terminados.
- **Siigo:** facturación electrónica y contabilidad; **no** se reemplaza.
- **Legado:** módulo tipo “Manejo de Alquiler de Inventarios” (marca **ALFOREQUIPOS** en UI); problemas: borrado de datos, permisos totales, trabajo con PDF/kardex manual.
- **Nueva plataforma:** integridad, RBAC, trazabilidad, cartera ordenada, canales de cobro, exportes compatibles con formatos de `docs_reference/` (vía `INDEX.md`).

### Stakeholders (plantilla — completar nombres)

| Role | Name | Responsibility |
| :--- | :--- | :--- |
| Project/Product Owner | _Pendiente_ | Visión y prioridad |
| Product Delivery Manager | _Pendiente_ | Backlog y UAT |
| Tech Lead | _Pendiente_ | Arquitectura FastAPI/web |
| Cliente G&H | _Pendiente_ | Reglas de negocio y Siigo |

---

## 2. Scope matrix (MVP validado `call2.txt`)

| Área | IN SCOPE | OUT OF SCOPE (MVP) |
| :--- | :--- | :--- |
| Facturación | Insumos/proforma/export hacia **Siigo**; referencia facturas | Emitir CPE desde la app |
| Catálogo | Alforequipos; texto/uso/precío; **día**; import Excel + API global | Imágenes de producto |
| Operación | Remisiones (**código cliente + timestamp**); **venta directa** | **Devoluciones** (módulo) |
| Cartera | Pendientes, mora, recordatorios, datos alineados **Siigo** | — |
| Otros | Auth, RBAC, auditoría, dashboards | Transporte, daños, repuestos; WhatsApp obligatorio |
| Multi-ciudad | Diseño de despliegue **independiente** por instancia | Una sola BD compartida entre ciudades (por defecto no) |

---

## 3. Documentación maestra (para agentes)

| Documento | Uso |
| :--- | :--- |
| `BUSSINESS_CASE.md` | Visión largo plazo: ciclo remisión → obra → devolución → factura; dolor kardex/permisos |
| `INDEX.md` | Formatos datos: ML-FA-001, INACAR (columnas), PDF kardex, Excel producto terminado; PR-DE-001 inconsistente |
| `pdr/00-INDEX.md` | Índice PDR |
| `pdr/PDR-02-functional-requirements.md` | FR numerados |
| `pdr/PDR-06-module-specs-and-delivery-order.md` | Orden de módulos |
| `pdr/QUESTIONS.md` | Abiertas con cliente |
| `call2.txt` | Reglas MVP obligatorias |

---

## 4. Reglas críticas de datos (`INDEX.md`)

- Reportes tipo **MOVIMIENTO DETALLADO DE OBRA:** NIT, SUC, producto, fechas, remisión, devolución, cantidades, saldo — en MVP sin devoluciones en app, columnas devolución pueden ser 0 o legado.
- **Kardex clientes** (ej. CONSTRUCTORES.pdf): referencia de salida esperada para consulta/export.
- **ML-FA-001:** proceso formal facturación alquiler en Siigo (punteo, proforma, DIAN/RADIAN); partes de transporte/daños no van a sistema en MVP.

---

## 5. Dynamic knowledge

- **Decision log:** usar `pdr/QUESTIONS.md` + actas cuando existan.
- **Cambios de alcance:** actualizar `pdr/REVISION-CALL2.md` o nuevo ADR; agentes deben preferir la versión más reciente.

---

## 6. Tensiones documentadas

- `BUSSINESS_CASE.md` enfatiza **devolución como corte**; MVP (`call2`) **no** implementa devoluciones: liquidación/corte puede seguir en **Siigo** + proceso manual hasta fase II (`pdr/PDR-07-gaps-review.md`).

---

*Fin Project Brain — mantener sincronizado con PDR al cambiar alcance.*
