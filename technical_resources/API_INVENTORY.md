# API_INVENTORY — Contrato planeado (FastAPI)

**Base URL (planeada):** `https://{host}/api/v1`  
**Autenticación:** `Authorization: Bearer <access_token>` salvo rutas públicas de auth y health.  
**Formato:** JSON (`Content-Type: application/json`) salvo `multipart` en import.  
**Fuentes:** `pdr/PDR-05`, `pdr/PDR-02`, `hus/HU_RUN-MVP-2026-03-24-all.md`, `database-model.dbml`.

**Convenciones de respuesta:** errores `{ "detail": "..." }` (FastAPI) o `{ "errors": [...] }` en validación; listados con `{ "items": [], "total": n, "page": n }` donde aplique.

---

## Leyenda

| Columna | Significado |
|--------|-------------|
| **Body** | JSON salvo indicación `multipart` |
| **Requiere auth** | Sí = Bearer obligatorio |

---

## Health & meta

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/health` | — | No | Liveness |
| GET | `/api/v1/openapi.json` | — | No | Esquema OpenAPI (generado) |

---

## Auth (HU-002, HU-005)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| POST | `/api/v1/auth/login` | `{ "email": string, "password": string }` | No | Respuesta: `access_token`, `refresh_token`, `token_type`, `expires_in` |
| POST | `/api/v1/auth/refresh` | `{ "refresh_token": string }` | No | Rotación opcional |
| POST | `/api/v1/auth/logout` | `{ "refresh_token": string }` opcional | Sí | Revoca refresh |
| POST | `/api/v1/auth/password/forgot` | `{ "email": string }` | No | No revelar si el email existe |
| POST | `/api/v1/auth/password/reset` | `{ "token": string, "new_password": string }` | No | Token de un solo uso |

---

## Usuarios y roles (HU-003)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/users` | — | Sí (admin) | Paginación `?page=&size=` |
| POST | `/api/v1/users` | `{ "email", "password", "full_name", "role_codes": string[] }` | Sí (admin) | |
| GET | `/api/v1/users/{user_id}` | — | Sí | |
| PATCH | `/api/v1/users/{user_id}` | `{ "full_name", "is_active", "role_codes" }` parcial | Sí (admin) | |
| GET | `/api/v1/roles` | — | Sí | Lista roles |

---

## Auditoría (HU-004)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/audit-logs` | — | Sí (admin/auditor) | Filtros `?entity_type=&user_id=&from=&to=` |

---

## Catálogo (HU-007)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/products` | — | Sí | Filtros `?q=&is_active=&category=` |
| POST | `/api/v1/products` | `{ "sku_code", "description", "category", "rental_enabled", "sale_enabled", "rental_price_per_day", "sale_price", "usage_notes" }` | Sí (admin/catalog) | Sin imagen |
| GET | `/api/v1/products/{product_id}` | — | Sí | |
| PATCH | `/api/v1/products/{product_id}` | parcial | Sí (admin/catalog) | |
| DELETE | `/api/v1/products/{product_id}` | — | Sí (admin) | Soft-delete recomendado |

---

## Bodegas (FR-012)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/warehouses` | — | Sí | |
| POST | `/api/v1/warehouses` | `{ "code", "name" }` | Sí (admin) | |
| PATCH | `/api/v1/warehouses/{id}` | parcial | Sí (admin) | |

---

## Migración Excel — catálogo (HU-008, HU-009)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| POST | `/api/v1/migration/catalog/import` | **multipart/form-data:** `file` (Excel) | Sí (admin) | Crea `import_batch` en estado `draft` |
| GET | `/api/v1/import-batches` | — | Sí (admin) | |
| GET | `/api/v1/import-batches/{batch_id}` | — | Sí (admin) | Incluye filas con errores |
| POST | `/api/v1/import-batches/{batch_id}/approve` | `{ }` o `{"reject": false}` | Sí (admin) | Activa productos |
| POST | `/api/v1/import-batches/{batch_id}/reject` | `{ "reason": string }` | Sí (admin) | |

---

## Clientes, sucursales, obras (HU-010)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/clients` | — | Sí | `?nit=&q=` |
| POST | `/api/v1/clients` | `{ "nit", "legal_name", "remission_prefix" }` | Sí | |
| GET | `/api/v1/clients/{client_id}` | — | Sí | |
| PATCH | `/api/v1/clients/{client_id}` | parcial | Sí | |
| GET | `/api/v1/clients/{client_id}/branches` | — | Sí | |
| POST | `/api/v1/clients/{client_id}/branches` | `{ "suc_code", "name" }` | Sí | |
| GET | `/api/v1/branches/{branch_id}/sites` | — | Sí | |
| POST | `/api/v1/branches/{branch_id}/sites` | `{ "name", "address", "contact_name", "contact_phone" }` | Sí | |

---

