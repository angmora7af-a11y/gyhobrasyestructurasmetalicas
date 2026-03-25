from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator

CREDIT_STATUSES = {"in_review", "approved", "rejected", "conditioned"}


class CreditApplicationCreate(BaseModel):
    client_id: UUID
    notes: str | None = None
    blocks_shipment: bool = False


class CreditApplicationUpdate(BaseModel):
    status: str
    notes: str | None = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in CREDIT_STATUSES:
            raise ValueError(f"status must be one of {CREDIT_STATUSES}")
        return v


class CreditApplicationResponse(BaseModel):
    id: UUID
    client_id: UUID
    status: str
    notes: str | None
    blocks_shipment: bool
    created_at: datetime

    model_config = {"from_attributes": True}
