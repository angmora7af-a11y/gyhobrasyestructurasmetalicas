from __future__ import annotations

import csv
import io
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_audit
from app.core.database import get_db
from app.deps import get_current_user, require_role
from app.models.auth import AppUser
from app.models.billing import BillingDraft, BillingDraftLine
from app.schemas.billing import BillingDraftCreate, BillingDraftResponse

router = APIRouter(prefix="/billing-drafts", tags=["billing"])


@router.get("", response_model=list[BillingDraftResponse])
async def list_billing_drafts(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    result = await db.execute(
        select(BillingDraft).order_by(BillingDraft.created_at.desc())
    )
    drafts = result.scalars().unique().all()
    out = []
    for d in drafts:
        lines_result = await db.execute(
            select(BillingDraftLine).where(BillingDraftLine.draft_id == d.id)
        )
        out.append(
            BillingDraftResponse(
                id=d.id,
                client_id=d.client_id,
                period_start=d.period_start,
                period_end=d.period_end,
                status=d.status,
                created_at=d.created_at,
                lines=lines_result.scalars().all(),
            )
        )
    return out


@router.post(
    "",
    response_model=BillingDraftResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_billing_draft(
    body: BillingDraftCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "billing")),
):
    draft = BillingDraft(
        tenant_id=user.tenant_id,
        client_id=body.client_id,
        period_start=body.period_start,
        period_end=body.period_end,
        status="draft",
    )
    db.add(draft)
    await db.flush()

    lines = []
    for ln in body.lines:
        line = BillingDraftLine(
            draft_id=draft.id,
            product_id=ln.product_id,
            description=ln.description,
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
        entity_type="billing_draft",
        entity_id=draft.id,
        action="create",
    )
    await db.commit()
    await db.refresh(draft)

    return BillingDraftResponse(
        id=draft.id,
        client_id=draft.client_id,
        period_start=draft.period_start,
        period_end=draft.period_end,
        status=draft.status,
        created_at=draft.created_at,
        lines=lines,
    )


@router.get("/{draft_id}", response_model=BillingDraftResponse)
async def get_billing_draft(
    draft_id: UUID,
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    draft = await db.get(BillingDraft, draft_id)
    if draft is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Billing draft not found")

    lines_result = await db.execute(
        select(BillingDraftLine).where(BillingDraftLine.draft_id == draft_id)
    )
    return BillingDraftResponse(
        id=draft.id,
        client_id=draft.client_id,
        period_start=draft.period_start,
        period_end=draft.period_end,
        status=draft.status,
        created_at=draft.created_at,
        lines=lines_result.scalars().all(),
    )


@router.post("/{draft_id}/approve-client", response_model=BillingDraftResponse)
async def approve_billing_draft(
    draft_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "billing")),
):
    draft = await db.get(BillingDraft, draft_id)
    if draft is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Billing draft not found")
    if draft.status != "draft":
        raise HTTPException(
            status.HTTP_409_CONFLICT, f"Draft is already {draft.status}"
        )

    draft.status = "approved"
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="billing_draft",
        entity_id=draft.id,
        action="approve",
    )
    await db.commit()
    await db.refresh(draft)

    lines_result = await db.execute(
        select(BillingDraftLine).where(BillingDraftLine.draft_id == draft_id)
    )
    return BillingDraftResponse(
        id=draft.id,
        client_id=draft.client_id,
        period_start=draft.period_start,
        period_end=draft.period_end,
        status=draft.status,
        created_at=draft.created_at,
        lines=lines_result.scalars().all(),
    )


@router.post("/export")
async def export_billing_drafts(
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "billing")),
):
    result = await db.execute(
        select(BillingDraft).where(BillingDraft.status == "approved")
    )
    drafts = result.scalars().all()

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["id", "client_id", "period_start", "period_end", "status", "created_at"])
    for d in drafts:
        writer.writerow([
            str(d.id),
            str(d.client_id),
            str(d.period_start),
            str(d.period_end),
            d.status,
            str(d.created_at),
        ])

    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=billing_drafts.csv"},
    )
