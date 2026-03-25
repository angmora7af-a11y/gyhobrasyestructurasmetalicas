from __future__ import annotations

from datetime import date, datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_audit
from app.core.database import get_db
from app.deps import get_current_user, require_role
from app.models.ar import ArReminderLog, PaymentEntry, SiigoInvoiceMirror
from app.models.auth import AppUser
from app.schemas.ar import (
    InvoiceMirrorCreate,
    InvoiceResponse,
    PaymentEntryCreate,
    PaymentEntryResponse,
)
from app.services.email import send_email

router = APIRouter(tags=["accounts-receivable"])


@router.get("/invoices", response_model=list[InvoiceResponse])
async def list_invoices(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    result = await db.execute(
        select(SiigoInvoiceMirror).order_by(SiigoInvoiceMirror.due_date)
    )
    return result.scalars().all()


@router.post(
    "/invoices",
    response_model=InvoiceResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_invoice(
    body: InvoiceMirrorCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "billing")),
):
    inv = SiigoInvoiceMirror(
        tenant_id=user.tenant_id,
        client_id=body.client_id,
        siigo_document_number=body.siigo_document_number,
        issue_date=body.issue_date,
        due_date=body.due_date,
        total_amount=body.total_amount,
        balance_amount=body.balance_amount,
        status=body.status,
    )
    db.add(inv)
    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="invoice_mirror",
        entity_id=inv.id,
        action="create",
    )
    await db.commit()
    await db.refresh(inv)
    return inv


@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: UUID,
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(get_current_user),
):
    inv = await db.get(SiigoInvoiceMirror, invoice_id)
    if inv is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invoice not found")
    return inv


@router.post(
    "/invoices/{invoice_id}/payments",
    response_model=PaymentEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_payment(
    invoice_id: UUID,
    body: PaymentEntryCreate,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "billing", "ar")),
):
    inv = await db.get(SiigoInvoiceMirror, invoice_id)
    if inv is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invoice not found")

    payment = PaymentEntry(
        invoice_id=invoice_id,
        channel=body.channel,
        reference=body.reference,
        amount=body.amount,
        paid_at=body.paid_at or datetime.now(timezone.utc),
        notes=body.notes,
    )
    db.add(payment)
    await db.flush()

    inv.balance_amount = inv.balance_amount - body.amount
    if inv.balance_amount <= 0:
        inv.balance_amount = 0
        inv.status = "paid"

    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="payment_entry",
        entity_id=payment.id,
        action="create",
        payload={"invoice_id": str(invoice_id), "amount": str(body.amount)},
    )
    await db.commit()
    await db.refresh(payment)
    return payment


@router.get("/ar/overdue", response_model=list[InvoiceResponse])
async def list_overdue(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(require_role("admin", "billing", "ar")),
):
    today = date.today()
    result = await db.execute(
        select(SiigoInvoiceMirror).where(
            SiigoInvoiceMirror.due_date < today,
            SiigoInvoiceMirror.status != "paid",
        )
    )
    return result.scalars().all()


@router.post("/ar/reminders/{invoice_id}", status_code=status.HTTP_201_CREATED)
async def send_reminder(
    invoice_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: AppUser = Depends(require_role("admin", "ar")),
):
    inv = await db.get(SiigoInvoiceMirror, invoice_id)
    if inv is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invoice not found")

    await send_email(
        to="client@example.com",
        subject=f"Payment Reminder — Invoice {inv.siigo_document_number}",
        body_html=(
            f"<p>Invoice <b>{inv.siigo_document_number}</b> is overdue. "
            f"Balance: <b>{inv.balance_amount}</b>.</p>"
        ),
    )

    log = ArReminderLog(
        invoice_id=invoice_id,
        sent_at=datetime.now(timezone.utc),
        channel="email",
        template_version="v1",
        status="sent",
    )
    db.add(log)
    await db.flush()
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="ar_reminder",
        entity_id=log.id,
        action="send",
    )
    await db.commit()
    return {"detail": "Reminder sent"}
