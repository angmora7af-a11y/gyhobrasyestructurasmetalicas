from __future__ import annotations

import io
from typing import Any

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.platypus.paragraph import Paragraph
from reportlab.lib.styles import getSampleStyleSheet


def generate_shipment_pdf(
    shipment: Any,
    lines: list[Any],
    client: Any,
) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=letter)
    styles = getSampleStyleSheet()
    elements: list[Any] = []

    elements.append(Paragraph("G&H Obras y Estructuras Metálicas", styles["Title"]))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(f"Remisión: {shipment.display_code}", styles["Heading2"]))
    elements.append(Paragraph(f"Cliente: {client.legal_name} — NIT {client.nit}", styles["Normal"]))
    elements.append(Paragraph(f"Fecha: {shipment.occurred_at:%Y-%m-%d %H:%M}", styles["Normal"]))
    elements.append(Spacer(1, 0.3 * inch))

    table_data = [["#", "Producto ID", "Cantidad"]]
    for idx, ln in enumerate(lines, 1):
        table_data.append([str(idx), str(ln.product_id), str(ln.quantity_shipped)])

    table = Table(table_data, colWidths=[0.5 * inch, 4 * inch, 1.5 * inch])
    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a1a2e")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
        ])
    )
    elements.append(table)

    doc.build(elements)
    return buf.getvalue()
