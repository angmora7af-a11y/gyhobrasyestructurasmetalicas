"""
Seed data for integration tests — one user per role + dummy domain objects.

Usage:
  - Imported by conftest.py to populate a clean test DB.
  - Also runnable standalone:  python -m tests.seed  (seeds the real DB from .env)

Passwords are all "Test1234!" for every user.
"""
from __future__ import annotations

from datetime import date, datetime, timezone
from decimal import Decimal
from uuid import uuid4

from app.core.security import hash_password
from app.models.ar import SiigoInvoiceMirror
from app.models.auth import AppUser, Role, UserRole
from app.models.catalog import Product, Warehouse
from app.models.client import Client, ClientBranch, Site
from app.models.credit import CreditApplication
from app.models.tenant import Tenant
from app.models.ticket import Ticket, TicketLine

DEFAULT_PASSWORD = "Test1234!"
HASHED_PASSWORD = hash_password(DEFAULT_PASSWORD)

TENANT_ID = uuid4()

ROLE_DEFS = [
    ("admin", "Administrador"),
    ("client", "Cliente"),
    ("catalog_contributor", "Aportante catálogo"),
    ("logistics", "Logística"),
    ("billing", "Facturación"),
    ("ar", "Cartera"),
    ("credit", "Crédito"),
]

ROLE_IDS: dict[str, object] = {}
USER_IDS: dict[str, object] = {}

WAREHOUSE_ID = uuid4()
PRODUCT_IDS: list[object] = []
CLIENT_ID = uuid4()
BRANCH_ID = uuid4()
SITE_ID = uuid4()
CREDIT_APP_ID = uuid4()
TICKET_ID = uuid4()
INVOICE_ID = uuid4()


def build_tenant() -> Tenant:
    return Tenant(
        id=TENANT_ID,
        code="BOG",
        name="G&H Obras Bogotá",
        city_code="BOG",
    )


def build_roles() -> list[Role]:
    roles = []
    for code, name in ROLE_DEFS:
        rid = uuid4()
        ROLE_IDS[code] = rid
        roles.append(Role(id=rid, code=code, name=name))
    return roles


def build_users() -> tuple[list[AppUser], list[UserRole]]:
    users = []
    user_roles = []
    for code, label in ROLE_DEFS:
        uid = uuid4()
        USER_IDS[code] = uid
        users.append(
            AppUser(
                id=uid,
                tenant_id=TENANT_ID,
                email=f"{code}@gyhobras.com",
                password_hash=HASHED_PASSWORD,
                full_name=f"Test {label}",
                is_active=True,
            )
        )
        user_roles.append(UserRole(user_id=uid, role_id=ROLE_IDS[code]))
    return users, user_roles


def build_warehouse() -> Warehouse:
    return Warehouse(
        id=WAREHOUSE_ID,
        tenant_id=TENANT_ID,
        code="BDG01",
        name="Bodega Principal Engativá",
    )


def build_products() -> list[Product]:
    items = [
        ("ALQ-001", "Andamio tubular 1.5m", "Andamios", True, False, Decimal("45000"), None),
        ("ALQ-002", "Formaleta metálica 60×120", "Formaletas", True, False, Decimal("32000"), None),
        ("VTA-001", "Abrazadera andamio galvanizada", "Accesorios", False, True, None, Decimal("8500")),
        ("MIX-001", "Pluma grúa 500 kg", "Maquinaria", True, True, Decimal("180000"), Decimal("12500000")),
    ]
    products = []
    for sku, desc, cat, rent, sale, rpd, sp in items:
        pid = uuid4()
        PRODUCT_IDS.append(pid)
        products.append(
            Product(
                id=pid,
                tenant_id=TENANT_ID,
                sku_code=sku,
                description=desc,
                category=cat,
                rental_enabled=rent,
                sale_enabled=sale,
                rental_price_per_day=rpd,
                sale_price=sp,
            )
        )
    return products


def build_client() -> tuple[Client, ClientBranch, Site]:
    client = Client(
        id=CLIENT_ID,
        tenant_id=TENANT_ID,
        nit="900123456-1",
        legal_name="Constructora El Dorado SAS",
        remission_prefix="ELDO",
    )
    branch = ClientBranch(
        id=BRANCH_ID,
        client_id=CLIENT_ID,
        suc_code="SUC01",
        name="Sede Norte",
    )
    site = Site(
        id=SITE_ID,
        client_branch_id=BRANCH_ID,
        name="Obra Calle 170",
        address="Calle 170 #45-30, Bogotá",
        contact_name="Ing. Pérez",
        contact_phone="3101234567",
    )
    return client, branch, site


def build_credit() -> CreditApplication:
    return CreditApplication(
        id=CREDIT_APP_ID,
        tenant_id=TENANT_ID,
        client_id=CLIENT_ID,
        status="approved",
        notes="Aprobado cupo 50M",
        blocks_shipment=False,
    )


def build_ticket() -> tuple[Ticket, list[TicketLine]]:
    ticket = Ticket(
        id=TICKET_ID,
        tenant_id=TENANT_ID,
        client_id=CLIENT_ID,
        site_id=SITE_ID,
        status="received",
        requested_on=date(2026, 4, 1),
    )
    lines = [
        TicketLine(ticket_id=TICKET_ID, product_id=PRODUCT_IDS[0], quantity=Decimal("10")),
        TicketLine(ticket_id=TICKET_ID, product_id=PRODUCT_IDS[1], quantity=Decimal("20")),
    ]
    return ticket, lines


def build_invoice() -> SiigoInvoiceMirror:
    return SiigoInvoiceMirror(
        id=INVOICE_ID,
        tenant_id=TENANT_ID,
        client_id=CLIENT_ID,
        siigo_document_number="FV-0001",
        issue_date=date(2026, 3, 1),
        due_date=date(2026, 4, 1),
        total_amount=Decimal("5000000"),
        balance_amount=Decimal("5000000"),
        status="pending",
        last_synced_at=datetime.now(timezone.utc),
    )


def collect_all_objects() -> list:
    """Return all seed objects in FK-safe insertion order."""
    tenant = build_tenant()
    roles = build_roles()
    users, user_roles = build_users()
    warehouse = build_warehouse()
    products = build_products()
    client, branch, site = build_client()
    credit = build_credit()
    ticket, ticket_lines = build_ticket()
    invoice = build_invoice()

    return [
        tenant,
        *roles,
        *users,
        *user_roles,
        warehouse,
        *products,
        client,
        branch,
        site,
        credit,
        ticket,
        *ticket_lines,
        invoice,
    ]


# ---------------------------------------------------------------------------
# Standalone runner: `python -m tests.seed`
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import asyncio

    from sqlalchemy.ext.asyncio import AsyncSession

    from app.core.database import async_session_factory, create_all_tables

    async def main() -> None:
        print("Creating tables …")
        await create_all_tables()
        print("Seeding …")
        async with async_session_factory() as session:
            session: AsyncSession
            for obj in collect_all_objects():
                session.add(obj)
            await session.commit()
        print(f"Done — {len(ROLE_DEFS)} roles, {len(ROLE_DEFS)} users, 4 products, 1 client, 1 ticket, 1 invoice.")
        print(f"\nLogin credentials (all passwords: {DEFAULT_PASSWORD}):")
        for code, label in ROLE_DEFS:
            print(f"  {code}@gyhobras.com  ({label})")

    asyncio.run(main())
