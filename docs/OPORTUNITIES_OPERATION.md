# Memorando de servicio — Canales de atención y oportunidades de mejora operativa

**Tipo de documento:** Memorando de servicio (MS)  
**Ámbito:** Atención al cliente, cotización, crédito, ingeniería/soporte y logística  
**Empresa de referencia:** G&H Obras y Estructuras Metálicas S.A.S. (Bogotá)

---

## 1. Referencia de proceso (texto oficial para clientes y operación)

### 1.1. Proceso de alquiler y cotización

**Pregunta:** ¿Cómo se hace el proceso de alquiler?

**Respuesta:** El cliente debe enviar la **solicitud de cotización** al correo electrónico **atencionalcliente@gyhbogota.com**, indicando la información de los equipos en los que está interesado. Con esa información el área comercial o de atención atiende la solicitud y devuelve la propuesta correspondiente.

---

### 1.2. Proceso de crédito

**Pregunta:** ¿Cómo hacer el proceso de crédito?

**Respuesta:** Se debe **diligenciar el formato de vinculación** y **anexar la documentación requerida**. Una vez entregados todos los documentos, se realiza **un estudio de crédito** según las políticas internas de la empresa.

---

### 1.3. Modulación de planos

**Pregunta:** ¿Cuánto tiempo se lleva el proceso de modulación de planos?

**Respuesta:** Una vez enviados los planos al correo **soporte@gyhbogota.com**, se informa el **recibido** y se comunica el **plazo estimado** en el cual se enviará la **cotización** correspondiente al trabajo de modulación.

---

### 1.4. Despacho de pedidos

**Pregunta:** ¿Cuánto tiempo se tarda el despacho de un pedido?

**Respuesta:** Los tiempos de despacho dependen de la **disponibilidad del material**, de la **confirmación del pedido** (y, cuando aplique, pago o condiciones acordadas) y de la **programación logística**. El cliente recibe por los canales habituales (correo o contacto comercial) la **confirmación de recibido del pedido** y la **fecha o ventana** en la que se programará el despacho. *(Nota: el texto anterior no debe confundirse con el proceso de planos; el despacho es un proceso logístico distinto.)*

---

### 1.5. Cobertura de transporte

**Pregunta:** ¿El servicio de transporte cubre toda la región?

**Respuesta:** La empresa realiza **despachos en Bogotá y alrededores**. Para zonas o condiciones específicas conviene confirmar disponibilidad y costo con el área comercial o de logística.

---

### 1.6. Acompañamiento en obra

**Pregunta:** ¿Ofrecen acompañamiento en sus proyectos?

**Respuesta:** Sí. Se brinda **acompañamiento en obra** y **apoyo técnico** en los proyectos en los que los clientes lo soliciten, según alcance y disponibilidad acordada.

---

## 2. Análisis de la operación actual

**Dependencia del correo electrónico.** Los puntos de contacto descritos (cotización, planos, crédito) están concentrados en **buzones genéricos**. Eso facilita la entrada de solicitudes, pero genera:

- **Colas invisibles:** varias personas pueden responder el mismo hilo o retrasar la respuesta sin prioridad explícita.
- **Poca trazabilidad:** no siempre queda un **ticket único** con estado (recibido, en análisis, cotizado, aprobado, despachado).
- **Riesgo de pérdida de información:** adjuntos, versiones de planos y requisitos de alcance se dispersan entre hilos de correo.
- **Dificultad para medir SLAs:** “cuánto tarda” depende de la carga del día y no de acuerdos medibles de servicio.

**Encaje con el caso de negocio interno.** En el núcleo de **alquiler por movimientos** (remisiones, devoluciones, saldos, Siigo), la operación ya sufre por **datos frágiles** y **permisos amplios** en el módulo de alquiler. Si el **front-office** (cotización, planos, despacho) sigue 100 % dependiente del correo, se amplifica el riesgo de **desalineación** entre lo que el cliente pidió por correo y lo que queda registrado para **despacho y facturación**.

