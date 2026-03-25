"""HU-012/013 — Tickets, estados FSM, SLA."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from tests.helpers import auth_header, login_as
from tests.seed import CLIENT_ID, PRODUCT_IDS, SITE_ID, TICKET_ID


@pytest.mark.asyncio
class TestTickets:
    async def test_list_tickets(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.get("/api/v1/tickets", headers=auth_header(token))
        assert resp.status_code == 200
        assert len(resp.json()) >= 1

    async def test_create_ticket(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.post(
            "/api/v1/tickets",
            headers=auth_header(token),
            json={
                "client_id": str(CLIENT_ID),
                "site_id": str(SITE_ID),
                "requested_on": "2026-05-01",
                "lines": [
                    {"product_id": str(PRODUCT_IDS[0]), "quantity": 5},
                ],
            },
        )
        assert resp.status_code == 201

    async def test_fsm_valid_transition(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.patch(
            f"/api/v1/tickets/{TICKET_ID}/status",
            headers=auth_header(token),
            json={"status": "in_quotation"},
        )
        assert resp.status_code == 200

    async def test_fsm_invalid_transition(self, client: AsyncClient):
        token = await login_as(client, "admin")
        # ticket was moved to in_quotation above; going back to received is invalid
        resp = await client.patch(
            f"/api/v1/tickets/{TICKET_ID}/status",
            headers=auth_header(token),
            json={"status": "received"},
        )
        assert resp.status_code == 409

    async def test_add_comment(self, client: AsyncClient):
        token = await login_as(client, "admin")
        resp = await client.post(
            f"/api/v1/tickets/{TICKET_ID}/comments",
            headers=auth_header(token),
            json={"body": "Comentario de prueba SLA"},
        )
        assert resp.status_code == 201
