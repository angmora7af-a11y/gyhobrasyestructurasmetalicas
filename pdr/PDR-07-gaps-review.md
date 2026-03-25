# PDR-07 — Revisión de incongruencias, vacíos y ambigüedades

**Actualizado con `call2.txt`.** Resuelve varias tensiones previas del `call.txt` original.

---

## 1. Resoluciones (ya no son bloqueantes)

### 1.1 Facturación electrónica

| Estado | Detalle |
|--------|---------|
| **Resuelto** | **Toda CPE va por Siigo**; el sistema nuevo no es emisor de factura electrónica (`call2.txt`). La plataforma refuerza **cobro y cartera** alineados a Siigo. |

### 1.2 Precio alquiler por hora vs día

| Estado | Detalle |
|--------|---------|
| **Resuelto** | **Solo por día** (`call2.txt`). |

### 1.3 Devoluciones y corte

| Estado | Detalle |
|--------|---------|
| **Resuelto para MVP** | **No** hay módulo de devoluciones en el alcance actual. **Tensión** con `BUSSINESS_CASE.md` (corte por devolución): se gestiona en **Siigo / proceso manual** hasta la fase que reactive devoluciones en app. |

### 1.4 Transporte, daños, repuestos

| Estado | Detalle |
|--------|---------|
| **Resuelto** | **Fuera del sistema** (`call2.txt`). |

### 1.5 WhatsApp

| Estado | Detalle |
|--------|---------|
| **Resuelto** | **Opcional**; no implementación directa en MVP. |

### 1.6 Catálogo e imágenes

| Estado | Detalle |
|--------|---------|
| **Resuelto** | **Sin imágenes** en MVP; datos de producto + precio + uso opcional (`call2.txt`). |

### 1.7 Numeración remisiones

| Estado | Detalle |
|--------|---------|
| **Resuelto** | Código con **trazabilidad**: siglas alfanuméricas ligadas al **cliente** + **timestamp** (`call2.txt`). |

---

## 2. Incongruencias que persisten

### 2.1 `BUSSINESS_CASE.md` vs MVP sin devoluciones

El caso de negocio describe **remisión → obra → devolución → liquidación de días → factura**. El MVP **omite devoluciones** en la aplicación.

**Mitigación:** documentar en operación que **liquidación por periodos** y **corte** siguen apoyadas en **Siigo** y trabajo **manual** hasta el siguiente hito; o importar movimientos históricos.

### 2.2 `WEB_PAGE.md` (scraping)

Sigue siendo **otra línea de producto** salvo unificación explícita.

### 2.3 PR-DE-001 en `INDEX.md`

Sigue **no** siendo fuente de requisitos hasta corrección.

---

## 3. Vacíos restantes

- **Integración Siigo:** modo exacto (API vs archivo), frecuencia, mapeo de facturas a cartera.
- **Regla de saldo** sin devoluciones en app: fórmula aceptada por negocio (solo remisiones + ventas vs. conciliación manual).
- **Multi-ciudad:** ¿misma imagen Docker y solo cambia `.env`, o clusters separados?
- **Formato exacto** del código remisión (longitud siglas, zona horaria timestamp).

---

## 4. Ambigüedades menores

- **Canales de recolección** de pago: cuáles son (transferencia, link, carga de soporte).
- **“Proveedor”** de carga masiva: si es rol interno o externo (no bloqueado por `call2`).

---

## 5. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Expectativa de kardex idéntico al PDF histórico con devoluciones | Comunicar limitación MVP; export con columnas en cero o datos importados |
| Alcance creep | Checklist contra `call2.txt` en cada sprint |

---

*Actualizar tras definir integración Siigo y fase de devoluciones.*
