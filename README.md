# G&H Obras — monorepo (API + web)

Documentación de producto y requisitos: `pdr/`. Historias de usuario: `hus/`. Diseño de referencia (tokens y layout): `gyhdesign/` e `gyhdesign/industrial_grid/DESIGN.md`.

## Requisitos

- Node.js 20+
- Python 3.12+
- Docker (opcional, para Postgres, Redis, API y Vite en contenedores)

## Desarrollo local (recomendado)

### 1. Infraestructura (base de datos y cola)

```bash
docker compose up -d postgres redis
```

### 2. API (FastAPI)

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Salud: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
- OpenAPI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Web (React + Vite + Tailwind)

En otra terminal:

```bash
cd apps/web
npm install
npm run dev
```

Abrir [http://127.0.0.1:5173](http://127.0.0.1:5173). Las peticiones a `/api/*` se reenvían al backend (ver `apps/web/vite.config.ts`).

## Todo el stack con Docker

```bash
docker compose up --build
```

- Web: [http://127.0.0.1:5173](http://127.0.0.1:5173)  
- API: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Variable `PROXY_API` en el servicio `web` apunta al host `api` dentro de la red Compose.

## Calidad

```bash
cd apps/api && pytest -q
cd apps/web && npm run lint && npm run build && npm run test
bash spec-kit/validate.sh
```

## Estructura

| Ruta | Contenido |
|------|-----------|
| `apps/api` | FastAPI — routers por dominio (`pdr/PDR-05`) |
| `apps/web` | SPA React — shell, auth UI, diseño *Industrial Ledger* |
| `hus/` | HUs y checklist de implementación (`hus/SPECS-IMPLEMENTATION.md`) |
| `agents/` | Roles y lineamientos para agentes de IA |

## Agentes (`agents/`)

Los lineamientos de implementación (capas, validación, login) están en `agents/fullstack-developer.md`, `agents/templates/folder-structure.md` y documentos relacionados. El código en `apps/web` separa **presentación** (componentes, rutas), **estado de sesión** (`AuthProvider`) y **validación de formularios** (`zod` en `features/auth`).
