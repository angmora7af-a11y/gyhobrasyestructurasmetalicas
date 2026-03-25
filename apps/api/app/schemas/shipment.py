from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class ShipmentLineCreate(BaseModel):
    product_id: UUID
    quantity_shipped: Decimal


class ShipmentCreate(BaseModel):
    client_id: UUID
    site_id: UUID | None = None
    ticket_id: UUID | None = None
    lines: list[ShipmentLineCreate]


class ShipmentLineResponse(BaseModel):
    id: UUID
    product_id: UUID
    quantity_shipped: Decimal

    model_config = {"from_attributes": True}


class ShipmentResponse(BaseModel):
    id: UUID
    display_code: str
    client_id: UUID
    site_id: UUID | None
    ticket_id: UUID | None
    kind: str
    occurred_at: datetime
    lines: list[ShipmentLineResponse]

    model_config = {"from_attributes": True}


class DirectSaleLineCreate(BaseModel):
    product_id: UUID
    quantity: Decimal
    unit_price: Decimal


class DirectSaleCreate(BaseModel):
    client_id: UUID
    site_id: UUID | None = None
    internal_reference: str | None = None
    lines: list[DirectSaleLineCreate]


class DirectSaleLineResponse(BaseModel):
    id: UUID
    product_id: UUID
    quantity: Decimal
    unit_price: Decimal

    model_config = {"from_attributes": True}


class DirectSaleResponse(BaseModel):
    id: UUID
    client_id: UUID
    internal_reference: str | None
    created_at: datetime
    lines: list[DirectSaleLineResponse]

    model_config = {"from_attributes": True}
