from __future__ import annotations

import csv
import io
from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.deps import require_role
from app.models.auth import AppUser
from app.models.client import Client
from app.models.shipment import Shipment, ShipmentLine

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/kardex")
async def kardex(
    nit: str | None = Query(None),
    product_id: UUID | None = Query(None),
    site_id: UUID | None = Query(None),
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(require_role("admin", "logistics", "billing")),
):
    stmt = (
        select(
            Shipment.display_code,
            Shipment.occurred_at,
            Shipment.client_id,
            Shipment.site_id,
            ShipmentLine.product_id,
            ShipmentLine.quantity_shipped,
        )
        .join(ShipmentLine, ShipmentLine.shipment_id == Shipment.id)
    )

    if nit:
        stmt = stmt.join(Client, Client.id == Shipment.client_id).where(Client.nit == nit)
    if product_id:
        stmt = stmt.where(ShipmentLine.product_id == product_id)
    if site_id:
        stmt = stmt.where(Shipment.site_id == site_id)
    if date_from:
        stmt = stmt.where(Shipment.occurred_at >= date_from)
    if date_to:
        stmt = stmt.where(Shipment.occurred_at <= date_to)

    stmt = stmt.order_by(Shipment.occurred_at.desc())
    result = await db.execute(stmt)
    rows = result.all()

    return [
        {
            "display_code": r.display_code,
            "occurred_at": r.occurred_at.isoformat(),
            "client_id": str(r.client_id),
            "site_id": str(r.site_id) if r.site_id else None,
            "product_id": str(r.product_id),
            "quantity_shipped": float(r.quantity_shipped),
        }
        for r in rows
    ]


@router.get("/export-bi")
async def export_bi(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    format: str = Query("json", pattern="^(json|csv)$"),
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(require_role("admin")),
):
    stmt = (
        select(
            Shipment.display_code,
            Shipment.occurred_at,
            Shipment.client_id,
            Shipment.kind,
            ShipmentLine.product_id,
            ShipmentLine.quantity_shipped,
        )
        .join(ShipmentLine, ShipmentLine.shipment_id == Shipment.id)
    )

    if date_from:
        stmt = stmt.where(Shipment.occurred_at >= date_from)
    if date_to:
        stmt = stmt.where(Shipment.occurred_at <= date_to)

    result = await db.execute(stmt)
    rows = result.all()

    data = [
        {
            "display_code": r.display_code,
            "occurred_at": r.occurred_at.isoformat(),
            "client_id": str(r.client_id),
            "kind": r.kind,
            "product_id": str(r.product_id),
            "quantity_shipped": float(r.quantity_shipped),
        }
        for r in rows
    ]

    if format == "csv":
        buf = io.StringIO()
        if data:
            writer = csv.DictWriter(buf, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        buf.seek(0)
        return StreamingResponse(
            iter([buf.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=export_bi.csv"},
        )

    return JSONResponse(content=data)
