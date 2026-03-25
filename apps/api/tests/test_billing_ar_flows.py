"""HU-018/019/020/021 — Billing drafts, Siigo mirror, cartera, pagos."""
from __future__ import annotations

from datetime import date

import pytest
from httpx import AsyncClient

from tests.helpers import auth_header, login_as
from tests.seed import CLIENT_ID, INVOICE_ID


@pytest.mark.asyncio
class TestBillingDrafts:
    async def test_create_billing_draft(self, client: AsyncClient):
        token = await login_as(client, "billing")
        resp = await client.post(
            "/api/v1/billing-drafts",
            headers=auth_header(token),
            json={
                "client_id": str(CLIENT_ID),
                "period_start": "2026-03-01",
                "period_end": "2026-03-31",
                "lines": [],
            },
        )
        assert resp.status_code == 201
        assert resp.json()["status"] == "draft"


@pytest.mark.asyncio
class TestInvoiceMirror:
    async def test_list_invoices(self, client: AsyncClient):
        token = await login_as(client, "ar")
        resp = await client.get("/api/v1/invoices", headers=auth_header(token))
        assert resp.status_code == 200
        assert len(resp.json()) >= 1

    async def test_invoice_detail(self, client: AsyncClient):
        token = await login_as(client, "ar")
        resp = await client.get(
            f"/api/v1/invoices/{INVOICE_ID}", headers=auth_header(token)
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["siigo_document_number"] == "FV-0001"
        assert float(data["balance_amount"]) == 5000000.0

    async def test_register_payment(self, client: AsyncClient):
        token = await login_as(client, "ar")
        resp = await client.post(
            f"/api/v1/invoices/{INVOICE_ID}/payments",
            headers=auth_header(token),
            json={
                "channel": "transfer",
                "reference": "REF-2026-001",
                "amount": 2500000,
                "paid_at": "2026-03-20T10:00:00Z",
                "notes": "Abono parcial",
            },
        )
        assert resp.status_code == 201

    async def test_overdue_endpoint(self, client: AsyncClient):
        token = await login_as(client, "ar")
        resp = await client.get("/api/v1/ar/overdue", headers=auth_header(token))
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestReminders:
    async def test_send_reminder(self, client: AsyncClient):
        token = await login_as(client, "ar")
        resp = await client.post(
            f"/api/v1/ar/reminders/{INVOICE_ID}", headers=auth_header(token)
        )
        assert resp.status_code in (200, 201, 202)
