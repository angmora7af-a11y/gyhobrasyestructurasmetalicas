# PDR-03 — Requerimientos no funcionales (NFR)

**Validación `call2.txt`:** despliegues **independientes** por ciudad; Siigo como sistema de FE externo.

## NFR-01 Seguridad

| ID | Requerimiento | Criterio |
|----|---------------|----------|
| NFR-SEC-01 | Autenticación segura (hash de contraseñas, HTTPS en prod) | OWASP ASVS orientativo |
| NFR-SEC-02 | Autorización por recurso (no solo por ruta) | Denegación por defecto |
| NFR-SEC-03 | Sin eliminación física de movimientos financieros/operativos; soft-delete + motivo | Auditoría |
| NFR-SEC-04 | Rate limiting en API pública | Configurable |

## NFR-02 Integridad y trazabilidad

| ID | Requerimiento | Criterio |
|----|---------------|----------|
| NFR-DAT-01 | IDs internos y **código visible de remisión** (cliente + timestamp) únicos por instancia | Unicidad en BD |
| NFR-DAT-02 | Versionado de importaciones masivas (quién, cuándo, archivo hash) | Log |

## NFR-03 Rendimiento y escalabilidad

| ID | Requerimiento | Criterio inicial |
|----|---------------|------------------|
| NFR-PERF-01 | API p95 < 500 ms en operaciones CRUD típicas bajo carga moderada | Medir en staging |
| NFR-PERF-02 | Reportes pesados asíncronos (job + descarga) | Evitar timeout HTTP |

## NFR-04 Disponibilidad y operación

| ID | Requerimiento | Criterio |
|----|---------------|----------|
| NFR-OPS-01 | Backups automatizados de BD | RPO/RTO definidos con cliente |
| NFR-OPS-02 | Logs estructurados (JSON) en API | Correlación request-id |

## NFR-05 Usabilidad

| ID | Requerimiento | Criterio |
|----|---------------|----------|
| NFR-UX-01 | Layout: **barra lateral vertical** + área de trabajo principal | `call.txt` |
| NFR-UX-02 | Estilo visual alineado a marca G&H (tokens: colores, tipografía) | Guía de marca pendiente |

## NFR-06 Cumplimiento y datos personales

| ID | Requerimiento | Criterio |
|----|---------------|----------|
| NFR-LEG-01 | Política de retención de datos y consentimiento (Ley 1581 si aplica) | Legal |
| NFR-LEG-02 | Datos de terceros (clientes finales) solo según necesidad | Minimización |

## NFR-07 Integraciones

| ID | Requerimiento | Criterio |
|----|---------------|----------|
| NFR-INT-01 | Conector Siigo: documentar modo (API oficial, archivo, RPA) antes de codificar; **lectura** para cartera prioritaria | Ver `QUESTIONS.md` |
| NFR-INT-02 | Colas para envío de correos y jobs de cartera | Desacoplado |

## NFR-08 Multi-instancia (`call2.txt`)

| ID | Requerimiento | Criterio |
|----|---------------|----------|
| NFR-MUL-01 | Configuración por instancia (ciudad/tenant) vía variables de entorno; **sin** mezclar datos entre ciudades por defecto | Documentado en despliegue |
| NFR-MUL-02 | Migración Excel: límites de tamaño, tiempo de procesamiento, aislamiento por tenant | Ops |

---

*Estos NFR deben reflejarse en la SDD (PDR-05) y en pruebas no funcionales.*
