from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_audit
from app.core.database import get_db
from app.deps import get_current_user, require_role
from app.models.auth import AppUser
from app.models.ticket import Ticket, TicketAttachment, TicketComment, TicketLine
from app.schemas.ticket import (
    TICKET_TRANSITIONS,
    CommentCreate,
    TicketCreate,
    TicketResponse,
    TicketStatusUpdate,
)
from app.services.email import send_email

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get("", response_model=list[TicketResponse])
async def list_tickets(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    result = await db.execute(
        select(Ticket).order_by(Ticket.created_at.desc())
    )
    tickets = result.scalars().unique().all()
    out = []
    for t in tickets:
        lines_result = await db.execute(
            select(TicketLine).where(TicketLine.ticket_id == t.id)
        )
        lines = lines_result.scalars().all()
        out.append(
            TicketResponse(
                id=t.id,
                client_id=t.client_id,
                site_id=t.site_id,
                status=t.status,
                requested_on=t.requested_on,
                first_response_at=t.first_response_at,
                quotation_sent_at=t.quotation_sent_at,
                created_at=t.created_at,
                lines=lines,
            )
        )
    return out


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    body: TicketCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(get_current_user),
):
    ticket = Ticket(
        tenant_id=user.tenant_id,
        client_id=body.client_id,
        site_id=body.site_id,
        requested_on=body.requested_on,
        status="received",
    )
    db.add(ticket)
    await db.flush()

    lines = []
    for ln in body.lines:
        line = TicketLine(
            ticket_id=ticket.id,
            product_id=ln.product_id,
            quantity=ln.quantity,
        )
        db.add(line)
        lines.append(line)

    if body.comment:
        db.add(TicketComment(ticket_id=ticket.id, user_id=user.id, body=body.comment))

    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="ticket",
        entity_id=ticket.id,
        action="create",
    )
    await db.commit()
    await db.refresh(ticket)

    return TicketResponse(
        id=ticket.id,
        client_id=ticket.client_id,
        site_id=ticket.site_id,
        status=ticket.status,
        requested_on=ticket.requested_on,
        first_response_at=ticket.first_response_at,
        quotation_sent_at=ticket.quotation_sent_at,
        created_at=ticket.created_at,
        lines=lines,
    )


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: UUID,
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    ticket = await db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Ticket not found")
    lines_result = await db.execute(
        select(TicketLine).where(TicketLine.ticket_id == ticket_id)
    )
    return TicketResponse(
        id=ticket.id,
        client_id=ticket.client_id,
        site_id=ticket.site_id,
        status=ticket.status,
        requested_on=ticket.requested_on,
        first_response_at=ticket.first_response_at,
        quotation_sent_at=ticket.quotation_sent_at,
        created_at=ticket.created_at,
        lines=lines_result.scalars().all(),
    )


@router.patch("/{ticket_id}/status", response_model=TicketResponse)
async def update_ticket_status(
    ticket_id: UUID,
    body: TicketStatusUpdate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "logistics")),
):
    ticket = await db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Ticket not found")

    allowed = TICKET_TRANSITIONS.get(ticket.status, set())
    if body.status not in allowed:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"Cannot transition from '{ticket.status}' to '{body.status}'",
        )

    now = datetime.now(timezone.utc)
    old_status = ticket.status

    if old_status == "received" and ticket.first_response_at is None:
        ticket.first_response_at = now

    if body.status == "quotation_sent":
        ticket.quotation_sent_at = now

    ticket.status = body.status

    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="ticket",
        entity_id=ticket.id,
        action="status_change",
        payload={"from": old_status, "to": body.status},
    )
    await db.commit()
    await db.refresh(ticket)

    await send_email(
        to="notifications@gyh.co",
        subject=f"Ticket {ticket.id} status → {body.status}",
        body_html=f"<p>Ticket moved from <b>{old_status}</b> to <b>{body.status}</b>.</p>",
    )

    lines_result = await db.execute(
        select(TicketLine).where(TicketLine.ticket_id == ticket_id)
    )
    return TicketResponse(
        id=ticket.id,
        client_id=ticket.client_id,
        site_id=ticket.site_id,
        status=ticket.status,
        requested_on=ticket.requested_on,
        first_response_at=ticket.first_response_at,
        quotation_sent_at=ticket.quotation_sent_at,
        created_at=ticket.created_at,
        lines=lines_result.scalars().all(),
    )


@router.post("/{ticket_id}/comments", status_code=status.HTTP_201_CREATED)
async def add_comment(
    ticket_id: UUID,
    body: CommentCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(get_current_user),
):
    ticket = await db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Ticket not found")

    comment = TicketComment(ticket_id=ticket_id, user_id=user.id, body=body.body)
    db.add(comment)
    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="ticket_comment",
        entity_id=comment.id,
        action="create",
    )
    await db.commit()
    return {"id": str(comment.id), "body": comment.body}


@router.post("/{ticket_id}/attachments", status_code=status.HTTP_201_CREATED)
async def upload_attachment(
    ticket_id: UUID,
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(get_current_user),
):
    ticket = await db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Ticket not found")

    contents = await file.read()
    att = TicketAttachment(
        ticket_id=ticket_id,
        file_name=file.filename or "attachment",
        file_blob=contents,
        uploaded_by=user.id,
    )
    db.add(att)
    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="ticket_attachment",
        entity_id=att.id,
        action="upload",
    )
    await db.commit()
    return {"id": str(att.id), "file_name": att.file_name}
