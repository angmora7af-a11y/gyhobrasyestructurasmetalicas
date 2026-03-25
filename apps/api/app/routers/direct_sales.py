from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_audit
from app.core.database import get_db
from app.deps import get_current_user, require_role
from app.models.auth import AppUser
from app.models.direct_sale import DirectSale, DirectSaleLine
from app.schemas.shipment import (
    DirectSaleCreate,
    DirectSaleLineResponse,
    DirectSaleResponse,
)

router = APIRouter(prefix="/direct-sales", tags=["direct-sales"])


@router.get("", response_model=list[DirectSaleResponse])
async def list_direct_sales(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    result = await db.execute(
        select(DirectSale).order_by(DirectSale.created_at.desc())
    )
    sales = result.scalars().unique().all()
    out = []
    for s in sales:
        lines_result = await db.execute(
            select(DirectSaleLine).where(DirectSaleLine.direct_sale_id == s.id)
        )
        out.append(
            DirectSaleResponse(
                id=s.id,
                client_id=s.client_id,
                internal_reference=s.internal_reference,
                created_at=s.created_at,
                lines=lines_result.scalars().all(),
            )
        )
    return out


@router.post(
    "",
    response_model=DirectSaleResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_direct_sale(
    body: DirectSaleCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "logistics")),
):
    sale = DirectSale(
        tenant_id=user.tenant_id,
        client_id=body.client_id,
        site_id=body.site_id,
        internal_reference=body.internal_reference,
        created_by=user.id,
    )
    db.add(sale)
    await db.flush()

    lines = []
    for ln in body.lines:
        line = DirectSaleLine(
            direct_sale_id=sale.id,
            product_id=ln.product_id,
            quantity=ln.quantity,
            unit_price=ln.unit_price,
        )
        db.add(line)
        lines.append(line)

    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="direct_sale",
        entity_id=sale.id,
        action="create",
    )
    await db.commit()
    await db.refresh(sale)

    return DirectSaleResponse(
        id=sale.id,
        client_id=sale.client_id,
        internal_reference=sale.internal_reference,
        created_at=sale.created_at,
        lines=[
            DirectSaleLineResponse(
                id=l.id,
                product_id=l.product_id,
                quantity=l.quantity,
                unit_price=l.unit_price,
            )
            for l in lines
        ],
    )


@router.get("/{sale_id}", response_model=DirectSaleResponse)
async def get_direct_sale(
    sale_id: UUID,
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    sale = await db.get(DirectSale, sale_id)
    if sale is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Direct sale not found")

    lines_result = await db.execute(
        select(DirectSaleLine).where(DirectSaleLine.direct_sale_id == sale_id)
    )
    return DirectSaleResponse(
        id=sale.id,
        client_id=sale.client_id,
        internal_reference=sale.internal_reference,
        created_at=sale.created_at,
        lines=lines_result.scalars().all(),
    )


@router.delete("/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_direct_sale(
    sale_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin")),
):
    sale = await db.get(DirectSale, sale_id)
    if sale is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Direct sale not found")

    await db.delete(sale)
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="direct_sale",
        entity_id=sale.id,
        action="delete",
    )
    await db.commit()
