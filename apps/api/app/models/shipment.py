from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String, text
from sqlalchemy.dialects.postgresql import TIMESTAMP, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Shipment(Base):
    __tablename__ = "shipment"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenant.id"), nullable=False
    )
    display_code: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    client_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("client.id"), nullable=False
    )
    site_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("site.id"), nullable=True
    )
    ticket_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("ticket.id"), nullable=True
    )
    kind: Mapped[str] = mapped_column(
        String, server_default=text("'rental_dispatch'"), nullable=False
    )
    occurred_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False
    )
    created_by: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("app_user.id"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False
    )


class ShipmentLine(Base):
    __tablename__ = "shipment_line"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    shipment_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("shipment.id"), nullable=False
    )
    product_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("product.id"), nullable=False
    )
    quantity_shipped: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
