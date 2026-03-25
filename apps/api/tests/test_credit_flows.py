"""HU-011 — Crédito: expediente, estados, bloqueo remisión."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from tests.helpers import auth_header, login_as
from tests.seed import CLIENT_ID, CREDIT_APP_ID


@pytest.mark.asyncio
class TestCredit:
    async def test_list_credit_applications(self, client: AsyncClient):
        token = await login_as(client, "credit")
        resp = await client.get(
            "/api/v1/credit-applications", headers=auth_header(token)
        )
        assert resp.status_code == 200
        assert len(resp.json()) >= 1

    async def test_get_credit_detail(self, client: AsyncClient):
        token = await login_as(client, "credit")
        resp = await client.get(
            f"/api/v1/credit-applications/{CREDIT_APP_ID}",
            headers=auth_header(token),
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "approved"

    async def test_create_credit_application(self, client: AsyncClient):
        token = await login_as(client, "credit")
        resp = await client.post(
            "/api/v1/credit-applications",
            headers=auth_header(token),
            json={
                "client_id": str(CLIENT_ID),
                "notes": "Evaluación inicial",
                "blocks_shipment": False,
            },
        )
        assert resp.status_code == 201
        assert resp.json()["status"] == "in_review"
