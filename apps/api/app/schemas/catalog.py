from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, model_validator


class ProductCreate(BaseModel):
    sku_code: str
    description: str
    category: str | None = None
    rental_enabled: bool = False
    sale_enabled: bool = False
    rental_price_per_day: Decimal | None = None
    sale_price: Decimal | None = None
    usage_notes: str | None = None

    @model_validator(mode="after")
    def rental_price_required(self) -> ProductCreate:
        if self.rental_enabled and (
            self.rental_price_per_day is None or self.rental_price_per_day <= 0
        ):
            raise ValueError(
                "rental_price_per_day must be > 0 when rental_enabled is true"
            )
        return self


class ProductUpdate(BaseModel):
    sku_code: str | None = None
    description: str | None = None
    category: str | None = None
    rental_enabled: bool | None = None
    sale_enabled: bool | None = None
    rental_price_per_day: Decimal | None = None
    sale_price: Decimal | None = None
    usage_notes: str | None = None


class ProductResponse(BaseModel):
    id: UUID
    sku_code: str
    description: str
    category: str | None
    rental_enabled: bool
    sale_enabled: bool
    rental_price_per_day: Decimal | None
    sale_price: Decimal | None
    usage_notes: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ImportRowError(BaseModel):
    row_number: int
    error_message: str


class ImportBatchResponse(BaseModel):
    id: UUID
    status: str
    file_name: str
    total_rows: int
    error_rows: int
    created_at: datetime

    model_config = {"from_attributes": True}
