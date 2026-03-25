from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String, text
from sqlalchemy.dialects.postgresql import TIMESTAMP, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class DirectSale(Base):
    __tablename__ = "direct_sale"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenant.id"), nullable=False
    )
    client_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("client.id"), nullable=False
    )
    site_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("site.id"), nullable=True
    )
    internal_reference: Mapped[str] = mapped_column(String, nullable=False)
    created_by: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("app_user.id"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False
    )


class DirectSaleLine(Base):
    __tablename__ = "direct_sale_line"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    direct_sale_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("direct_sale.id"), nullable=False
    )
    product_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), ForeignKey("product.id"), nullable=False
    )
    quantity: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
