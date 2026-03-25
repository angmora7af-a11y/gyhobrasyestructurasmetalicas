from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from app.core.database import create_all_tables
from app.routers import health
from app.routers.ar import router as ar_router
from app.routers.auth import router as auth_router
from app.routers.billing import router as billing_router
from app.routers.catalog import import_router as import_batch_router
from app.routers.catalog import router as catalog_router
from app.routers.clients import router as clients_router
from app.routers.credit import router as credit_router
from app.routers.dashboard import router as dashboard_router
from app.routers.direct_sales import router as direct_sales_router
from app.routers.reports import router as reports_router
from app.routers.shipments import router as shipments_router
from app.routers.tickets import router as tickets_router

import app.models  # noqa: F401 — register all models with Base.metadata


@asynccontextmanager
async def lifespan(_app: FastAPI):  # type: ignore[type-arg]
    await create_all_tables()
    yield


app = FastAPI(
    title="G&H Obras API",
    description="API plataforma G&H — ver `pdr/PDR-05-sdd-monorepo-fastapi-web.md`",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

app.include_router(health.router, prefix=API_PREFIX)
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(catalog_router, prefix=API_PREFIX)
app.include_router(import_batch_router, prefix=API_PREFIX)
app.include_router(clients_router, prefix=API_PREFIX)
app.include_router(credit_router, prefix=API_PREFIX)
app.include_router(tickets_router, prefix=API_PREFIX)
app.include_router(shipments_router, prefix=API_PREFIX)
app.include_router(direct_sales_router, prefix=API_PREFIX)
app.include_router(billing_router, prefix=API_PREFIX)
app.include_router(ar_router, prefix=API_PREFIX)
app.include_router(reports_router, prefix=API_PREFIX)
app.include_router(dashboard_router, prefix=API_PREFIX)


@app.get("/")
async def root() -> dict[str, str]:
    return {"service": "gyh-api", "openapi": "/openapi.json", "docs": "/docs"}
