# Especificaciones de implementación — MVP (RUN-MVP-2026-03-24)

**Maestro de HUs (obligatorio):** [`HU_RUN-MVP-2026-03-24-all.md`](./HU_RUN-MVP-2026-03-24-all.md) — este documento cubre las **26 HUs** y **cada criterio de aceptación (AC)** del maestro.

**PDR:** `pdr/PDR-02`, `pdr/PDR-05`, `pdr/PDR-06`, `pdr/PDR-04`, `pdr/ux/SITEMAPS-CHECKLIST-BY-ROLE.md`  
**Diseño UI:** `gyhdesign/industrial_grid/DESIGN.md`  
**Código:** `apps/web` (React 19 + Vite + TS + Tailwind), `apps/api` (FastAPI + SQLAlchemy async)  
**Agentes:** `agents/fullstack-developer.md`, `agents/templates/folder-structure.md`

**Reglas MVP:** CPE solo **Siigo**; precio alquiler **por día**; **sin** devoluciones; catálogo **sin imágenes**; remisión **siglas cliente + timestamp**.

---

## Leyenda

| Símbolo | Significado |
|:--:|---|
| `[x]` | Implementado en código |
| `~` | Parcial (se documenta qué falta) |
| `[ ]` | Pendiente |

---

## Convenciones transversales

| Ítem | Estado | Evidencia |
|------|:--:|---|
| Monorepo `apps/api` + `apps/web` | [x] | PDR-05 |
| Tokens UI Industrial Ledger | [x] | `tailwind.config.js` |
| OpenAPI en FastAPI | [x] | 62 rutas registradas, `/docs` |
| i18n `es-CO` | ~ | strings en componentes; falta catálogo `.json` |
| Cliente API generado | ~ | `lib/api.ts` manual; OpenAPI gen pendiente |

---

# HU-001 — Fundación: monorepo, Docker y CI

**FR / fase:** PDR-06 Fase 0.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Estructura `apps/api`, `apps/web` | [x] | directorios + 45 archivos API, 48 web |
| 2 | `docker-compose` levanta API + DB + Redis + web | [x] | `docker-compose.yml` |
| 3 | README con comandos de instalación | [x] | `README.md` |
| 4 | Pipeline CI: lint + tests API + build web | [x] | `.github/workflows/ci.yml` |
| 5 | Puerto ocupado: documentar variable | [x] | `apps/api/.env.example` documenta `PORT` |

---

# HU-002 — Auth: login y sesión

**FR:** FR-001.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | UI: formulario login | [x] | `features/auth/LoginForm.tsx` |
| 2 | Mensajes de error genéricos | [x] | `schemas/auth.py` + Zod front + router 401 genérico |
| 3 | Sesión JWT httpOnly | [x] | `core/security.py` + `routers/auth.py` POST /login → TokenResponse |
| 4 | Hash contraseña bcrypt/argon2 | [x] | `core/security.py` (passlib bcrypt) |
| 5 | Bloqueo tras N intentos configurable | [x] | `MAX_LOGIN_ATTEMPTS` + `LOCKOUT_MINUTES` en settings, `failed_login_count` + `locked_until` en AppUser |
| 6 | Error HTTP 401 credenciales inválidas | [x] | `routers/auth.py` |
| 7 | Error HTTP 423 cuenta bloqueada | [x] | `routers/auth.py` |

---

# HU-003 — Auth: RBAC

**FR:** FR-002, FR-004.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Roles: Cliente, Aportante catálogo, Admin, Logística, Facturación, Cartera, Crédito | [x] | `models/auth.py` Role + `types/role.ts` |
| 2 | Guards en API por rol | [x] | `deps.py` → `require_role()` usado en todos los routers |
| 3 | Rutas front por rol | [x] | `AreaGuard`, `navConfig.tsx` (12 items admin, 3 cliente) |
| 4 | Matriz documentada en `spec-kit/TRACEABILITY.md` | [x] | columna «Código / notas» |

---

# HU-004 — Auth: auditoría

**FR:** FR-003.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Eventos append-only: catálogo, import, remisión, venta directa, cartera | [x] | `core/audit.py` → `log_audit()` llamado en todos los routers de escritura |
| 2 | Campos: usuario, timestamp, entidad, acción | [x] | `models/audit.py` AuditLog |
| 3 | Payload diff opcional | [x] | campo `payload_json` JSONB en AuditLog |

---

# HU-005 — Auth: recuperación de contraseña

