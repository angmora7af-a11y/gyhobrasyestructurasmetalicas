"""HU-002/003/004/005 — Auth, RBAC, auditoría, password reset."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from tests.helpers import auth_header, login_as
from tests.seed import DEFAULT_PASSWORD


@pytest.mark.asyncio
class TestLogin:
    async def test_login_success_all_roles(self, client: AsyncClient):
        for role in ["admin", "client", "logistics", "billing", "ar", "credit", "catalog_contributor"]:
            token = await login_as(client, role)
            assert token

    async def test_login_wrong_password(self, client: AsyncClient):
        resp = await client.post(
            "/api/v1/auth/login",
            json={"email": "admin@gyhobras.com", "password": "wrong"},
        )
        assert resp.status_code == 401

    async def test_login_nonexistent_user(self, client: AsyncClient):
        resp = await client.post(
            "/api/v1/auth/login",
            json={"email": "nobody@gyhobras.com", "password": DEFAULT_PASSWORD},
        )
        assert resp.status_code == 401


@pytest.mark.asyncio
class TestRBAC:
    async def test_me_returns_role(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/auth/me", headers=auth_header(token))
        assert resp.status_code == 200
        data = resp.json()
        assert "admin" in data["roles"]
        assert data["email"] == "admin@gyhobras.com"

    async def test_client_cannot_access_admin_products(self, client: AsyncClient):
        token = await login_as(client, "client")
        resp = await client.post(
            "/api/v1/products",
            headers=auth_header(token),
            json={
                "sku_code": "X",
                "description": "X",
                "category": "X",
                "rental_enabled": False,
                "sale_enabled": True,
                "sale_price": 1000,
            },
        )
        assert resp.status_code == 403


@pytest.mark.asyncio
class TestPasswordReset:
    async def test_request_reset_returns_202(self, client: AsyncClient):
        resp = await client.post(
            "/api/v1/auth/password-reset/request",
            json={"email": "admin@gyhobras.com"},
        )
        assert resp.status_code == 202

    async def test_request_reset_unknown_email_still_202(self, client: AsyncClient):
        resp = await client.post(
            "/api/v1/auth/password-reset/request",
            json={"email": "unknown@gyhobras.com"},
        )
        assert resp.status_code == 202
