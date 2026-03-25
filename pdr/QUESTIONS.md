# Preguntas abiertas (producto, legal, integración)

**Actualizado:** decisiones de `call2.txt` eliminan o reemplazan varias preguntas anteriores.  
**Leyenda:** ✅ Respondida por `call2` · ⏳ Pendiente · ⊘ No aplica al MVP

---

## A. Facturación y fiscalidad

1. ✅ ¿Toda la CPE es solo Siigo? **Sí** (`call2.txt`).
2. ⊘ ¿PDF factura desde la plataforma? **No** emisión; cartera puede usar PDFs de Siigo.
3. ⏳ ¿La cartera reenvía PDF de Siigo, enlace o solo recordatorio de texto?
4. ⏳ ¿Notas crédito / anulaciones y reflejo en cartera?

---

## B. Siigo y datos maestros

5. ⏳ ¿API oficial contratada (documentación, ambientes)?
6. ⏳ ¿Qué entidades sincronizar (clientes, productos, facturas, movimientos) y frecuencia?
7. ⏳ ¿Códigos de producto idénticos entre catálogo nuevo y Siigo?
8. ⏳ Mapeo líneas **200 / 300** en la práctica.

---

## C. Operación y roles

9. ⏳ ¿El que carga Excel masivo es **solo interno** o también tercero?
10. ✅ ¿Devoluciones en MVP? **No** (`call2.txt`); reprogramar pregunta para fase II.
11. ⏳ ¿Un usuario con varios roles?
12. ⏳ ¿Evidencia fotográfica en remisión (sin ser “imagen de catálogo”)?

---

## D. Reglas de negocio (kardex)

13. ⏳ Sin devoluciones en app: ¿cómo se valida **saldo** frente al cliente? (Siigo vs Excel manual).
14. ⏳ ¿Días de alquiler = **calendario** o **hábiles**? (`call2` confirma **día**, no el calendario).

---

## E. Cartera y cobros

15. ✅ ¿Modelo basado en Siigo? **Sí** (`call2.txt`).
16. ⏳ **Canales de recolección** concretos (transferencia, comprobante, integración banco).
17. ⏳ Plantillas legales de recordatorio.
18. ⏳ IA en cobranza: **opcional** (`call2`).

---

## F. Canales y UX

19. ⏳ Convivencia con correos atencionalcliente@ / soporte@.
20. ✅ ¿WhatsApp obligatorio? **No**; opcional (`call2.txt`).
21. ⏳ Branding G&H vs Alforequipos en UI (catálogo Alforequipos).

---

## G. Datos y migración

22. ⏳ Historial del módulo legado disponible para import.
23. ⏳ Plantilla Excel oficial para migración (columnas).
24. ⊘ PR-DE-001 hasta entrega correcta.

---

## H. WEB_PAGE.md / scraping

25. ⊘ Alcance separado salvo decisión.

---

## I. No funcionales

26. ⏳ Usuarios concurrentes / movimientos mensuales.
27. ⏳ Hosting por **ciudad** (misma nube, región).
28. ⏳ RPO/RTO.

---

## J. Multi-ciudad (`call2.txt`)

29. ⏳ ¿Un **despliegue** por ciudad desde el mismo repo con solo variables de entorno, o proyectos separados?
30. ⏳ ¿Datos compartidos entre ciudades? (Por defecto **no** en PDR-05.)

---

*Marcar en herramienta de proyecto: ✅ / ⏳ / ⊘.*
