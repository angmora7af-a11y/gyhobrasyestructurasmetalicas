# Índice de `docs_reference/`

Este documento resume qué contiene cada archivo en `docs_reference/`, para qué sirve y cómo utilizarlo en el contexto del proyecto (alquiler de equipos, integración con Siigo y operación de facturación).

---

## Documentos normativos y procedimientos (Word)

### `ML-FA-001 MANUAL DE PROCEDIMIENTO DE FACTURACION.docx`

| Aspecto | Detalle |
|--------|---------|
| **Qué es** | Manual de procedimientos del área de facturación de **G&H OBRAS Y ESTRUCTURAS METÁLICAS S.A.S.** (código **ML-FA-001**). |
| **Contenido** | Objetivo, alcance, indicadores (p. ej. porcentaje de facturas sin errores, meta 95%), y descripción detallada de actividades para: facturación por **alquiler**, **transporte**, **venta**, **daños**, **reposición total** y **reposición parcial**, con diagramas/flujogramas asociados. |
| **Parte más útil para el negocio** | La sección de **facturación por alquiler**: revisión de fechas y carpetas por obra, fecha de corte según recogida, generación de inventario / movimientos en **Siigo** (“listado de movimientos de obras”, líneas 200 alquiler / 300 venta, grupos), **punteo** entre inventario y remisión de devolución, proforma, aprobación del cliente, registro e impresión de factura en Siigo, validación DIAN/RADIAN. |
| **Cómo usarlo** | Referencia oficial de **quién hace qué** (auxiliar de facturación, apoyo a cliente, etc.), **qué documentos** exige el proceso (remisiones, acta de descargue, bitácora, confirmación de cliente) y **los pasos en Siigo** al liquidar alquiler. Sirve para alinear un desarrollo nuevo con el procedimiento ya aprobado por gerencia. |

### `PR-DE-001 PROCEDIMIENTO DE DESPACHOS Y RECOGIDAS.docx`

| Aspecto | Detalle |
|--------|---------|
| **Qué es** | Por el **nombre del archivo** se esperaría el procedimiento PR-DE-001 de despachos y recogidas. |
| **Contenido real (extraído)** | El cuerpo del documento corresponde a un **formato de evaluación de desempeño** (talento humano), con tablas de factores actitudinales/técnicos, plan de mejoramiento y firmas — **no** describe despachos ni recogidas. |
| **Cómo usarlo** | Tratar como **inconsistencia de archivo**: verificar con el cliente si el Word correcto debe reemplazar este o si el procedimiento de despachos/recogidas vive en otro código o versión. **No** basar requisitos operativos de logística solo en este archivo hasta aclarar el contenido. |

---

## Hojas de cálculo (Excel)

### `PRODUCTO TERMINADO- PARA SUBIR 25062025.xlsx`

| Aspecto | Detalle |
|--------|---------|
| **Qué es** | Inventario de **producto terminado** con códigos, descripciones (p. ej. tableros), cantidades por bodega (Engativa, otra bodega, **bodega 50 clientes**), totales, costo unitario y costo total. |
| **Cómo usarlo** | Referencia de **catálogo y existencias** para subida a sistema o conciliación; la columna “Bodega 50 Clientes” refleja material en poder de clientes, alineado con la lógica de obras/alquiler. |

### `INACAR.xlsx`

| Aspecto | Detalle |
|--------|---------|
| **Qué es** | Exportación tipo **“MOVIMIENTO DETALLADO DE OBRA”** (impreso con fecha/hora), con NIT, sucursal, nombre de cliente (**INACAR S.A.**), producto, descripción, fechas, números de **remisión** y **devolución**, cantidades enviadas/devueltas y **saldo**. |
| **Cómo usarlo** | Ejemplo concreto del **reporte que se cruza con remisiones** para saber qué queda en obra; útil como modelo de datos o pantalla de “movimiento por cliente/producto” en un reemplazo del módulo de alquiler. |

---

## PDF

### `CONSTRUCTORES.pdf`

| Aspecto | Detalle |
|--------|---------|
| **Qué es** | Listado **“LISTADO DE KARDEX DE CLIENTES”** (14 páginas), periodo tipo ene 2026 – mar 2026, por NIT/sucursal (p. ej. **COMPAÑIA DE CONSTRUCTORES ASOCIADOS S.A.**), producto, fechas, números de envío/devolución, cantidades y **saldo** por línea. |
| **Cómo usarlo** | Es el tipo de **archivo/PDF que facturación revisa por cliente** para establecer saldos antes de facturar (coherente con el manual ML-FA-001 y con la narrativa del negocio). Sirve como referencia de salida esperada desde Siigo o desde un nuevo módulo de consulta de kardex. |

---

## Capturas de pantalla (JPEG)

### `WhatsApp Image 2026-03-20 at 1.22.57 PM.jpeg`

Pantalla principal del software **“Manejo de Alquiler de Inventarios”** (logo **ALFOREQUIPOS S.A.S.**), menú **Parámetros** abierto (catálogos de administración e inventarios). Barra de estado: **G&H OBRAS Y ESTRUCTURAS METÁLICAS SAS**, usuario **ADMON**, fecha 2026/03/20. En la barra de tareas aparece **Siigo**.

**Uso:** documentar el **módulo externo** actual y su convivencia con Siigo; evidencia de menú de parámetros/catálogos.

### `WhatsApp Image 2026-03-20 at 1.23.13 PM.jpeg`

Misma aplicación; menú **Procesos** desplegado: remisión de envío, devoluciones, reimpresión de notas, cotizaciones, pre-facturas, facturas.

**Uso:** mapa rápido del **flujo operativo** (remisión → devolución → pre-factura/factura) que el negocio describe como tiempos y movimientos.

### `WhatsApp Image 2026-03-20 at 1.23.29 PM.jpeg` y `WhatsApp Image 2026-03-20 at 1.23.29 PM (1).jpeg`

Misma aplicación; menú **Reportes** desplegado: movimiento por placas, por NIT (detalle), por producto (detalle), **remisiones y devoluciones**, reposiciones, documentos.

**Uso:** lista de **reportes** que cualquier solución nueva debería cubrir o mejorar; refuerza la necesidad de trazabilidad remisión/devolución/saldo.

---

## Resumen rápido por necesidad

| Necesidad | Archivos recomendados |
|-----------|------------------------|
| Procedimiento formal de facturación y pasos en Siigo | `ML-FA-001 ... FACTURACION.docx` |
| Ejemplo de kardex/saldo por cliente (PDF) | `CONSTRUCTORES.pdf` |
| Ejemplo de movimiento detallado en Excel | `INACAR.xlsx` |
| Inventario de producto terminado / bodegas | `PRODUCTO TERMINADO- PARA SUBIR 25062025.xlsx` |
| UI y funciones del módulo actual de alquiler | Imágenes WhatsApp 2026-03-20 |
| Procedimiento escrito de despachos/recogidas | `PR-DE-001 ...` — **contenido a validar** con el cliente |

---

*Índice generado a partir de lectura y extracción de texto de los documentos en `docs_reference/`.*