## Crédito (HU-011)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/credit-applications` | — | Sí (crédito/admin) | |
| POST | `/api/v1/credit-applications` | `{ "client_id", "notes" }` | Sí | |
| GET | `/api/v1/credit-applications/{id}` | — | Sí | |
| PATCH | `/api/v1/credit-applications/{id}` | `{ "status", "blocks_shipment", "notes" }` | Sí (crédito) | |
| POST | `/api/v1/credit-applications/{id}/files` | multipart `file` | Sí | |

---

## Tickets / solicitudes (HU-012, HU-013)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/tickets` | — | Sí | Filtros `?status=&client_id=` |
| POST | `/api/v1/tickets` | `{ "client_id", "site_id", "requested_on", "lines": [{ "product_id", "quantity" }] }` | Sí cliente o interno | |
| GET | `/api/v1/tickets/{ticket_id}` | — | Sí | |
| PATCH | `/api/v1/tickets/{ticket_id}` | `{ "status", "first_response_at", "quotation_sent_at" }` | Sí | Transiciones |
| POST | `/api/v1/tickets/{ticket_id}/attachments` | multipart | Sí | |

---

## Remisiones (HU-014, HU-016)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/shipments` | — | Sí | Filtros fecha/cliente |
| POST | `/api/v1/shipments` | `{ "client_id", "site_id", "ticket_id?", "occurred_at", "lines": [{ "product_id", "quantity_shipped" }] }` | Sí (logística) | API calcula `display_code` |
| GET | `/api/v1/shipments/{shipment_id}` | — | Sí | |
| GET | `/api/v1/shipments/{shipment_id}/pdf` | — | Sí | `Accept: application/pdf` |

---

## Venta directa (HU-015)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/direct-sales` | — | Sí | |
| POST | `/api/v1/direct-sales` | `{ "client_id", "site_id?", "internal_reference", "lines": [{ "product_id", "quantity", "unit_price" }] }` | Sí (logística/admin) | |

---

## Kardex y reportes (HU-017)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/reports/movement-detail` | — | Sí (facturación/admin) | Query `?nit=&branch_id=&site_id=&from=&to=&format=` json/csv |
| GET | `/api/v1/reports/kardex-by-client` | — | Sí | Compatible columnas `INDEX` |
| GET | `/api/v1/reports/kardex/export` | — | Sí | `format=xlsx|pdf` |

---

## Facturación — insumos (HU-018) — **no CPE**

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/billing-drafts` | — | Sí (facturación) | |
| POST | `/api/v1/billing-drafts` | `{ "client_id", "period_start", "period_end", "lines": [...] }` | Sí | Borrador interno |
| PATCH | `/api/v1/billing-drafts/{id}` | `{ "status", "client_approved_at" }` | Sí | |
| GET | `/api/v1/billing-drafts/{id}/export` | — | Sí | CSV/Excel para Siigo |

---

## Integración Siigo / cartera (HU-019, HU-020, HU-021)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| POST | `/api/v1/ar/invoices/sync` | `{ "source": "file|api", ... }` o multipart CSV | Sí (admin/cartera) | Carga espejo facturas |
| GET | `/api/v1/ar/invoices` | — | Sí (cartera) | Filtros mora/pendiente |
| GET | `/api/v1/ar/invoices/{invoice_id}` | — | Sí | |
| POST | `/api/v1/ar/invoices/{invoice_id}/payments` | `{ "channel", "reference", "amount", "paid_at", "notes", "attachment_url?" }` | Sí (cartera) | FR-081 |
| POST | `/api/v1/ar/reminders/run` | `{ "dry_run": bool }` | Sí (cartera) | Job o disparo manual |

---

## Dashboards y BI (HU-022, HU-023)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/dashboards/admin/summary` | — | Sí (admin) | KPIs agregados |
| GET | `/api/v1/exports/bi-snapshot` | — | Sí (admin) | FR-092; CSV/JSON |

---

## Configuración tenant (HU-024)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| GET | `/api/v1/tenant/settings` | — | Sí (admin) | Lee `settings_json` |
| PATCH | `/api/v1/tenant/settings` | parcial JSON | Sí (admin) | FR-110 |

---

## Notificaciones (HU-025)

| Método | URL planeada | Body | Requiere auth | Notas |
|--------|----------------|------|---------------|--------|
| POST | `/api/v1/notifications/tickets/test` | `{ "ticket_id" }` | Sí (admin) | Solo dev/stage |

*(Producción: envío en transición de estado vía worker, no obligatorio endpoint público.)*

---

## Endpoints explícitamente **no** incluidos (MVP)

- **POST** factura electrónica / CPE (prohibido; Siigo único).
- Módulos **devoluciones**, **transporte**, **daños**, **repuestos** (FR-045, FR-063).

---

## Resumen ejecutivo

| Dominio | Recursos principales |
|--------|----------------------|
| Auth | login, refresh, password |
| Catálogo | products, warehouses, migration |
| CRM | clients, branches, sites, credit |
| Operación | tickets, shipments, direct-sales |
| Finanzas | billing-drafts, ar/invoices, payments |
| Sistema | audit, dashboards, tenant |

---

*Documento de planificación; ajustar paths exactos al implementar routers FastAPI y prefijos.*
