# PDR-01 — Alcance y visión del producto

**Validación:** incorpora decisiones explícitas de `call2.txt` (facturación Siigo obligatoria, precio por día, sin devoluciones en MVP, exclusiones, despliegue multi-ciudad).

## 1.1 Resumen ejecutivo

Se define una **plataforma web** con **API en FastAPI (Python)** en **monorepo**, orientada a **digitalizar** el ciclo: **catálogo Alforequipos** (carga/migración Excel, sin imágenes en MVP) → **solicitud/cotización** → **crédito** (cuando aplique) → **remisión logística** (código trazable: referencia cliente + timestamp) → **movimientos y reportes** → **insumos para facturación en Siigo** → **cartera y cobro** (ordenar facturas, canales de recolección, alineado a Siigo), con **roles diferenciados**, **auditoría** y **reportes**.

La **facturación electrónica (CPE) es exclusivamente en Siigo**; este producto **no** la reemplaza. Referencias: `BUSSINESS_CASE.md`, `call.txt`, **`call2.txt`**, `INDEX.md`.

## 1.2 Objetivos de producto

| ID | Objetivo | Medición sugerida |
|----|----------|-------------------|
| O1 | Reducir dependencia del correo como **único** registro para solicitudes | % tickets con trazabilidad |
| O2 | **Integridad** de movimientos (remisiones, ventas directas) sin borrados no autorizados | Auditoría; integridad referencial |
| O3 | **RBAC** estricto | Matriz rol–permiso verificable |
| O4 | **Cartera** más ordenada: basada en datos de **Siigo**, múltiples canales de recolección, mejor **oportunidad de pago** | Reducción de facturas desordenadas / mora medible |
| O5 | **Siigo como único emisor de factura electrónica** | 100 % CPE fuera de la plataforma (solo insumos/export) |

## 1.3 Actores (roles)

| Rol | Descripción | Fuente principal |
|-----|-------------|------------------|
| **Cliente externo** | Solicita cotización/alquiler o compra; consulta estados | `call.txt`, `OPORTUNITIES_OPERATION` |
| **Aportante de catálogo** | Carga masiva (Excel) para migración; aprobación admin | `call.txt`, `call2.txt` |
| **Administrador** | Aprueba catálogo, ve todo, métricas | `call.txt` |
| **Logística / despacho** | **Remisión** de salida; trazabilidad | `call2.txt`, `INDEX` |
| **Facturación** | Insumos hacia **Siigo** (ML-FA-001 vía `INDEX`) | `BUSSINESS_CASE`, `call2.txt` |
| **Cartera** | Pendientes, mora, recordatorios; **alineación a Siigo** | `call2.txt` |
| **Crédito** | Estudio de crédito | `call.txt`, MS |
| **Solo lectura / auditoría** | (Opcional) | — |

*Sin módulo de **devoluciones** en el MVP (`call2.txt`); el rol cliente no gestiona devoluciones en sistema en esta fase.*

## 1.4 Alcance funcional (MVP vs fases)

### MVP (acotado por `call2.txt`)

- Autenticación, sesiones, RBAC, auditoría en acciones críticas.
- **Catálogo** equipos **Alforequipos**: texto, uso (opcional), **precio**; **sin imágenes**; precio alquiler **solo por día**; venta directa con precio venta.
- **Endpoints globales** API para **carga Excel** (migración masiva) + flujo de aprobación admin.
- **Solicitudes / cotizaciones** (tickets).
- **Remisiones** con **código único** + componente **siglas cliente** + **timestamp** (trazabilidad).
- Procesos de **alquiler** y **venta directa** registrados; **sin** módulo de **devoluciones**.
- Reportes/export (movimientos, saldos según reglas definidas sin devoluciones en app — ver PDR-04).
- **Cartera**: organización de facturas pendientes, canales de recolección, recordatorios; datos coherentes con **Siigo**.
- Dashboard administrativo (órdenes, préstamos, cartera).

### Fases posteriores

- **Devoluciones** y corte operativo completo (cuando se reactive alineación a `BUSSINESS_CASE` / `INDEX`).
- **Multi-ciudad:** **despliegues independientes** por ciudad/instancia (`call2.txt`).
- Integración **Siigo** lectura/escritura según contrato (cartera y maestros).
- **WhatsApp:** **opcional**, no prioridad (`call2.txt`).
- **IA** cobranza: opcional.

## 1.5 Fuera de alcance (explícito — `call2.txt`)

- **Sustituir Siigo** o emitir CPE desde esta plataforma.
- **Transporte, daños, repuestos/reposiciones** como módulos de gestión.
- **Catálogo con imágenes** (MVP).
- **Precio alquiler por hora**.
- **WhatsApp** como canal obligatorio en MVP.

- El proyecto **scraping / WEB_PAGE.md** sigue siendo **línea distinta** salvo decisión explícita.

## 1.6 Supuestos

- **Siigo** permanece como sistema de facturación electrónica.
- Despliegue **agnóstico**; para varias ciudades se prevén **instancias independientes** (`call2.txt`).

---

*Referencia: PDR-02 (FR), PDR-06 (orden), PDR-07, REVISION-CALL2.*
