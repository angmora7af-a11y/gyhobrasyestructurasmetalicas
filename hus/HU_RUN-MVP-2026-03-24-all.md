# [RUN-MVP-2026-03-24] User Stories — Plataforma G&H (MVP)

## Run Metadata

| Field | Value |
| :--- | :--- |
| **RUN_ID** | RUN-MVP-2026-03-24 |
| **Date** | 2026-03-24 |
| **HU Range** | HU-001 to HU-026 |
| **Source** | `pdr/PDR-02`, `pdr/PDR-06`, `agents/project_brain_gyhobras.md`, `call2.txt` |
| **Total HUs** | 26 |

**Reglas MVP:** CPE solo **Siigo**; precio alquiler **por día**; **sin** módulo devoluciones; catálogo **sin imágenes**; remisión **siglas cliente + timestamp**.

---

# HU-001: Fundación — Monorepo, Docker y CI

## 1. CONTEXTO
| **Módulo:** Fundación / PDR-06 Fase 0 |

### **Como** equipo de desarrollo **Quiero** un monorepo con API FastAPI, web SPA y entorno local reproducible **Para** iniciar módulos siguientes sin deuda técnica.

## 2. CRITERIOS DE ACEPTACIÓN (AC)
### 2.1. Interfaz y Experiencia
- Estructura `apps/api`, `apps/web` (o equivalente documentado en `pdr/PDR-05`).
- `docker-compose` (o Makefile) levanta API + DB + Redis + web dev.
- README con comandos de instalación.

### 2.2. Reglas de negocio / técnicas
- Pipeline CI ejecuta lint + tests API vacíos (smoke) + build web.

### 2.3. Manejo de errores
| Escenario | Mensaje / Acción |
| :--- | :--- |
| Puerto ocupado | Documentar variable de puerto |

---

# HU-002: Auth — Login y sesión

## 1. CONTEXTO
| **Módulo:** Auth | **FR:** FR-001 |

### **Como** usuario **Quiero** iniciar sesión con email/usuario y contraseña **Para** acceder según mi rol.

## 2. AC
### 2.1. UI
- Formulario login; mensajes de error genéricos (no filtrar usuarios existentes).
- Sesión con JWT o cookie httpOnly según `pdr/PDR-05`.

### 2.2. Servidor
- Hash de contraseña (bcrypt/argon2); bloqueo tras N intentos configurable.

### 2.3. Errores
| 401 | Credenciales inválidas |
| 423 | Cuenta bloqueada |

---

# HU-003: Auth — RBAC

## 1. CONTEXTO
| **FR:** FR-002, FR-004 |

### **Como** administrador **Quiero** asignar roles **Para** que cada perfil solo vea lo autorizado.

## 2. AC
- Roles: Cliente, Aportante catálogo, Admin, Logística, Facturación, Cartera, Crédito (ajustables por nombre).
- Guards en API y rutas front por rol.
- Matriz documentada en `spec-kit/TRACEABILITY.md` (referencia).

---

# HU-004: Auth — Auditoría

## 1. CONTEXTO
| **FR:** FR-003 |

### **Como** auditor **Quiero** registro de acciones críticas **Para** trazabilidad.

## 2. AC
- Eventos append-only: catálogo, import aprobado, remisión, venta directa, cambios cartera.
- Incluye usuario, timestamp, entidad, acción, payload diff opcional.

---

# HU-005: Auth — Recuperación de contraseña

## 1. CONTEXTO
| **FR:** FR-001 |

### **Como** usuario **Quiero** solicitar restablecimiento **Para** recuperar acceso.

## 2. AC
- Flujo con token de un solo uso y expiración; email configurable (env/stub en dev).

---

# HU-006: Shell UI — Sidebar y workspace

## 1. CONTEXTO
| **Referencia:** `call.txt`, `pdr/ux/SITEMAPS-CHECKLIST-BY-ROLE.md` |