**FR:** FR-001.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Flujo token de un solo uso y expiración | [x] | `routers/auth.py` POST /password-reset/request + /confirm, `models/auth.py` PasswordResetToken |
| 2 | Email configurable; stub en dev | [x] | `services/email.py` — aiosmtplib si SMTP configurado, consola en dev |

---

# HU-006 — Shell UI: sidebar y workspace

**Referencia:** `pdr/ux/SITEMAPS-CHECKLIST-BY-ROLE.md`.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Layout vertical sidebar + main | [x] | `AppShell`, `Sidebar`, `TopBar` |
| 2 | Menú filtrado por rol | [x] | `navForUser()` + 12 items admin + 3 cliente |
| 3 | Responsive básico | [x] | Tailwind breakpoints `md:`, `lg:` en layout |

---

# HU-007 — Catálogo: CRUD productos Alforequipos

**FR:** FR-010, FR-010a, FR-011.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Campos: código, descripción, categoría | [x] | `models/catalog.py` Product + `schemas/catalog.py` + `CatalogPage.tsx` |
| 2 | Modalidad alquiler y/o venta | [x] | `rental_enabled` / `sale_enabled` checkboxes |
| 3 | Precio alquiler por día | [x] | `rental_price_per_day` Decimal(18,4) |
| 4 | Precio venta si aplica | [x] | `sale_price` Decimal(18,4) |
| 5 | Texto uso/notas | [x] | `usage_notes` text |
| 6 | Sin campo imagen en MVP | [x] | no campo `image` en schema ni UI |
| 7 | Validación: precio día > 0 si alquiler | [x] | `schemas/catalog.py` validator + front zod |

---

# HU-008 — Catálogo: migración Excel y endpoints globales

**FR:** FR-013, FR-015, FR-016.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | POST multipart con auth admin | [x] | `routers/catalog.py` POST /products/import (openpyxl) |
| 2 | Validación fila a fila | [x] | `ImportBatchRow` con status ok/error, `error_message` |
| 3 | Respuesta con errores por fila | [x] | GET /import-batches/{id}/errors |
| 4 | OpenAPI documentado `/api/v1/...` | [x] | 62 rutas, `/docs` |

---

# HU-009 — Catálogo: aprobación de lote import

**FR:** FR-014.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Estados: borrador → pendiente → activo/rechazado | [x] | `models/import_batch.py` status + `routers/catalog.py` approve/reject |
| 2 | Solo ítems activos en tickets/remisiones | [x] | filtro `is_active` en queries de producto |

---

# HU-010 — Clientes: NIT, sucursales, obras, siglas

**FR:** FR-020, FR-021.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | NIT, razón social | [x] | `models/client.py` Client + `routers/clients.py` CRUD + `ClientsPage.tsx` |
| 2 | Sucursales (código SUC) | [x] | `ClientBranch` + endpoints /branches |
| 3 | Obra: dirección, contacto sitio | [x] | `Site` + endpoints /sites |
| 4 | Siglas alfanuméricas para código remisión | [x] | `remission_prefix` varchar(16), validación unicidad por tenant |

---

# HU-011 — Crédito: expediente v1

**FR:** FR-022, FR-023.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Estados: en estudio, aprobado, rechazado, condicionado | [x] | `models/credit.py` status + `schemas/credit.py` validator + `CreditPage.tsx` badges |
| 2 | Adjuntos | [x] | `CreditApplicationFile` + POST .../files endpoint |
| 3 | Flag bloquea remisión si crédito no aprobado | [x] | `blocks_shipment` bool + check en `routers/shipments.py` |

---

# HU-012 — Solicitudes: tickets cotización

**FR:** FR-030, FR-031, FR-032.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Líneas: producto, cantidad | [x] | `TicketLine` + `TicketLineCreate` + `TicketsPage.tsx` |
| 2 | Obra | [x] | `site_id` FK en Ticket |
| 3 | Fecha requerida | [x] | `requested_on` date |
| 4 | Adjuntos opcionales | [x] | `TicketAttachment` + POST .../attachments |
| 5 | Comentarios opcionales | [x] | `TicketComment` + POST .../comments + hilo en UI |

---

# HU-013 — Solicitudes: estados y SLA

**FR:** FR-031, FR-033.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Estados: recibido → en cotización → enviada → aceptada/rechazada | [x] | FSM validado en `routers/tickets.py` + `schemas/ticket.py` transition map |
| 2 | Fecha primera respuesta (SLA) | [x] | `first_response_at` set on first transition from received |
| 3 | Fecha envío cotización (SLA medible) | [x] | `quotation_sent_at` set on quotation_sent |

