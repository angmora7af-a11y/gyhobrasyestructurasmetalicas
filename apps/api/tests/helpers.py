"""Test helper utilities — login as any seeded role and get a token."""
from __future__ import annotations

from httpx import AsyncClient

from tests.seed import DEFAULT_PASSWORD


async def login_as(client: AsyncClient, role: str) -> str:
    """Login with a seeded user and return the access_token."""
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": f"{role}@gyhobras.com", "password": DEFAULT_PASSWORD},
    )
    assert resp.status_code == 200, f"Login failed for {role}: {resp.text}"
    return resp.json()["access_token"]


def auth_header(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}
