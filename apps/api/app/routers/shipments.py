from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_audit
from app.core.database import get_db
from app.deps import get_current_user, require_role
from app.models.auth import AppUser
from app.models.client import Client
from app.models.credit import CreditApplication
from app.models.shipment import Shipment, ShipmentLine
from app.schemas.shipment import ShipmentCreate, ShipmentLineResponse, ShipmentResponse

router = APIRouter(prefix="/shipments", tags=["shipments"])


def _generate_display_code(prefix: str) -> str:
    ts = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    return f"{prefix}-{ts}"


@router.post("", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
async def create_shipment(
    body: ShipmentCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "logistics")),
):
    client = await db.get(Client, body.client_id)
    if client is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Client not found")

    credit_result = await db.execute(
        select(CreditApplication).where(
            CreditApplication.client_id == body.client_id,
            CreditApplication.blocks_shipment.is_(True),
            CreditApplication.status != "approved",
        )
    )
    blocking = credit_result.scalar_one_or_none()
    if blocking is not None:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Shipment blocked: pending credit application",
        )

    display_code = _generate_display_code(client.remission_prefix)

    shipment = Shipment(
        tenant_id=user.tenant_id,
        client_id=body.client_id,
        site_id=body.site_id,
        ticket_id=body.ticket_id,
        display_code=display_code,
        kind="rental",
        occurred_at=datetime.now(timezone.utc),
        created_by=user.id,
    )
    db.add(shipment)
    await db.flush()

    lines = []
    for ln in body.lines:
        sl = ShipmentLine(
            shipment_id=shipment.id,
            product_id=ln.product_id,
            quantity_shipped=ln.quantity_shipped,
        )
        db.add(sl)
        lines.append(sl)

    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="shipment",
        entity_id=shipment.id,
        action="create",
        payload={"display_code": display_code},
    )
    await db.commit()
    await db.refresh(shipment)

    return ShipmentResponse(
        id=shipment.id,
        display_code=shipment.display_code,
        client_id=shipment.client_id,
        site_id=shipment.site_id,
        ticket_id=shipment.ticket_id,
        kind=shipment.kind,
        occurred_at=shipment.occurred_at,
        lines=[
            ShipmentLineResponse(
                id=sl.id,
                product_id=sl.product_id,
                quantity_shipped=sl.quantity_shipped,
            )
            for sl in lines
        ],
    )


@router.get("", response_model=list[ShipmentResponse])
async def list_shipments(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    result = await db.execute(
        select(Shipment).order_by(Shipment.occurred_at.desc())
    )
    shipments = result.scalars().unique().all()
    out = []
    for s in shipments:
        lines_result = await db.execute(
            select(ShipmentLine).where(ShipmentLine.shipment_id == s.id)
        )
        out.append(
            ShipmentResponse(
                id=s.id,
                display_code=s.display_code,
                client_id=s.client_id,
                site_id=s.site_id,
                ticket_id=s.ticket_id,
                kind=s.kind,
                occurred_at=s.occurred_at,
                lines=lines_result.scalars().all(),
            )
        )
    return out


@router.get("/{shipment_id}", response_model=ShipmentResponse)
async def get_shipment(
    shipment_id: UUID,
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    shipment = await db.get(Shipment, shipment_id)
    if shipment is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Shipment not found")

    lines_result = await db.execute(
        select(ShipmentLine).where(ShipmentLine.shipment_id == shipment_id)
    )
    return ShipmentResponse(
        id=shipment.id,
        display_code=shipment.display_code,
        client_id=shipment.client_id,
        site_id=shipment.site_id,
        ticket_id=shipment.ticket_id,
        kind=shipment.kind,
        occurred_at=shipment.occurred_at,
        lines=lines_result.scalars().all(),
    )
