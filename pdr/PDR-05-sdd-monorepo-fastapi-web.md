# PDR-05 — SDD: monorepo, FastAPI y aplicación web

## 1. Visión de arquitectura

- **Monorepo** único con: **API (FastAPI)**, **frontend web (SPA recomendada: React/Vue/Svelte — decisión en implementación)**, paquetes compartidos (tipos, validación), infraestructura como código opcional (`docker-compose` dev).
- **Backend stateless** detrás de balanceador; sesión JWT o cookies httpOnly según decisión de seguridad.
- **Base de datos relacional** (PostgreSQL recomendado) para integridad transaccional de movimientos.
- **Cola de tareas** (Redis + RQ/Celery o equivalente) para reportes pesados, correos de cartera, importaciones.

### 1.1 Validación `call2.txt`

- **Facturación electrónica:** solo **Siigo**; la API expone **insumos/export** y **cartera**, no emisión CPE.
- **Migración:** routers **globales** bajo prefijo estable (p. ej. `/api/v1/migration/catalog` o similar) para **carga Excel**, autenticación de servicio o rol admin, límites de tamaño y rate limit.
- **Multi-ciudad:** **despliegues independientes** (una instancia por ciudad/tenant); configuración por variables de entorno (`TENANT_ID`, `CITY_CODE`, branding).
- **Catálogo:** sin almacenamiento de imágenes en MVP.

*Diagrama lógico:* `diagrams/architecture-agnostic.mmd`.

---

## 2. Estructura de carpetas sugerida (monorepo)

```
/
├── apps/
│   ├── api/                 # FastAPI (Python)
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── routers/     # por dominio: auth, catalog, tickets, movements, billing, ar
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── schemas/     # Pydantic
│   │   │   └── deps.py
│   │   ├── alembic/         # migraciones
│   │   └── pyproject.toml / requirements.txt
│   └── web/                 # SPA
│       ├── src/
│       └── package.json
├── packages/
│   └── shared-types/        # opcional (OpenAPI client gen)
├── infra/
│   └── docker-compose.yml
└── pdr/                     # documentación
```

---

## 3. Capas API (FastAPI)

| Capa | Responsabilidad |
|------|-----------------|
| **Router** | HTTP, validación entrada, auth |
| **Service** | Reglas de negocio (remisión, saldo, aprobaciones) |
| **Repository** | Acceso a BD |
| **Domain** | Entidades puras donde aplique |

**Regla:** no calcular saldo kardex en el cliente; siempre en servidor.

---

## 4. Autenticación y autorización

- **OAuth2 password** o **JWT** con refresh; roles en claims o tabla `user_roles`.
- **Policies** por endpoint (ej. `require_role("logistics")`).
- **Auditoría:** middleware que registra usuario, acción, entidad, antes/después (JSON diff selectivo).

---

## 5. Frontend web

- **Una sola aplicación** con rutas por rol (guardas de navegación).
- Layout: **sidebar** fijo + **main** scroll (`call.txt`).
- **i18n** (es-CO) preparado para strings.
- Tablas con paginación server-side para movimientos.

---

## 6. Integración Siigo (diseño) — **obligatoria en propósito**

La facturación **siempre** es en Siigo (`call2.txt`). La plataforma debe:

- **Leer / sincronizar** datos necesarios para **cartera** (facturas, saldos, estados) según método disponible.
- **Enviar** maestros o movimientos solo si el contrato Siigo lo permite.

Modos técnicos:

- **Opción A:** API oficial Siigo.
- **Opción B:** Exportación CSV/Excel y importación programada.
- **Opción C:** RPA (último recurso).

El SDD debe **actualizarse** cuando se elija opción (ver `QUESTIONS.md` sección B).

---

## 7. Despliegue (agnóstico y multi-instancia)

- Contenedores: **API** + **web estática** + **PostgreSQL** + **Redis**.
- **Varias ciudades:** una **instancia** por despliegue (BD y configuración separadas o esquema por tenant), sin acoplar datos entre ciudades salvo decisión explícita (`call2.txt`).
- CI: lint, tests API, build web.
- **Secrets** en variables de entorno, nunca en repo.

---

## 8. Trazabilidad requisito → código

| Artefacto | Herramienta |
|-----------|-------------|
| FR-xxx | Etiquetas en issues / comentarios en PR |
| OpenAPI | Generado desde FastAPI `/openapi.json` |
| Migraciones | Alembic versionado |

---

*Complemento visual: `diagrams/flows-core.mmd`.*