### **Como** usuario **Quiero** navegación lateral y área principal **Para** trabajar de forma convencional.

## 2. AC
- Layout vertical sidebar + main; menú filtrado por rol.
- Responsive básico (definir breakpoints mínimos).

---

# HU-007: Catálogo — CRUD productos Alforequipos

## 1. CONTEXTO
| **FR:** FR-010, FR-010a, FR-011 |

### **Como** admin **Quiero** gestionar productos (alquiler y/o venta) **Para** usarlos en tickets y remisiones.

## 2. AC
- Campos: código, descripción, categoría, modalidad alquiler/venta, precio alquiler **por día**, precio venta si aplica, texto uso/notas.
- **Sin** campo imagen en MVP.
- Validación: precio día > 0 para ítems en alquiler.

---

# HU-008: Catálogo — Migración Excel y endpoints globales

## 1. CONTEXTO
| **FR:** FR-013, FR-015, FR-016 |

### **Como** operación **Quiero** cargar Excel vía API **Para** migración masiva.

## 2. AC
- Endpoint `POST` multipart (multipart/form-data) con auth rol admin/servicio.
- Validación fila a fila: duplicados, códigos obligatorios, tipos; respuesta con errores por fila.
- OpenAPI documentado y versionado (`/api/v1/...`).

---

# HU-009: Catálogo — Aprobación de lote import

## 1. CONTEXTO
| **FR:** FR-014 |

### **Como** Admin **Quiero** aprobar o rechazar lotes **Para** activar catálogo.

## 2. AC
- Estados: borrador → pendiente → activo/rechazado.
- Solo ítems activos en tickets/remisiones.

---

# HU-010: Clientes — NIT, sucursales, obras, siglas

## 1. CONTEXTO
| **FR:** FR-020, FR-021 |

### **Como** comercial **Quiero** registrar clientes y obras **Para** remisiones y reportes tipo `INDEX`.

## 2. AC
- NIT, razón social, sucursales (código SUC).
- Obra: dirección, contacto sitio.
- **Siglas** alfanuméricas para componer código remisión (ver HU-014).

---

# HU-011: Crédito — Expediente v1

## 1. CONTEXTO
| **FR:** FR-022, FR-023 |

### **Como** analista de crédito **Quiero** expediente con estados **Para** condicionar operación.

## 2. AC
- Estados: en estudio, aprobado, rechazado, condicionado; adjuntos.
- Flag opcional bloquea remisión si crédito no aprobado (configurable).

---

# HU-012: Solicitudes — Tickets cotización

## 1. CONTEXTO
| **FR:** FR-030, FR-031, FR-032 |

### **Como** cliente **Quiero** crear solicitud con ítems y obra **Para** cotización.

## 2. AC
- Líneas: producto, cantidad; obra; fecha requerida.
- Adjuntos y comentarios opcionales.

---

# HU-013: Solicitudes — Estados y SLA

## 1. CONTEXTO
| **FR:** FR-031, FR-033 |

### **Como** interno **Quiero** transiciones de estado **Para** seguimiento.

## 2. AC
- Estados: recibido → en cotización → cotización enviada → aceptada/rechazada.
- Campos de fecha primera respuesta / envío cotización (SLA medible).

---

# HU-014: Remisión — Envío con código trazable

## 1. CONTEXTO
| **FR:** FR-040–FR-042, FR-041 |

### **Como** logística **Quiero** crear remisión **Para** registrar salida de equipo.

## 2. AC
- Remisión desde flujo autorizado (ticket aprobado o regla definida).
- **Código visible único:** siglas cliente + timestamp (zona horaria documentada).
- Líneas: producto, cantidad, fecha.

---

# HU-015: Venta directa

## 1. CONTEXTO
| **FR:** FR-043 |

### **Como** logística/admin **Quiero** registrar venta directa **Para** movimientos sin alquiler.

## 2. AC
- Documento/orden interno; líneas y totales; no genera CPE.