---

## 3. Cómo optimizar los procesos (línea recomendada: canal digital + sistema)

**Objetivo:** reducir fricción, acelerar respuestas y asegurar que **alcance, fechas y responsables** queden explícitos antes de despachar.

| Ámbito | Mejora |
|--------|--------|
| **Solicitud y cotización** | Portal o formulario web (y/o app interna) con **número de ticket**, datos del cliente, lista de equipos/cantidades, obra y fecha requerida. Estado visible: *recibido → en cotización → enviada → aceptada*. |
| **Prontitud y expectativas** | **SLAs publicados** (p. ej. primera respuesta en X horas hábiles, cotización en Y días según complejidad). Notificaciones automáticas al cliente en cada cambio de estado. |
| **Validación de alcance** | Checklist obligatorio: tipo de servicio (alquiler, venta, transporte), dirección de obra, restricciones de acceso, contacto en sitio. Evita cotizar o despachar **sin criterios completos**. |
| **Planos y modulación** | Carga de archivos al mismo **expediente del ticket**; versiones; comentarios; aprobación explícita del cliente antes de fabricar o despachar. |
| **Crédito** | Enlace al **formulario de vinculación** desde el mismo flujo; estado *documentación incompleta / en estudio / aprobado / condicionado*. |
| **Despacho** | No depender solo del correo: el **pedido confirmado** debe generar una **orden de despacho** en sistema (bodega, transporte, ventana horaria), con confirmación de entrega o remisión. |
| **Integración con back-office** | Cuando exista API o integración con **Siigo** y el módulo de alquiler, los datos del ticket alimentan **remisiones**, **obras** y **cortes** sin re-digitación desde correos. |

Esta línea convierte el correo en **canal complementario** (notificaciones, copias, documentos pesados), no en el **único sistema de registro**.

---

## 4. Segunda opción de solución: automatizaciones basadas en el correo que ya usan

Si no se desea (o no se puede) desplegar de inmediato un portal completo, se puede **ordenar la operación actual** sin abandonar los buzones actuales:

| Medida | Descripción |
|--------|-------------|
| **Buzones y reglas** | Reglas claras: *atencionalcliente@* solo cotizaciones; *soporte@* solo planos y técnicos; respuestas automáticas de **recibido** con número de caso interno. |
| **Plantillas de respuesta** | Textos estándar con plazos típicos y lista de datos faltantes para reducir idas y vueltas. |
| **Automatización ligera** | Flujos tipo Power Automate / Zapier / scripts: al llegar un correo con asunto o palabras clave, crear **fila en hoja de seguimiento** o **tarea en CRM/Trello**, asignar responsable y fecha objetivo. |
| **Confirmación por correo estructurado** | “Responder con este formato” para que un script o persona cargue datos a una tabla (cliente, NIT, obra, ítems). |
| **Integración mínima** | Exportación periódica de la tabla de casos hacia el área de **despacho** o hacia un CSV que alimente planillas ya usadas en **logística**. |

**Ventaja:** costo y tiempo de implementación menores. **Límite:** sigue existiendo **menos trazabilidad** que un sistema dedicado y el riesgo de **error humano** al copiar de correo a otros sistemas.

---

## 5. Recomendación

- **Mediano plazo:** priorizar un **canal digital con expediente** (ticket) para cotización, planos y seguimiento, con **órdenes de despacho** ligadas al mismo flujo.  
- **Corto plazo o transición:** implementar **automatizaciones sobre correo** + reglas de buzón + tabla de seguimiento para ganar **orden y medición** sin cambiar de un día el hábito del cliente.  
- **Coherencia interna:** alinear estos canales con la **robustez** que se requiere en el módulo de alquiler y en **Siigo**, de modo que lo que el cliente solicita quede **trazable hasta la remisión y la factura**.

---

*Documento elaborado para uso interno y alineación con estrategia de operación y atención al cliente.*
