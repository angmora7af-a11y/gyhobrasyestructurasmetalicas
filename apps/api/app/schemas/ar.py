from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class InvoiceMirrorCreate(BaseModel):
    client_id: UUID
    siigo_document_number: str
    issue_date: date
    due_date: date
    total_amount: Decimal
    balance_amount: Decimal
    status: str = "open"


class InvoiceResponse(BaseModel):
    id: UUID
    client_id: UUID
    siigo_document_number: str
    due_date: date
    total_amount: Decimal
    balance_amount: Decimal
    status: str

    model_config = {"from_attributes": True}


class PaymentEntryCreate(BaseModel):
    channel: str
    reference: str | None = None
    amount: Decimal
    paid_at: datetime | None = None
    notes: str | None = None


class PaymentEntryResponse(BaseModel):
    id: UUID
    channel: str
    reference: str | None
    amount: Decimal
    paid_at: datetime | None
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
