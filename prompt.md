# Prompts para Stitch — base gráfica G&H Obras

Este archivo resume el análisis de `pdr/` y `hus/` y contiene **texto listo para pegar** en [Stitch](https://www.figma.com/stitch/) (o herramientas similares de UI con IA) para generar el sistema visual y pantallas del MVP.

---

## 1. Análisis resumido: `pdr/`

| Fuente | Qué aporta a la UI |
|--------|---------------------|
| **PDR-01** | Plataforma web multi-rol: catálogo Alforequipos → solicitudes → remisiones → kardex → insumos Siigo → cartera. **Facturación electrónica solo en Siigo** (la app no emite CPE). MVP: sin devoluciones, sin imágenes en catálogo, alquiler **precio por día**. |
| **PDR-02 (FR)** | Formularios y tablas coherentes: login, RBAC, auditoría, catálogo sin imagen, import Excel, clientes/obras/siglas, tickets con estados, remisión con **código visible (siglas cliente + timestamp)**, kardex con filtros, proforma/export Siigo, cartera alineada a facturas, dashboard KPIs. |
| **PDR-06** | Orden de módulos: auth → catálogo → clientes/crédito → solicitudes → remisiones → reportes → Siigo → cartera → dashboards. |
| **`ux/SITEMAPS-CHECKLIST-BY-ROLE.md`** | **Layout:** sidebar vertical + área de trabajo. Sitemaps por rol, rutas, checklist por pantalla. Sidebar agrupada por dominio: Operación, Comercial, Finanzas, Administración. Badges de estado consistentes. |

---

## 2. Análisis resumido: `hus/`

| Aspecto | Contenido |
|---------|-----------|
| **RUN-MVP-2026-03-24** | 26 historias (HU-001 … HU-026) alineadas al PDR. |
| **HU-006** | Shell obligatorio: **menú lateral + workspace principal**, menú filtrado por rol, responsive básico. |
| **Pantallas clave** | Login y recuperación contraseña; CRUD catálogo sin foto; carga Excel con errores por fila; aprobación de lotes; clientes/obras/siglas; tickets con líneas y timeline de estados; remisión con código destacado; tablas kardex con export; cartera con mora y canales de pago; dashboard con widgets; **sin** UI de transporte/daños/repuestos/devoluciones. |

---

## 3. Tokens de marca (desde `technical_resources/style.scss`)

Usa estos valores en Stitch como **constraints** o en un primer prompt de “design system”:

- **Primario:** `#e30613` (rojo corporativo)
- **Secundario / superficies oscuras:** `#1a1a1a`
- **Acento / fondos suaves:** `#f4f4f4`
- **Texto:** `#333333`
- **Tipografía:** Roboto, 16px base, interlineado ~1.6
- **Botón primario:** fondo rojo, texto blanco, mayúsculas, peso bold, radio 4px, hover más oscuro
- **Tarjetas:** borde ligero, sombra sutil al hover (productos/listados)

---

## 4. Prompt maestro (design system + app shell) — pegar en Stitch

```
Diseña un design system y shell de aplicación web B2B para "G&H Obras", plataforma de alquiler de equipos, inventario por movimientos e integración con facturación externa (Siigo).

Estilo visual:
- Marca: rojo corporativo #e30613 como color primario de botones y acentos; texto #333333; fondos #ffffff y #f4f4f4; barras/headers oscuros opcionales #1a1a1a.
- Tipografía: Roboto, sensación profesional industrial/construcción, limpia y legible en tablas densas.

Layout de aplicación:
- Desktop-first: barra lateral izquierda fija (sidebar) con grupos de navegación: Operación, Comercial, Finanzas, Administración (según rol).
- Área principal: encabezado de página con título y acciones; contenido con scroll.
- Componentes: tabla con paginación y filtros, formularios en columnas, badges de estado (borrador, pendiente, en proceso, cerrado) con paleta consistente, tarjetas KPI para dashboard, modales para confirmaciones.

Restricciones MVP:
- No incluir galería de imágenes en catálogo de productos (solo texto/datos).
- No incluir flujos de devoluciones ni módulos de transporte, daños o repuestos.
- La app no emite factura electrónica; mostrar copy tipo "Insumos para Siigo" o "Exportar", nunca "Emitir factura" como CPE.

Entregables del frame: página de login; layout autenticado con sidebar + workspace vacío; variante compacta mobile del menú (drawer o bottom nav simplificado).
```

---

## 5. Prompt — Login y recuperación de contraseña

```
Pantalla de login para web app G&H Obras: formulario email/usuario y contraseña, botón primario rojo #e30613, enlace "¿Olvidaste tu contraseña?", mensajes de error genéricos (sin revelar si el usuario existe). Estética corporativa minimalista. Incluir variante "solicitar restablecimiento" con campo email y confirmación de envío.
```

---

## 6. Prompt — Cliente externo (portal)

```
Portal cliente para G&H Obras: usa sidebar o navegación superior reducida con: Inicio, Solicitudes, Cotizaciones, Obras, Movimientos (solo lectura), Documentos, Cuenta.

Diseña:
- Dashboard: resumen de solicitudes abiertas y accesos rápidos.
- Formulario "Nueva solicitud": líneas de ítem/cantidad, selector de obra, fecha requerida, adjuntos.
- Detalle de solicitud: timeline vertical de estados, área de comentarios.
- Lista movimientos: tabla con columnas tipo remisión, saldos (sin flujo devolución).

Colores marca #e30613 / #333 / fondos claros. Sin módulos de devolución en menú.
```

---

## 7. Prompt — Administrador (backoffice)

```
Backoffice administrativo G&H Obras: layout sidebar + workspace. Menú agrupado: Dashboard (KPIs: equipos en préstamo, solicitudes abiertas, órdenes en proceso, mini gráfica de cartera), Usuarios, Roles y permisos, Catálogo (productos sin galería, bodegas, aprobaciones de importación), Clientes, Tickets (todas las solicitudes), Operaciones (remisiones; NO devoluciones), Reportes (kardex cliente, movimiento por obra), Integraciones, Auditoría.

Pantalla dashboard: grid de widgets KPI y tabla resumida. Pantalla catálogo: tabla densa con filtros. Pantalla aprobación de import: listado de lotes con estados borrador/pendiente/activo/rechazado y acciones aprobar/rechazar.

Paleta #e30613, #1a1a1a, #f4f4f4, Roboto.
```

---

## 8. Prompt — Logística / despacho

```
Módulo logística G&H Obras: bandeja de solicitudes aprobadas para despacho; flujo "Nueva remisión" con selección de ticket/obra, líneas producto/cantidad/fecha; campo destacado "Código de remisión" generado como siglas de cliente + marca de tiempo (mostrar como texto monoespaciado o badge grande); lista de remisiones con búsqueda; acción imprimir PDF (icono). Opcional: pantalla venta directa con líneas y referencia interna. Sin pantallas de devolución.
```

---

## 9. Prompt — Facturación (insumos Siigo)

```
Área facturación G&H Obras: navegación con periodos/corte, proformas (generar desde saldo, detalle, enviar a cliente), export a Siigo, documentos de obra. Enfatizar en UI que la facturación electrónica se gestiona en Siigo; aquí solo proformas, export CSV/Excel y estados de aprobación cliente. Tablas y formularios densos, tono institucional.
```

---

## 10. Prompt — Cartera

```
Módulo cartera G&H Obras: dashboard de pendientes y mora; lista de facturas con columnas alineadas a datos contables (número, cliente, valor, vencimiento, estado); detalle factura; registro de pago/canal (transferencia, comprobante); sección canales de recolección de información de pago; campañas/recordatorios (lista de jobs o envíos). Filtros por mora y totales. Colores marca rojo #e30613 y neutros; badges de estado de cobro.
```

---

## 11. Prompt — Crédito

```
Módulo crédito: lista de solicitudes con expediente; detalle con checklist de documentos, estados (en estudio, aprobado, rechazado, condicionado), notas internas; indicador visible si el cliente tiene bloqueo para remisionar. UI sobria, tablas y panel lateral de detalle.
```

---

## 12. Prompt — Tablas y datos (patrón repetible)

```
Componente de tabla de datos para app G&H: encabezado fijo opcional, filtros en fila superior (NIT, fechas, producto, obra), paginación abajo, icono exportar CSV, filas alternadas o hover sutil #f4f4f4, acciones por fila en menú ⋮. Tipografía Roboto 14–16px. Compatible con muchas columnas numéricas (kardex, movimientos).
```

---

## 13. Cómo usar esto en Stitch

1. **Primero** pega el **prompt maestro (sección 4)** para obtener variables de color, tipografía y el shell.
2. **Después** genera frames por rol con las secciones 5–12 (puedes acortar o fusionar si Stitch limita longitud).
3. **Refuerza** en cada iteración: *sin imágenes en catálogo*, *sin devoluciones*, *CPE solo en Siigo*, *código remisión = siglas + timestamp*.

Si Stitch permite “design constraints” o adjuntos, enlaza mentalmente este documento con `pdr/ux/SITEMAPS-CHECKLIST-BY-ROLE.md` para no omitir rutas ni roles.

---

*Generado a partir de `pdr/*`, `hus/HU_RUN-MVP-2026-03-24-all.md`, `hus/INDEX.md` y `technical_resources/style.scss`.*