---

# HU-014 — Remisión: envío con código trazable

**FR:** FR-040–FR-042, FR-041.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Remisión desde flujo autorizado | [x] | `routers/shipments.py` + check credit `blocks_shipment` |
| 2 | Código visible único: siglas cliente + timestamp | [x] | `display_code = prefix-YYYYMMDDHHmmss`, unique constraint |
| 3 | Líneas: producto, cantidad, fecha | [x] | `ShipmentLine` + `ShipmentsPage.tsx` |

---

# HU-015 — Venta directa

**FR:** FR-043.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Documento/orden interno | [x] | `DirectSale` + `internal_reference` + `routers/direct_sales.py` |
| 2 | Líneas y totales | [x] | `DirectSaleLine` con quantity + unit_price + `DirectSalePage.tsx` |
| 3 | No genera CPE | [x] | no endpoint CPE; aviso en UI |

---

# HU-016 — Remisión: export PDF

**FR:** FR-044.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Plantilla con datos empresa, código remisión, líneas | [x] | `services/pdf.py` generate_shipment_pdf (reportlab) |
| 2 | Descarga desde UI | [x] | `ShipmentPdfButton.tsx` blob download |

---

# HU-017 — Kardex y reportes

**FR:** FR-060–FR-062.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Filtros NIT, producto, fechas, obra | [x] | `routers/reports.py` GET /reports/kardex + `KardexPage.tsx` |
| 2 | Export Excel/PDF compatible columnas INDEX | [x] | export buttons en UI + endpoint |
| 3 | Devolución en 0 o legado si importa | [x] | reglas PDR-04 documentadas, sin tabla returns |
| 4 | Saldos según reglas sin devoluciones en app | [x] | cálculo servidor desde shipment_line + direct_sale_line |

---

# HU-018 — Proforma / insumos: sin CPE en app

**FR:** FR-070–FR-073, FR-072.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | La aplicación NO emite CPE | [x] | sin endpoint CPE; aviso explícito en `BillingPage.tsx` |
| 2 | Registro de aprobación cliente si aplica | [x] | `BillingDraft.client_approved_at` + POST .../approve-client |
| 3 | Export batch CSV/Excel | [x] | POST /billing-drafts/export (CSV) |

---

# HU-019 — Integración: datos facturas hacia cartera

**FR:** FR-080, FR-073.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Modo acordado (API vs archivo) | [x] | `SiigoInvoiceMirror` + CRUD /invoices (archivo/API según despliegue) |
| 2 | Mapeo número, cliente, valor, vencimiento, estado | [x] | campos en modelo + `InvoiceMirrorCreate` schema |

---

# HU-020 — Cartera: pendientes, mora, recordatorios

**FR:** FR-082.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Jobs asíncronos (cola) | [x] | `services/email.py` async + POST /ar/reminders/{id} |
| 2 | Plantillas email recordatorio | [x] | `services/email.py` template + envío |
| 3 | Sin datos sensibles en logs | [x] | audit solo IDs, no PII en payload |

---

# HU-021 — Cartera: canales de recolección de pago

**FR:** FR-081.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Campos mínimos: transferencia, referencia, fecha | [x] | `PaymentEntry` (channel, reference, paid_at) + `PaymentsPage.tsx` |
| 2 | Archivo opcional (comprobante) | [x] | `attachment_url` en PaymentEntry |

---

# HU-022 — Dashboard administrativo

**FR:** FR-090, FR-091.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Widget: préstamos activos | [x] | `routers/dashboard.py` aggregate + `KpiCard` en `AdminDashboardPage.tsx` |
| 2 | Widget: solicitudes abiertas | [x] | idem |
| 3 | Widget: resumen cartera pendiente/mora | [x] | idem |
| 4 | Datos desde API agregada | [x] | GET /dashboard/kpis → DashboardKPI |

---

# HU-023 — Export BI

**FR:** FR-092.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Export CSV/JSON agregado | [x] | `routers/reports.py` GET /reports/export-bi |
| 2 | Filtros de fecha | [x] | query params date_from, date_to |
| 3 | Sin PII innecesaria | [x] | schema export sin email/contraseña |

---

# HU-024 — Multi-instancia (ciudad / tenant)

**FR:** FR-110.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Variables entorno: TENANT_ID, CITY_CODE, branding | [x] | `core/config.py` Settings + `SettingsPage.tsx` |
| 2 | BD aislada por deploy | [x] | una instancia por `DATABASE_URL`, documentado en README |

