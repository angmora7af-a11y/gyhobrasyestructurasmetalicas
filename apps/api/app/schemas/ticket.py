from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, field_validator

TICKET_STATUSES = {
    "received",
    "in_quotation",
    "quotation_sent",
    "accepted",
    "rejected",
}

TICKET_TRANSITIONS: dict[str, set[str]] = {
    "received": {"in_quotation"},
    "in_quotation": {"quotation_sent"},
    "quotation_sent": {"accepted", "rejected"},
}


class TicketLineCreate(BaseModel):
    product_id: UUID
    quantity: Decimal


class TicketCreate(BaseModel):
    client_id: UUID
    site_id: UUID | None = None
    requested_on: date | None = None
    lines: list[TicketLineCreate]
    comment: str | None = None


class TicketStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in TICKET_STATUSES:
            raise ValueError(f"status must be one of {TICKET_STATUSES}")
        return v


class TicketLineResponse(BaseModel):
    id: UUID
    product_id: UUID
    quantity: Decimal

    model_config = {"from_attributes": True}


class TicketResponse(BaseModel):
    id: UUID
    client_id: UUID
    site_id: UUID | None
    status: str
    requested_on: date | None
    first_response_at: datetime | None
    quotation_sent_at: datetime | None
    created_at: datetime
    lines: list[TicketLineResponse]

    model_config = {"from_attributes": True}


class CommentCreate(BaseModel):
    body: str
