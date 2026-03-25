# Caso de negocio del cliente

## Contexto

El negocio combina **alquiler de equipos** para construcción (andamios, tableros, parales, alineadores, etc.) con **venta** de productos terminados. La operación cotidiana implica **movimientos físicos** (salida y regreso de equipos), **obras y sucursales por cliente**, y **valorización por tiempo** (p. ej. valor por día de alquiler), no solo un registro puntual de venta.

La empresa de referencia en la documentación es **G&H OBRAS Y ESTRUCTURAS METÁLICAS S.A.S.** (Bogotá). En operación coexisten el software contable **Siigo** (facturación electrónica y contabilidad) y un **módulo externo** orientado al **manejo de alquiler de inventarios** (interfaz asociada a **ALFOREQUIPOS S.A.S.** en las capturas de pantalla), que cubre lo que el ERP por sí solo no modela bien: **tiempos, movimientos, remisiones y devoluciones**.

---

## Modelo operativo (flujo de negocio)

1. **Salida del equipo**  
   Se elabora una **remisión** que se registra y/o integra hacia **Siigo**. A partir de ahí queda trazado **qué equipo** está en **qué obra/lugar**, con **valor de alquiler por día** (u otra unidad acordada).

2. **Período en obra**  
   El equipo permanece asociado al cliente/obra; el negocio necesita saber en todo momento **saldos** y movimientos (no solo “se vendió una vez”).

3. **Corte para facturar**  
   La **devolución** del equipo a la empresa es el **momento de corte**: con el documento de regreso se cierra el ciclo respecto al cual se **liquida cuántos días** estuvo el equipo en obra y se procede a **facturar** ese periodo.

4. **Facturación**  
   La **facturación electrónica** se hace en **Siigo**; el módulo de alquiler aporta la lógica operativa y los datos de **movimientos** que alimentan revisión, proformas y luego la factura (coherente con el manual ML-FA-001: inventario de movimientos, punteo remisión vs devolución, aprobación del cliente, registro en Siigo).

5. **Conciliación con el cliente**  
   Para cada cliente, el área debe revisar **archivos tipo listado/kardex** (p. ej. PDF o exportaciones con remisiones, devoluciones y **saldo**) para **establecer el saldo** y **poder facturar** con respaldo frente al cliente.

---

## Problemas actuales (oportunidad de mejora)

| Problema | Impacto |
|----------|---------|
| El **módulo de alquiler borra información** | Pérdida de trazabilidad, reprocesos y riesgo de discrepancias con Siigo y con el cliente. |
| **Todos los usuarios tienen todos los permisos** | Cualquiera puede alterar datos sensibles; en la práctica se puede **modificar kardex** y otra información crítica. Las **facturas electrónicas** están más protegidas en Siigo y no se alteran igual que el resto. |
| **Desgaste operativo** | Por cada cliente hay que revisar **archivos pesados** (p. ej. PDF de kardex) para saber **qué saldo** lleva antes de facturar; proceso lento y propenso a error si los datos no están centralizados ni auditados. |

---

## Objetivos de negocio de una solución (desarrollo especial)

- **Integridad**: evitar borrados o cambios no autorizados; historial claro de remisiones, devoluciones y saldos.  
- **Seguridad**: **roles y permisos** granulares (p. ej. separar consulta, despacho, ajustes supervisados y facturación).  
- **Alineación con Siigo**: el sistema de alquiler debe alimentar de forma confiable los insumos que facturación ya valida en Siigo (movimientos, cortes, proformas), sin duplicar la facturación electrónica fuera del ERP.  
- **Eficiencia**: reducir la dependencia de **revisión manual de PDF/Excel** por cliente cuando el saldo y los movimientos puedan consultarse de forma **consistente y exportable** desde un solo lugar.

---

## Resumen ejecutivo

El cliente necesita un desarrollo **especializado en alquiler por tiempos y movimientos** porque Siigo cubre bien **venta contable y facturación electrónica**, pero el **ciclo remisión → obra → devolución → liquidación de días → factura** requiere un módulo robusto. Las **dolencias principales** son **pérdida de datos**, **falta de control de permisos** sobre kardex y procesos, y **carga operativa** al validar saldos cliente por cliente mediante archivos tipo PDF. Una nueva solución debe preservar la relación con **Siigo** y resolver **trazabilidad, seguridad y usabilidad** en el núcleo de alquiler.
