"""
Shared fixtures for integration tests.

Uses in-memory SQLite with type adapters for PostgreSQL-specific types.
Creates all tables and seeds dummy data once per session.
"""
from __future__ import annotations

import asyncio
import sqlite3
from collections.abc import AsyncGenerator
from datetime import datetime, timezone

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import event
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, TIMESTAMP as PG_TIMESTAMP
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.ext.compiler import compiles

from app.core.database import Base, get_db
from app.main import app as fastapi_app

import app.models  # noqa: F401 — ensure models registered

# ---------------------------------------------------------------------------
# SQLite adapters for PostgreSQL types
# ---------------------------------------------------------------------------
@compiles(PG_UUID, "sqlite")
def compile_pg_uuid_sqlite(type_, compiler, **kw):
    return "TEXT"


@compiles(PG_TIMESTAMP, "sqlite")
def compile_pg_timestamp_sqlite(type_, compiler, **kw):
    return "TIMESTAMP"


# ---------------------------------------------------------------------------
# Test engine (SQLite in-memory) with custom functions
# ---------------------------------------------------------------------------
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(TEST_DB_URL, echo=False)


@event.listens_for(test_engine.sync_engine, "connect")
def _register_sqlite_functions(dbapi_conn, connection_record):
    dbapi_conn.create_function(
        "now", 0, lambda: datetime.now(timezone.utc).isoformat()
    )
    dbapi_conn.create_function(
        "gen_random_uuid", 0, lambda: __import__("uuid").uuid4().hex
    )
TestSessionFactory = async_sessionmaker(test_engine, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_database():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    from tests.seed import collect_all_objects

    async with TestSessionFactory() as session:
        for obj in collect_all_objects():
            session.add(obj)
        await session.commit()

    yield

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def _override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with TestSessionFactory() as session:
        yield session


fastapi_app.dependency_overrides[get_db] = _override_get_db


@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=fastapi_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def db() -> AsyncGenerator[AsyncSession, None]:
    async with TestSessionFactory() as session:
        yield session
