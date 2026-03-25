# Sitemaps y checklist UX/UI por rol y módulo

**Propósito:** guía para construcción de navegación (sidebar), rutas y pantallas. Marcar ítems al implementar.  
**Layout base:** barra vertical + área de trabajo (`call.txt`).  
**Alcance MVP (`call2.txt`):** sin **devoluciones** en sistema; **cartera** reforzada y alineada a **Siigo**; catálogo **sin imágenes**; precio alquiler **por día**.

**Leyenda:** `[ ]` pendiente · `[x]` hecho

---

## Convenciones globales

- [x] Login — UI + validación cliente (`apps/web`, HU-002 parcial); [ ] recuperación contraseña (HU-005)
- [ ] Selector de rol si el usuario tiene más de uno
- [ ] Notificaciones (campana) — fase 2 (shell incluye icono no funcional)
- [ ] Ayuda contextual o enlaces a PDR
- [ ] Tablas: paginación, filtros, export CSV donde aplique

---

## 1. Cliente externo

### 1.1 Árbol de navegación (sitemap)

```
/ (dashboard cliente)
├── /solicitudes
│   ├── nueva
│   └── :id (detalle + adjuntos + estado)
├── /cotizaciones (vista de propuestas recibidas — si aplica)
├── /obras (lista de obras autorizadas)
├── /movimientos (solo lectura: remisiones; devoluciones **fase posterior**)
├── /documentos (proformas, confirmaciones subidas)
└── /cuenta (perfil, cambio contraseña)
```

### 1.2 Checklist por pantalla

| Pantalla | Checklist |
|----------|-----------|
| **Dashboard** | [x] shell `/cliente` (HU-006); [ ] resumen solicitudes abiertas; [ ] accesos rápidos |
| **Nueva solicitud** | [ ] líneas ítem/cantidad; [ ] selección obra; [ ] fecha requerida; [ ] adjuntos |
| **Detalle solicitud** | [ ] timeline de estados; [ ] mensajes/comentarios |
| **Movimientos** | [ ] tabla compatible `INDEX` (remisión; columnas devolución en 0 o import); saldo según regla MVP |
| **Cuenta** | [ ] datos fiscales básicos; [ ] contactos |

---

## 2. Proveedor de catálogo (si aplica rol externo)

```
/dashboard-proveedor
├── /importaciones
│   ├── nueva (carga archivo)
│   └── :batchId (errores por fila)
└── /productos (solo ítems propios en estado borrador/rechazado)
```

| Pantalla | Checklist |
|----------|-----------|
| **Carga masiva** | [ ] plantilla descargable; [ ] validación cliente; [ ] preview errores |
| **Estado lote** | [ ] pendiente aprobación admin |

---

## 3. Administrador

```
/admin
├── /dashboard (KPIs)
├── /usuarios
├── /roles-permisos
├── /catalogo
│   ├── productos (sin galería imágenes MVP)
│   ├── bodegas
│   └── aprobaciones-importacion
├── /clientes (vista global)
├── /tickets (todas las solicitudes)
├── /operaciones
│   ├── remisiones (código cliente + timestamp)
│   └── ~~devoluciones~~ → roadmap fase II
├── /reportes
│   ├── kardex-cliente
│   └── movimiento-obra
├── /integraciones (siigo, jobs)
└── /auditoria (logs)
```

| Módulo | Checklist |
|--------|-----------|
| **Dashboard** | [x] shell KPIs placeholder (`/admin`, HU-022); [ ] equipos en préstamo; [ ] solicitudes abiertas; [ ] órdenes en proceso; [ ] gráfica cartera |
| **Usuarios** | [ ] CRUD; [ ] asignación roles |
| **Aprobación import** | [ ] diff o listado; [ ] aprobar/rechazar lote |
| **Reportes** | [ ] export Excel/PDF; [ ] filtros NIT, fechas, obra |

---

## 4. Logística / despacho

```
/logistica
├── /bandeja-solicitudes (aprobados para despacho)
├── /remisiones
│   ├── nueva
│   └── :id (muestra código trazable)
├── /venta-directa (si aplica flujo separado)
└── /impresiones (PDF remisión)
```

| Pantalla | Checklist |
|----------|-----------|
| **Nueva remisión** | [ ] ticket/obra; [ ] líneas; [ ] **código** siglas cliente + timestamp; [ ] fecha |
| **Devolución** | **No MVP** — no rutas |
| **Venta directa** | [ ] líneas y referencia interna |
| **Imprimir** | [ ] plantilla PDF |

---

## 5. Facturación / auxiliar facturación

```
/facturacion
├── /periodos-corte
├── /proformas
│   ├── generar-desde-saldo
│   └── :id (enviar a cliente)
├── /punteo (vista conciliación inventario vs remisión — opcional)
├── /export-siigo
└── /documentos-obra (adjuntos ML-FA-001)
```

| Pantalla | Checklist |
|----------|-----------|
| **Generar proforma** | [ ] rango fechas; [ ] cliente/sucursal; [ ] líneas desde saldo |
| **Aprobación cliente** | [ ] registrar OK; [ ] adjunto confirmación |
| **Export** | [ ] formato acordado con Siigo |

---

## 6. Crédito

```
/credito
├── /solicitudes
│   ├── nueva
│   └── :id (documentos, estados)
└── /politicas (solo lectura o admin)
```

| Pantalla | Checklist |
|----------|-----------|
| **Expediente** | [ ] checklist documentos; [ ] estados; [ ] notas internas |
| **Bloqueo** | [ ] indicador si cliente no puede remisionar (flag) |

---

## 7. Cartera

```
/cartera
├── /dashboard (pendientes, mora)
├── /facturas
│   ├── :id
│   └── registrar-pago (si aplica)
├── /canales-recoleccion (comprobantes, notas — definir)
├── /campanas-recordatorio
└── /jobs (últimos envíos)
```

| Pantalla | Checklist |
|----------|-----------|
| **Lista facturas** | [ ] datos coherentes con **Siigo**; [ ] filtros mora; [ ] totales |
| **Recordatorios** | [ ] plantilla email; [ ] programación |
| **Canales** | [ ] registrar medio de pago / soporte (`call2.txt`) |
| **IA / estrategia** | [ ] opcional / placeholder |

---

## 8. Auditoría / solo lectura (opcional)

```
/auditoria
└── /eventos (filtros por usuario, entidad, fecha)
```

---

## 9. Mapa de módulos → rutas (resumen)

| Módulo | Roles principales |
|--------|-------------------|
| Auth | Todos |
| Catálogo | Admin, Proveedor |
| Clientes/obras | Admin, Cliente (limitado), Crédito |
| Solicitudes | Cliente, Admin |
| Remisión (sin devolución MVP) | Logística, Admin |
| Kardex/Reportes | Admin, Facturación |
| Proforma | Facturación |
| Cartera | Cartera, Admin |
| Crédito | Crédito, Admin |

---

## 10. Notas UX

- **Sidebar:** agrupar por dominio (Operación, Comercial, Finanzas, Administración).
- **Estados visibles:** badges de color consistentes (borrador, pendiente, en proceso, cerrado).
- **Mobile:** definir prioridad (operativo en campo puede requerir vistas simplificadas).

---

*Actualizar rutas cuando se defina el framework de front (React Router, etc.).*
