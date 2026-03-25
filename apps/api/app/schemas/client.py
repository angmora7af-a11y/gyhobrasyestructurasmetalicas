from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel


class ClientCreate(BaseModel):
    nit: str
    legal_name: str
    remission_prefix: str


class ClientResponse(BaseModel):
    id: UUID
    nit: str
    legal_name: str
    remission_prefix: str
    is_active: bool

    model_config = {"from_attributes": True}


class BranchCreate(BaseModel):
    suc_code: str
    name: str


class BranchResponse(BaseModel):
    id: UUID
    suc_code: str
    name: str

    model_config = {"from_attributes": True}


class SiteCreate(BaseModel):
    name: str
    address: str | None = None
    contact_name: str | None = None
    contact_phone: str | None = None


class SiteResponse(BaseModel):
    id: UUID
    name: str
    address: str | None
    contact_name: str | None
    contact_phone: str | None

    model_config = {"from_attributes": True}
