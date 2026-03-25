from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_audit
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.deps import get_current_user
from app.models.auth import AppUser, PasswordResetToken, RefreshToken, Role, UserRole
from app.schemas.auth import (
    LoginRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    TokenResponse,
    UserResponse,
)
from app.services.email import send_email

router = APIRouter(prefix="/auth", tags=["auth"])


async def _get_user_roles(db: AsyncSession, user_id: UUID) -> list[str]:
    result = await db.execute(
        select(Role.code)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == user_id)
    )
    return [row[0] for row in result.all()]


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AppUser).where(AppUser.email == body.email))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")

    if user.locked_until and user.locked_until > datetime.now(timezone.utc):
        raise HTTPException(status.HTTP_423_LOCKED, "Account temporarily locked")

    if not verify_password(body.password, user.password_hash):
        user.failed_login_count = (user.failed_login_count or 0) + 1
        if user.failed_login_count >= settings.MAX_LOGIN_ATTEMPTS:
            user.locked_until = datetime.now(timezone.utc) + timedelta(
                minutes=settings.LOCKOUT_MINUTES
            )
        await db.commit()
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")

    user.failed_login_count = 0
    user.locked_until = None
    await db.commit()

    token_data = {"sub": str(user.id)}
    access = create_access_token(token_data)
    refresh = create_refresh_token(token_data)

    refresh_expires = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(user_id=user.id, token_hash=refresh, expires_at=refresh_expires))
    await db.commit()

    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="auth",
        action="login",
    )
    await db.commit()

    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_token: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = decode_token(refresh_token)
    except ValueError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token type")

    user_id = payload.get("sub")
    user = await db.get(AppUser, UUID(user_id))
    if user is None or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found or inactive")

    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.token_hash == refresh_token)
        .values(revoked_at=datetime.now(timezone.utc))
    )

    token_data = {"sub": str(user.id)}
    new_access = create_access_token(token_data)
    new_refresh = create_refresh_token(token_data)

    new_refresh_expires = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(user_id=user.id, token_hash=new_refresh, expires_at=new_refresh_expires))
    await db.commit()

    return TokenResponse(access_token=new_access, refresh_token=new_refresh)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    user: AppUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == user.id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=datetime.now(timezone.utc))
    )
    await log_audit(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        entity_type="auth",
        action="logout",
    )
    await db.commit()


@router.post("/password-reset/request", status_code=status.HTTP_202_ACCEPTED)
async def request_password_reset(
    body: PasswordResetRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(AppUser).where(AppUser.email == body.email))
    user = result.scalar_one_or_none()
    if user is None:
        return {"detail": "If the email exists, a reset link has been sent"}

    token = secrets.token_urlsafe(48)
    expires = datetime.now(timezone.utc) + timedelta(hours=1)
    db.add(PasswordResetToken(user_id=user.id, token_hash=token, expires_at=expires))
    await db.commit()

    await send_email(
        to=user.email,
        subject="Password Reset — G&H Obras",
        body_html=f"<p>Your reset token: <strong>{token}</strong></p><p>Expires in 1 hour.</p>",
    )
    return {"detail": "If the email exists, a reset link has been sent"}


@router.post("/password-reset/confirm", status_code=status.HTTP_200_OK)
async def confirm_password_reset(
    body: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token_hash == body.token,
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at > datetime.now(timezone.utc),
        )
    )
    prt = result.scalar_one_or_none()
    if prt is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired token")

    user = await db.get(AppUser, prt.user_id)
    if user is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid token")

    user.password_hash = hash_password(body.new_password)
    prt.used_at = datetime.now(timezone.utc)
    await db.commit()

    return {"detail": "Password updated"}


@router.get("/me", response_model=UserResponse)
async def me(
    user: AppUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roles = await _get_user_roles(db, user.id)
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        roles=roles,
        is_active=user.is_active,
    )
