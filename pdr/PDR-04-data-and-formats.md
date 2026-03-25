# PDR-04 — Datos, formatos y correspondencia con `INDEX.md`

**Validación `call2.txt`:** catálogo **sin imágenes**; precio alquiler **por día**; **sin devoluciones** en MVP; exclusión transporte/daños/repuestos.

---

## 1. Entidades principales (modelo lógico — MVP)

- **Cliente:** NIT, razón social, sucursales (SUC); **siglas** opcionales para componer código de remisión.
- **Obra / proyecto:** cliente, dirección, contacto.
- **Producto (Alforequipos):** código, descripción, tipo alquiler/venta directa, **precio día** (alquiler), precio venta; **uso** u observaciones texto; **sin imagen** en MVP.
- **Ubicación / bodega:** códigos como en referencias `INDEX`.
- **Movimiento (MVP):** tipos **envío (remisión)** y **venta directa**; **no** movimiento devolución en aplicación.
- **Remisión:** identificador interno + **código visible** = f(cliente siglas + timestamp) + metadatos de trazabilidad.
- **Factura (CPE):** siempre referencia **Siigo**; cartera en plataforma es **espejo operativo** de cobro.
- **Documento comercial:** proforma/insumo interno; **no** CPE propia.

---

## 2. Formato “Movimiento detallado de obra” (`INACAR.xlsx`)

Columnas de referencia para **export compatible**:

| Campo | MVP |
|-------|-----|
| REMISION | Sí |
| DEVOLUCION | **0 o vacío** en sistema; o datos **históricos importados** si existen |
| CAN-DEVOL | **0** salvo legado |
| SALDO | Definir regla: **solo saldos derivados de remisiones/ventas** hasta activar devoluciones |

---

## 3. Formato “Listado kardex de clientes” (`CONSTRUCTORES.pdf`)

- Útil como **vista objetivo** para conciliación con cliente.
- En MVP sin devoluciones en app, las columnas de **devolución** pueden **no alimentarse** desde la plataforma o quedar en **cero**; la **fecha de corte** por devolución puede seguir en **Siigo** / proceso manual hasta la siguiente fase.

---

## 4. Inventario producto terminado (`PRODUCTO TERMINADO...xlsx`)

Sin cambio estructural; priorizar coherencia con **códigos** y **bodegas**.

---

## 5. ML-FA-001 (vía `INDEX.md`)

- Temas de **transporte, daños, reposición** indicados en el manual completo **no** se gestionan en sistema en esta fase (`call2.txt`).
- **Remisiones** y documentación de soporte a facturación siguen siendo referencia de proceso; la **FE** se registra en **Siigo**.

---

## 6. Migración Excel (`call2.txt`)

- Plantilla acordada: columnas mínimas alineadas a FR-010/011.
- **Endpoints globales** API documentados para cargas iniciales y lotes.

---

## 7. Inconsistencia documental

**PR-DE-001** sigue sin ser fuente de requisitos logísticos hasta corrección (`INDEX.md`).

---

*Actualizar este documento al activar módulo de devoluciones.*
