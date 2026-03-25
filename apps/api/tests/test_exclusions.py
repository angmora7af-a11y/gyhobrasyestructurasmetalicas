"""HU-026 — No routes for transport, damages, spare parts."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from tests.helpers import auth_header, login_as


@pytest.mark.asyncio
class TestExclusions:
    async def test_no_transport_route(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/transport", headers=auth_header(token))
        assert resp.status_code == 404

    async def test_no_damages_route(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/damages", headers=auth_header(token))
        assert resp.status_code == 404

    async def test_no_spare_parts_route(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/spare-parts", headers=auth_header(token))
        assert resp.status_code == 404
