from __future__ import annotations

import logging
from email.mime.text import MIMEText

import aiosmtplib

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(to: str, subject: str, body_html: str) -> None:
    if not settings.SMTP_HOST:
        logger.info("SMTP not configured — email stub: to=%s subject=%s", to, subject)
        logger.debug("Body: %s", body_html)
        return

    msg = MIMEText(body_html, "html")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_USER
    msg["To"] = to

    await aiosmtplib.send(
        msg,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USER,
        password=settings.SMTP_PASSWORD,
        start_tls=True,
    )
