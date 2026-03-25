from __future__ import annotations

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog


async def log_audit(
    db: AsyncSession,
    *,
    tenant_id: UUID,
    user_id: UUID,
    entity_type: str,
    entity_id: UUID | int | None = None,
    action: str,
    payload: dict | None = None,
) -> AuditLog:
    kwargs: dict = {
        "tenant_id": tenant_id,
        "user_id": user_id,
        "entity_type": entity_type,
        "action": action,
        "payload_json": payload,
    }

    if isinstance(entity_id, int):
        kwargs["entity_id_bigint"] = entity_id
    elif entity_id is not None:
        kwargs["entity_id"] = entity_id

    entry = AuditLog(**kwargs)
    db.add(entry)
    await db.flush()
    return entry