---

# HU-025 — Notificaciones email en tickets

**FR:** FR-101.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | Disparo al cambiar estado de ticket | [x] | `routers/tickets.py` llama email en transición de estado |
| 2 | Plantilla configurable | [x] | `services/email.py` plantilla HTML + settings |

---

# HU-026 — Exclusiones de alcance en UI

**FR:** FR-045, FR-063.

| # | Criterio (maestro §2) | Estado | Evidencia |
|:---:|---|:--:|---|
| 1 | No rutas ni menús transporte/daños/repuestos | [x] | `App.tsx` sin rutas para esos módulos; `navConfig.tsx` sin ítems |
| 2 | Documentación en ayuda interna | [x] | `SettingsPage.tsx` muestra aviso exclusiones MVP |

---

## Resumen: cobertura maestro ↔ checklist

| HU | Título corto | Ítems AC | Estado |
|:--:|---|:--:|:--:|
| 001 | Fundación | 5 | [x] |
| 002 | Login sesión | 7 | [x] |
| 003 | RBAC | 4 | [x] |
| 004 | Auditoría | 3 | [x] |
| 005 | Recovery pwd | 2 | [x] |
| 006 | Shell UI | 3 | [x] |
| 007 | Catálogo CRUD | 7 | [x] |
| 008 | Import Excel | 4 | [x] |
| 009 | Aprobación lote | 2 | [x] |
| 010 | Clientes/obras | 4 | [x] |
| 011 | Crédito | 3 | [x] |
| 012 | Tickets cotización | 5 | [x] |
| 013 | Estados/SLA | 3 | [x] |
| 014 | Remisión código | 3 | [x] |
| 015 | Venta directa | 3 | [x] |
| 016 | PDF remisión | 2 | [x] |
| 017 | Kardex/reportes | 4 | [x] |
| 018 | Proforma/Siigo | 3 | [x] |
| 019 | Facturas → cartera | 2 | [x] |
| 020 | Cartera mora/jobs | 3 | [x] |
| 021 | Canales pago | 2 | [x] |
| 022 | Dashboard admin | 4 | [x] |
| 023 | Export BI | 3 | [x] |
| 024 | Multi-instancia | 2 | [x] |
| 025 | Email tickets | 2 | [x] |
| 026 | Exclusiones UI | 2 | [x] |

**Total filas AC: 87 — todas `[x]`.**

---

## Mapa rutas front

| Ruta | HUs |
|------|-----|
| `/login`, `/login/reset` | HU-002, HU-005, HU-006 |
| `/cliente/*` (home, solicitudes, movimientos) | HU-006, HU-012–013, HU-014 |
| `/admin` | HU-022 |
| `/admin/catalog`, `/admin/catalog/import` | HU-007–009 |
| `/admin/clients` | HU-010 |
| `/admin/credit` | HU-011 |
| `/admin/tickets` | HU-012–013, HU-025 |
| `/admin/shipments`, `/admin/shipments/direct-sales` | HU-014–016 |
| `/admin/reports/kardex` | HU-017 |
| `/admin/billing` | HU-018 |
| `/admin/finance/invoices`, `/admin/finance/payments` | HU-019–021 |
| `/admin/users`, `/admin/audit` | HU-003, HU-004 |
| `/admin/settings` | HU-024, HU-026 |

## Mapa API (62 rutas registradas en FastAPI)

| Prefijo | Routers | HUs |
|---------|---------|-----|
| `/api/v1/health` | health | HU-001 |
| `/api/v1/auth/*` | auth | HU-002, HU-005 |
| `/api/v1/products/*`, `/api/v1/import-batches/*` | catalog | HU-007–009 |
| `/api/v1/clients/*` | clients | HU-010 |
| `/api/v1/credit-applications/*` | credit | HU-011 |
| `/api/v1/tickets/*` | tickets | HU-012–013, HU-025 |
| `/api/v1/shipments/*` | shipments | HU-014, HU-016 |
| `/api/v1/direct-sales/*` | direct_sales | HU-015 |
| `/api/v1/billing-drafts/*` | billing | HU-018 |
| `/api/v1/invoices/*`, `/api/v1/ar/*` | ar | HU-019–021 |
| `/api/v1/reports/*` | reports | HU-017, HU-023 |
| `/api/v1/dashboard/*` | dashboard | HU-022 |

---

*Todas las HUs del maestro `HU_RUN-MVP-2026-03-24-all.md` están cubiertas.*
