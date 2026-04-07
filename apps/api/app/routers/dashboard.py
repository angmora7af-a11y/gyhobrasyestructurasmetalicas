from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.deps import require_role
from app.models.ar import SiigoInvoiceMirror
from app.models.auth import AppUser
from app.models.shipment import Shipment
from app.models.ticket import Ticket
from app.schemas.dashboard import DashboardKPI, DashboardRecentTicket

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/kpis", response_model=DashboardKPI)
async def get_kpis(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(require_role("admin")),
):
    active_rentals_q = await db.execute(
        select(func.count(Shipment.id)).where(Shipment.kind == "rental")
    )
    active_rentals = active_rentals_q.scalar() or 0

    open_tickets_q = await db.execute(
        select(func.count(Ticket.id)).where(
            Ticket.status.in_(["received", "in_quotation", "quotation_sent"])
        )
    )
    open_tickets = open_tickets_q.scalar() or 0

    pending_invoices_q = await db.execute(
        select(func.count(SiigoInvoiceMirror.id)).where(
            SiigoInvoiceMirror.status != "paid"
        )
    )
    pending_invoices = pending_invoices_q.scalar() or 0

    today = date.today()
    overdue_q = await db.execute(
        select(func.coalesce(func.sum(SiigoInvoiceMirror.balance_amount), 0)).where(
            SiigoInvoiceMirror.due_date < today,
            SiigoInvoiceMirror.status != "paid",
        )
    )
    overdue_amount = overdue_q.scalar() or 0

    return DashboardKPI(
        active_rentals=active_rentals,
        open_tickets=open_tickets,
        pending_invoices=pending_invoices,
        overdue_amount=overdue_amount,
    )


@router.get("/recent-tickets", response_model=list[DashboardRecentTicket])
async def recent_tickets(
    db: AsyncSession = Depends(get_db),
    _user: AppUser = Depends(require_role("admin")),
):
    result = await db.execute(
        select(Ticket).order_by(Ticket.updated_at.desc()).limit(15)
    )
    rows = result.scalars().all()
    return [
        DashboardRecentTicket(
            id=str(t.id),
            reference=f"TKT-{str(t.id).replace('-', '')[:8].upper()}",
            status=t.status,
            updated_at=t.updated_at.isoformat(),
        )
        for t in rows
    ]
