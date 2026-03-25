from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_audit
from app.core.database import get_db
from app.deps import get_current_user, require_role
from app.models.auth import AppUser
from app.models.client import Client, ClientBranch, Site
from app.schemas.client import (
    BranchCreate,
    BranchResponse,
    ClientCreate,
    ClientResponse,
    SiteCreate,
    SiteResponse,
)

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=list[ClientResponse])
async def list_clients(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    result = await db.execute(select(Client).order_by(Client.legal_name))
    return result.scalars().all()


@router.post("", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(
    body: ClientCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin")),
):
    client = Client(
        tenant_id=user.tenant_id,
        nit=body.nit,
        legal_name=body.legal_name,
        remission_prefix=body.remission_prefix,
    )
    db.add(client)
    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="client",
        entity_id=client.id,
        action="create",
    )
    await db.commit()
    await db.refresh(client)
    return client


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: UUID,
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    client = await db.get(Client, client_id)
    if client is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Client not found")
    return client


@router.patch("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: UUID,
    body: ClientCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin")),
):
    client = await db.get(Client, client_id)
    if client is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Client not found")
    client.nit = body.nit
    client.legal_name = body.legal_name
    client.remission_prefix = body.remission_prefix
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="client",
        entity_id=client.id,
        action="update",
    )
    await db.commit()
    await db.refresh(client)
    return client


# --- Branches ---

@router.get("/{client_id}/branches", response_model=list[BranchResponse])
async def list_branches(
    client_id: UUID,
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    result = await db.execute(
        select(ClientBranch).where(ClientBranch.client_id == client_id)
    )
    return result.scalars().all()


@router.post(
    "/{client_id}/branches",
    response_model=BranchResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_branch(
    client_id: UUID,
    body: BranchCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin")),
):
    client = await db.get(Client, client_id)
    if client is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Client not found")

    branch = ClientBranch(
        client_id=client_id,
        suc_code=body.suc_code,
        name=body.name,
    )
    db.add(branch)
    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="client_branch",
        entity_id=branch.id,
        action="create",
    )
    await db.commit()
    await db.refresh(branch)
    return branch


# --- Sites ---

@router.get(
    "/{client_id}/branches/{branch_id}/sites",
    response_model=list[SiteResponse],
)
async def list_sites(
    client_id: UUID,
    branch_id: UUID,
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    result = await db.execute(
        select(Site).where(Site.client_branch_id == branch_id)
    )
    return result.scalars().all()


@router.post(
    "/{client_id}/branches/{branch_id}/sites",
    response_model=SiteResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_site(
    client_id: UUID,
    branch_id: UUID,
    body: SiteCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin")),
):
    branch = await db.get(ClientBranch, branch_id)
    if branch is None or branch.client_id != client_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Branch not found")

    site = Site(
        client_branch_id=branch_id,
        name=body.name,
        address=body.address,
        contact_name=body.contact_name,
        contact_phone=body.contact_phone,
    )
    db.add(site)
    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="site",
        entity_id=site.id,
        action="create",
    )
    await db.commit()
    await db.refresh(site)
    return site
