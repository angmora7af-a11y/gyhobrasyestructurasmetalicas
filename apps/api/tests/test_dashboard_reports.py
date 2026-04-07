"""HU-022/023/017 — Dashboard KPIs, export BI, kardex."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from tests.helpers import auth_header, login_as


@pytest.mark.asyncio
class TestDashboard:
    async def test_kpis(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/dashboard/kpis", headers=auth_header(token))
        assert resp.status_code == 200
        data = resp.json()
        assert "active_rentals" in data
        assert "open_tickets" in data
        assert "pending_invoices" in data
        assert "overdue_amount" in data

    async def test_recent_tickets(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get(
            "/api/v1/dashboard/recent-tickets",
            headers=auth_header(token),
        )
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
class TestReports:
    async def test_kardex_endpoint(self, client: AsyncClient):
        token = await login_as(client, "billing")
        resp = await client.get("/api/v1/reports/kardex", headers=auth_header(token))
        assert resp.status_code == 200

    async def test_kardex_filter_by_nit(self, client: AsyncClient):
        token = await login_as(client, "billing")
        resp = await client.get(
            "/api/v1/reports/kardex?nit=900123456-1",
            headers=auth_header(token),
        )
        assert resp.status_code == 200

    async def test_export_bi(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/reports/export-bi", headers=auth_header(token))
        assert resp.status_code == 200
