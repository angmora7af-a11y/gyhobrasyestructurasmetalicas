from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_audit
from app.core.database import get_db
from app.deps import get_current_user, require_role
from app.models.auth import AppUser
from app.models.credit import CreditApplication, CreditApplicationFile
from app.schemas.credit import (
    CreditApplicationCreate,
    CreditApplicationResponse,
    CreditApplicationUpdate,
)

router = APIRouter(prefix="/credit-applications", tags=["credit"])


@router.get("", response_model=list[CreditApplicationResponse])
async def list_credit_applications(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    result = await db.execute(
        select(CreditApplication).order_by(CreditApplication.created_at.desc())
    )
    return result.scalars().all()


@router.post(
    "",
    response_model=CreditApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_credit_application(
    body: CreditApplicationCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "credit")),
):
    app = CreditApplication(
        tenant_id=user.tenant_id,
        client_id=body.client_id,
        status="in_review",
        notes=body.notes,
        blocks_shipment=body.blocks_shipment,
    )
    db.add(app)
    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="credit_application",
        entity_id=app.id,
        action="create",
    )
    await db.commit()
    await db.refresh(app)
    return app


@router.get("/{app_id}", response_model=CreditApplicationResponse)
async def get_credit_application(
    app_id: UUID,
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    ca = await db.get(CreditApplication, app_id)
    if ca is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Credit application not found")
    return ca


@router.patch("/{app_id}", response_model=CreditApplicationResponse)
async def update_credit_application(
    app_id: UUID,
    body: CreditApplicationUpdate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "credit")),
):
    ca = await db.get(CreditApplication, app_id)
    if ca is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Credit application not found")

    old_status = ca.status
    ca.status = body.status
    if body.notes is not None:
        ca.notes = body.notes

    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="credit_application",
        entity_id=ca.id,
        action="status_change",
        payload={"from": old_status, "to": body.status},
    )
    await db.commit()
    await db.refresh(ca)
    return ca


@router.post("/{app_id}/files", status_code=status.HTTP_201_CREATED)
async def upload_credit_file(
    app_id: UUID,
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "credit")),
):
    ca = await db.get(CreditApplication, app_id)
    if ca is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Credit application not found")

    contents = await file.read()
    cf = CreditApplicationFile(
        application_id=app_id,
        file_name=file.filename or "attachment",
        file_blob=contents,
    )
    db.add(cf)
    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="credit_application_file",
        entity_id=cf.id,
        action="upload",
    )
    await db.commit()
    return {"id": str(cf.id), "file_name": cf.file_name}
