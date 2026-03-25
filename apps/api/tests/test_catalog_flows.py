"""HU-007/008/009 — Catálogo CRUD, import Excel, aprobación lote."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from tests.helpers import auth_header, login_as


@pytest.mark.asyncio
class TestCatalogCRUD:
    async def test_list_products(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/products", headers=auth_header(token))
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 4

    async def test_create_product_rental(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.post(
            "/api/v1/products",
            headers=auth_header(token),
            json={
                "sku_code": "TEST-R01",
                "description": "Producto prueba alquiler",
                "category": "Prueba",
                "rental_enabled": True,
                "sale_enabled": False,
                "rental_price_per_day": 25000,
            },
        )
        assert resp.status_code == 201
        assert resp.json()["sku_code"] == "TEST-R01"

    async def test_create_product_rental_missing_price_fails(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.post(
            "/api/v1/products",
            headers=auth_header(token),
            json={
                "sku_code": "TEST-BAD",
                "description": "Sin precio día",
                "category": "Prueba",
                "rental_enabled": True,
                "sale_enabled": False,
            },
        )
        assert resp.status_code == 422

    async def test_no_image_field_in_product(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/products", headers=auth_header(token))
        for product in resp.json():
            assert "image" not in product
            assert "image_url" not in product
