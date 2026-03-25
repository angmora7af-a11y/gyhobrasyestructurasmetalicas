# Post-Query Hook: KPIs (kpi.txt)

**Tipo:** Post-query  
**Fase/Agente:** Todos. Se ejecuta después de cada interacción con el agente.  
**Garantiza:** Trazabilidad, ahorro de token (visibilidad de consumo), contractualización (registro de consulta y resultado).

---

## Objetivo

Después de cada interacción, generar o actualizar un archivo **kpi.txt** con el siguiente formato interno para asegurar consistencia:

```
[YYYY-MM-DD HH:mm] | Query: "<resumen de la consulta>" | Tokens: <número> | Status: SUCCESS|FAIL
```

---

## Campos

| Campo | Descripción |
|-------|-------------|
| **Fecha/hora** | `YYYY-MM-DD HH:mm` (ej. 2024-05-20 14:00). |
| **Query** | Resumen breve de la consulta (entre comillas). Ej: "Generar Login Flutter". |
| **Tokens** | Número de tokens consumidos en la interacción. |
| **Status** | `SUCCESS` o `FAIL` según resultado de la tarea. |

---

## Ejemplo

```
[2024-05-20 14:00] | Query: "Generar Login Flutter" | Tokens: 1,250 | Status: SUCCESS
[2024-05-20 14:15] | Query: "Revisar seguridad login (Auditor)" | Tokens: 890 | Status: SUCCESS
```

---

## Uso

- Las herramientas que invocan al agente deben escribir o append esta línea en `kpi.txt` tras cada consulta.
- Opcional: agregar referencia al ejemplo cuando se use `@EJEMPLO` (ej. en un comentario o campo extra documentado).
- El archivo puede vivir en la raíz del proyecto o en una ruta configurable (ej. `.claude/kpi.txt`); documentar la ruta en el README del proyecto.