---

# HU-016: Remisión — Export PDF

## 1. CONTEXTO
| **FR:** FR-044 |

### **Como** usuario **Quiero** PDF de remisión **Para** imprimir.

## 2. AC
- Plantilla con datos empresa, código remisión, líneas.

---

# HU-017: Kardex y reportes

## 1. CONTEXTO
| **FR:** FR-060–FR-062 |
| **Referencia datos:** `INDEX.md` (INACAR, CONSTRUCTORES.pdf) |

### **Como** facturación **Quiero** consultar movimientos y exportar **Para** conciliar.

## 2. AC
- Filtros NIT, producto, fechas, obra.
- Export Excel/PDF compatible con columnas `INDEX` (devolución en 0 o legado si importa).
- Saldos según reglas sin devoluciones en app (documentado en `pdr/PDR-04`).

---

# HU-018: Proforma / insumos — Sin CPE en app

## 1. CONTEXTO
| **FR:** FR-070–FR-073, FR-072 |

### **Como** facturación **Quiero** generar borrador/proforma o export **Para** registrar en Siigo.

## 2. AC
- La aplicación **no** emite factura electrónica (CPE).
- Registro de aprobación cliente si aplica (FR-071).
- Export batch según diseño (CSV/Excel).

---

# HU-019: Integración — Datos facturas hacia cartera

## 1. CONTEXTO
| **FR:** FR-080, FR-073 |

### **Como** sistema **Quiero** sincronizar/importar facturas desde Siigo **Para** cartera ordenada.

## 2. AC
- Modo acordado (API vs archivo); mapeo número, cliente, valor, vencimiento, estado.

---

# HU-020: Cartera — Pendientes, mora, recordatorios

## 1. CONTEXTO
| **FR:** FR-082 |

### **Como** cartera **Quiero** listar mora y programar recordatorios **Para** cobro oportuno.

## 2. AC
- Jobs asíncronos (cola); plantillas email; sin datos sensibles en logs.

---

# HU-021: Cartera — Canales de recolección de pago

## 1. CONTEXTO
| **FR:** FR-081 |

### **Como** cartera **Quiero** registrar canal de pago/comprobante **Para** trazabilidad.

## 2. AC
- Campos mínimos: transferencia, referencia, fecha, archivo opcional.

---

# HU-022: Dashboard administrativo

## 1. CONTEXTO
| **FR:** FR-090, FR-091 |

### **Como** admin **Quiero** KPIs **Para** operación y cobro.

## 2. AC
- Widgets: préstamos activos, solicitudes abiertas, resumen cartera (pendiente/mora).

---

# HU-023: Export BI

## 1. CONTEXTO
| **FR:** FR-092 |

### **Como** admin **Quiero** export CSV/JSON agregado **Para** BI externo.

## 2. AC
- Endpoint o job export con filtros de fecha; sin PII innecesaria.

---

# HU-024: Multi-instancia (ciudad/tenant)

## 1. CONTEXTO
| **FR:** FR-110 |

### **Como** operación **Quiero** configuración por instancia **Para** despliegues independientes por ciudad.

## 2. AC
- Variables entorno: `TENANT_ID`, `CITY_CODE`, branding; BD aislada por deploy.

---

# HU-025: Notificaciones email en tickets

## 1. CONTEXTO
| **FR:** FR-101 |

### **Como** cliente **Quiero** notificación al cambiar estado **Para** seguimiento.

## 2. AC
- Disparo al cambiar estado; plantilla configurable.

---

# HU-026: Exclusiones de alcance en UI

## 1. CONTEXTO
| **FR:** FR-045, FR-063 |

### **Como** producto **Quiero** que no existan módulos transporte/daños/repuestos **Para** alinear `call2.txt`.

## 2. AC
- No rutas ni menús para esos procesos; documentación en ayuda interna.

---

*Fin RUN-MVP-2026-03-24*
