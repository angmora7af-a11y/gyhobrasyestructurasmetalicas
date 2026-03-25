# Schedule — Proyecto G&H MVP (agente: gimena-scheduler)

**Fuente orden módulos:** `pdr/PDR-06-module-specs-and-delivery-order.md`  
**HUs:** `hus/HU_RUN-MVP-2026-03-24-all.md` (HU-001 … HU-026)  
**Fecha generación:** 2026-03-24

---

## Resumen por fase

| Fase PDR-06 | Módulo | HUs | Depende de | Estimación (h) Backend | Estimación (h) Frontend | Total fase (h) |
|:---|:---|:---|:---|---:|---:|---:|
| 0 | Fundación | HU-001 | — | 16 | 8 | 24 |
| 1 | Auth & shell | HU-002–006 | 0 | 40 | 32 | 72 |
| 2 | Catálogo + import | HU-007–009 | 1 | 48 | 24 | 72 |
| 3 | Clientes + crédito | HU-010–011 | 1 | 24 | 20 | 44 |
| 4 | Tickets | HU-012–013 | 2,3 | 28 | 28 | 56 |
| 5 | Remisión + venta + PDF | HU-014–016 | 4 | 40 | 24 | 64 |
| 6 | Kardex | HU-017 | 5 | 32 | 16 | 48 |
| 7 | Proforma / Siigo export | HU-018 | 6 | 24 | 12 | 36 |
| 8 | Integración cartera Siigo | HU-019 | 7 | 40 | 8 | 48 |
| 9 | Cartera | HU-020–021 | 8 | 32 | 24 | 56 |
| 10 | Dashboards + BI | HU-022–023 | 9 | 24 | 32 | 56 |
| 11 | Multi-inst + notif + exclusiones | HU-024–026 | 1–10 | 24 | 16 | 40 |

**Total orientativo:** ~620 h (~15–16 semanas con 2 devs FTE según carga; ajustar en refinamiento).

---

## Hitos (milestones)

| # | Hito | Contenido mínimo |
|:---|:---|:---|
| M1 | **Infra lista** | HU-001 CI verde |
| M2 | **Usuarios y roles** | HU-002–006 |
| M3 | **Catálogo operativo** | HU-007–009 |
| M4 | **Cliente → ticket** | HU-010–013 |
| M5 | **Remisión en producción piloto** | HU-014–016 |
| M6 | **Reportes kardex** | HU-017 |
| M7 | **Insumos Siigo** | HU-018 |
| M8 | **Cartera con datos Siigo** | HU-019–021 |
| M9 | **MVP cerrado** | HU-022–026 + UAT |

---

## Asignación de recursos (por módulo)

| Módulo | Backend | Frontend |
|:---|:---|:---|
| Fundación / Auth / Catálogo | Principal | Principal |
| Tickets / Remisión | Principal | Principal |
| Kardex / Export | Principal | Soporte |
| Siigo / Cartera | Principal (integración) | Soporte |
| Dashboards | Soporte | Principal |

---

## Aclaraciones necesarias

| Marcador | Tema |
|:---|:---|
| `[IMPORTANT]` | Modo exacto integración Siigo (API vs archivo) afecta HU-019 duración ±40 h. |
| `[IMPORTANT]` | Plantilla PDF remisión (HU-016) requiere branding G&H. |
| `[NICE_TO_HAVE]` | E2E completo pospuesto hasta estabilizar API. |

---

*Estimaciones indicativas; revisar en sprint planning.*
