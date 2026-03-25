"""HU-014/015/016 — Remisiones (código trazable), venta directa, PDF."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from tests.helpers import auth_header, login_as
from tests.seed import CLIENT_ID, PRODUCT_IDS, SITE_ID


@pytest.mark.asyncio
class TestShipments:
    async def test_create_shipment_generates_display_code(self, client: AsyncClient):
        token = await login_as(client, "logistics")
        resp = await client.post(
            "/api/v1/shipments",
            headers=auth_header(token),
            json={
                "client_id": str(CLIENT_ID),
                "site_id": str(SITE_ID),
                "lines": [
                    {"product_id": str(PRODUCT_IDS[0]), "quantity_shipped": 3},
                ],
            },
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["display_code"].startswith("ELDO-")

    async def test_list_shipments(self, client: AsyncClient):
        token = await login_as(client, "logistics")
        resp = await client.get("/api/v1/shipments", headers=auth_header(token))
        assert resp.status_code == 200
        assert len(resp.json()) >= 1


@pytest.mark.asyncio
class TestDirectSales:
    async def test_create_direct_sale_no_cpe(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.post(
            "/api/v1/direct-sales",
            headers=auth_header(token),
            json={
                "client_id": str(CLIENT_ID),
                "internal_reference": "OI-001",
                "lines": [
                    {
                        "product_id": str(PRODUCT_IDS[2]),
                        "quantity": 50,
                        "unit_price": 8500,
                    },
                ],
            },
        )
        assert resp.status_code == 201
        data = resp.json()
        assert "cpe" not in data
        assert "factura" not in str(data).lower()
