from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel


class DashboardKPI(BaseModel):
    active_rentals: int
    open_tickets: int
    pending_invoices: int
    overdue_amount: Decimal
