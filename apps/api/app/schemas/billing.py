from __future__ import annotations

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class BillingDraftLineSchema(BaseModel):
    product_id: UUID
    description: str | None = None
    quantity: int = 1
    unit_price: float = 0.0

    model_config = {"from_attributes": True}


class BillingDraftCreate(BaseModel):
    client_id: UUID
    period_start: date
    period_end: date
    lines: list[BillingDraftLineSchema]


class BillingDraftResponse(BaseModel):
    id: UUID
    client_id: UUID
    period_start: date
    period_end: date
    status: str
    created_at: datetime
    lines: list[BillingDraftLineSchema]

    model_config = {"from_attributes": True}


class ExportBIRequest(BaseModel):
    date_from: date | None = None
    date_to: date | None = None
