# PDR-02 — Requerimientos funcionales (especificación)

**Convención:** `FR-XXX` — prioridad M (Must) / S (Should) / C (Could).  
**Validación `call2.txt`:** precio alquiler **solo por día**; **sin devoluciones** en MVP; **Siigo obligatorio** para FE; catálogo **sin imágenes**; migración **Excel** vía endpoints globales; remisiones con **cliente + timestamp**; **WhatsApp** opcional.

---

## A. Identidad, acceso y auditoría

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-001 | Login con credenciales; sesión revocable; recuperación de contraseña | M | Layout sidebar (`call.txt`) |
| FR-002 | RBAC estricto | M | `BUSSINESS_CASE`, `call2.txt` |
| FR-003 | Auditoría: catálogo, remisiones, ventas, aprobaciones import, cambios en cartera | M | Sin eventos de “devolución” en MVP |
| FR-004 | Perfiles: Cliente, Aportante catálogo, Admin, Logística, Facturación, Cartera, Crédito | M | |

---

## B. Catálogo e inventario maestro (Alforequipos)

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-010 | CRUD productos: código, descripción, categoría, modalidad **alquiler** y/o **venta directa** | M | `call2.txt` Alforequipos |
| FR-010a | **Sin campo de imagen** en MVP; opcional texto de **uso** o notas | M | `call2.txt` |
| FR-011 | Precio alquiler **único por día** (no por hora); precio venta para venta directa | M | `call2.txt` |
| FR-012 | Bodegas / ubicaciones | S | `INDEX.md` |
| FR-013 | Importación masiva Excel; **endpoints API globales** dedicados a migración (auth + validación) | M | `call2.txt` |
| FR-014 | Estados import: borrador → pendiente aprobación → activo/rechazado | M | |
| FR-015 | Validación import: duplicados, códigos obligatorios, tipos | M | |
| FR-016 | Documentación OpenAPI de endpoints de migración **versionada** y estable | S | Contrato para ETL |

---

## C. Cliente, obra y crédito

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-020 | Cliente: NIT, razón social, sucursales | M | |
| FR-021 | Obra/proyecto: dirección, contacto | M | |
| FR-022 | Módulo crédito: expediente, estados | S | |
| FR-023 | Condiciones comerciales (plazo, cupo) | S | Cartera |

---

## D. Solicitud, cotización y aprobación comercial

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-030 | Ticket solicitud/cotización: ítems, cantidades, obra, fecha | M | |
| FR-031 | Estados: recibido → en cotización → enviada → aceptada/rechazada | M | |
| FR-032 | Adjuntos y comentarios | S | |
| FR-033 | SLA / avisos internos | S | |

---

## E. Remisión, logística y venta directa

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-040 | Crear **remisión de envío** (alquiler) desde flujo autorizado | M | |
| FR-041 | Identificador único de remisión + **código visible** compuesto por **siglas alfanuméricas asociadas al cliente** + **timestamp** de generación | M | `call2.txt` trazabilidad |
| FR-042 | Líneas: producto, cantidad enviada, fecha | M | |
| FR-043 | Registro de **venta directa** (documento/orden interno) cuando aplique | M | `call2.txt` venta directa |
| FR-044 | PDF/export remisión (plantilla) | S | |
| FR-045 | **Exclusión:** no gestionar transporte, daños ni repuestos en el sistema | M | `call2.txt` |

---

## F. Devolución y corte — **fuera de alcance MVP**

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-050 | ~~Registrar devolución~~ | — | **No implementar en MVP** (`call2.txt`) |
| FR-051 | ~~Corte por devolución~~ | — | Diferido; liquidación por días puede apoyarse luego en Siigo + proceso manual hasta nueva fase |
| FR-052 | ~~Acta descargue~~ | — | Diferido salvo decisión de producto |

*Fase posterior:* reintroducir FR de devolución alineados a `BUSSINESS_CASE` e `INDEX.md`.

---

## G. Kardex y reportes

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-060 | Consultas de movimiento basadas en **remisiones y ventas** registradas en plataforma; saldos **acordes al modelo sin devoluciones** o importación histórica | M | Compatible export tipo `INDEX` donde columnas devolución = 0 o legado |
| FR-061 | Export movimiento / kardex (Excel/PDF) | M | |
| FR-062 | Filtros NIT, producto, fechas | M | |
| FR-063 | Reportes de transporte/daños/reposición | — | **Excluidos** (`call2.txt`) |

---

## H. Facturación e integración Siigo

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-070 | Proforma/borrador o insumo de liquidación **para uso en Siigo** | S | ML-FA-001 |
| FR-071 | Registro de aprobación cliente si aplica | S | |
| FR-072 | **Toda factura electrónica (CPE) se emite en Siigo**; la plataforma **no** genera CPE | M | `call2.txt` obligatorio |
| FR-073 | Export / integración batch hacia Siigo según diseño | S | |

---

## I. Cartera (reforzada — `call2.txt`)

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-080 | Cartera basada en **facturas y estados coherentes con Siigo** (import manual, API o archivo) | M | Resolver desorden inicial |
| FR-081 | **Varios canales de recolección** de información de pago (definir: transferencia, comprobante, portal) | S | `call2.txt` |
| FR-082 | Pendientes, mora, recordatorios programados | M | |
| FR-083 | Hooks IA | C | |

---

## J. Administración y métricas

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-090 | Dashboard: préstamos activos, solicitudes, cartera | M | |
| FR-091 | Métricas cartera | S | |
| FR-092 | Export datos BI | C | |

---

## K. Canales opcionales

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-100 | WhatsApp | C | **Opcional**; no MVP directo (`call2.txt`) |
| FR-101 | Notificaciones email en tickets | S | |

---

## L. Despliegue multi-instancia

| ID | Requerimiento | P | Notas |
|----|---------------|---|--------|
| FR-110 | Arquitectura preparada para **despliegues independientes** por ciudad/tenant | S | `call2.txt` — configuración por instancia |

---

*Pruebas: cada FR activo debe tener caso de aceptación. FR marcados “—” no aplican al MVP actual.*
