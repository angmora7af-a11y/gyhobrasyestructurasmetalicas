"""HU-010 — Clientes, sucursales, obras, siglas."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from tests.helpers import auth_header, login_as
from tests.seed import CLIENT_ID


@pytest.mark.asyncio
class TestClients:
    async def test_list_clients(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/clients", headers=auth_header(token))
        assert resp.status_code == 200
        assert len(resp.json()) >= 1

    async def test_create_client_with_prefix(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.post(
            "/api/v1/clients",
            headers=auth_header(token),
            json={
                "nit": "800999888-0",
                "legal_name": "Aceros del Norte SAS",
                "remission_prefix": "ACNO",
            },
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["remission_prefix"] == "ACNO"

    async def test_get_client_detail(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get(
            f"/api/v1/clients/{CLIENT_ID}", headers=auth_header(token)
        )
        assert resp.status_code == 200
        assert resp.json()["nit"] == "900123456-1"

    async def test_create_branch_and_site(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp_branch = await client.post(
            f"/api/v1/clients/{CLIENT_ID}/branches",
            headers=auth_header(token),
            json={"suc_code": "SUC99", "name": "Sede Test"},
        )
        assert resp_branch.status_code == 201
        branch_id = resp_branch.json()["id"]

        resp_site = await client.post(
            f"/api/v1/clients/{CLIENT_ID}/branches/{branch_id}/sites",
            headers=auth_header(token),
            json={
                "name": "Obra Test",
                "address": "Cra 7 #100-1",
                "contact_name": "Juan",
                "contact_phone": "3009999999",
            },
        )
        assert resp_site.status_code == 201
