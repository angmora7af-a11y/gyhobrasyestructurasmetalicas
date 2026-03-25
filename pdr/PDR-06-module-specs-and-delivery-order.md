# PDR-06 — Especificación por módulo y orden de entrega

**Validación `call2.txt`:** sin **devoluciones** en MVP; **cartera** reforzada; **Siigo** único para FE; **remisiones** con código cliente + timestamp; migración Excel global.

---

## Orden lógico de desarrollo (MVP actualizado)

| Fase | Orden | Módulo | Entregables principales | Depende de |
|------|-------|--------|-------------------------|------------|
| **0** | 1 | **Fundación** | Monorepo, CI, Docker, config multi-instancia | — |
| **1** | 2 | **Auth & RBAC** | Login, roles, auditoría, shell UI | 0 |
| **2** | 3 | **Catálogo + migración Excel** | CRUD Alforequipos, **sin imágenes**, precio **día**, venta; **endpoints globales** import; aprobación admin | 1 |
| **3** | 4 | **Clientes & obras** | NIT, sucursales, obras, **siglas** para remisión | 1 |
| **4** | 5 | **Crédito (v1)** | Expediente, estados | 3 |
| **5** | 6 | **Solicitudes / cotizaciones** | Tickets, líneas, estados | 2, 3 |
| **6** | 7 | **Remisiones + venta directa** | Remisión con **código** (cliente + timestamp); venta directa; PDF opcional | 5 |
| **7** | 8 | **Kardex & reportes** | Movimientos sin devolución en app; export tipo `INDEX`; saldos según PDR-04 | 6 |
| **8** | 9 | **Insumos / proforma → Siigo** | Export o integración; **no CPE** desde app | 7 |
| **9** | 10 | **Integración Siigo (cartera + datos)** | Sync/import facturas para cartera ordenada | 8 |
| **10** | 11 | **Cartera** | Pendientes, mora, **canales de recolección**, recordatorios | 9 |
| **11** | 12 | **Dashboards admin** | Préstamo, solicitudes, cartera | 10 |
| **12** | 13 | **WhatsApp** | Opcional | 5+ |
| **13** | 14 | **Devoluciones (fase posterior)** | Corte, saldos completos | — |

*El módulo **Devoluciones** se elimina del camino crítico MVP hasta nueva decisión.*

---

## Módulos resumidos

### Módulo 2 — Catálogo + migración

- `product_prices`: alquiler **por día** únicamente; venta con precio unitario.
- Routers **globales** documentados para POST multipart Excel (ver PDR-05).

### Módulo 7 — Remisiones

- Campo `display_code` o equivalente: **prefijo/siglas cliente** + **timestamp** (UTC o America/Bogota).
- Unicidad global en instancia.

### Módulo 7 (reportes) — Kardex

- Sin tabla `returns` en MVP; exports pueden mostrar **0** en devolución o importar histórico.

### Módulo 10 — Cartera

- Entrada de datos desde **Siigo** (prioridad); objetivo: **orden** y **oportunidad de pago** (`call2.txt`).

---

## Mapeo FR → módulo (MVP)

| FRs | Módulo |
|-----|--------|
| FR-001–004 | Auth |
| FR-010–016 | Catálogo + migración |
| FR-020–023 | Cliente + crédito |
| FR-030–033 | Solicitudes |
| FR-040–045 | Remisiones / venta |
| — | Devoluciones (diferido) |
| FR-060–062 | Kardex |
| FR-070–073 | Insumos Siigo |
| FR-080–083 | Cartera |
| FR-090–092 | Dashboards |
| FR-100 | WhatsApp (opcional) |
| FR-110 | Config multi-instancia |

---

*Al activar devoluciones, insertar fase entre remisiones y kardex completo y actualizar PDR-02/04.*
