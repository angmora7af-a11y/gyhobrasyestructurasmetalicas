# Hooks de control

Rutinas que se ejecutan **antes** (pre) y **después** (post) de las consultas o del uso del agente. Objetivos:

- **Seguridad**: validación de inputs, sanitización, límites de ejecución.
- **Aplicabilidad**: que el prompt/contexto se ajuste al rol y fase.
- **Ahorro de token**: recorte de contexto innecesario, resúmenes.
- **Contractualización y veracidad**: salida acotada al formato acordado; uso del ejemplo de referencia cuando se indique `@EJEMPLO`.

---

## Pre-Project Hook

**Cuándo:** Antes de iniciar cualquier tarea del agente.  
**Qué hace:** Valida que existan los artefactos mínimos de contexto.

- `claude.md`: instrucciones de contexto para el modelo (rol, alcance del proyecto).
- `architecture.md`: documentación detallada de la arquitectura (capas, flujos, contratos).

Si faltan, el hook debe **fallar** e indicar qué archivo falta (no iniciar la tarea sin ellos).

Ver: `hooks/pre-project-validate.md` y script `hooks/scripts/validate-pre-project.sh`.

---

## Post-Query Hook (KPIs)

**Cuándo:** Después de cada interacción con el agente.  
**Qué hace:** Actualizar o generar `kpi.txt` con métricas de la consulta.

Formato interno estándar:

```
[YYYY-MM-DD HH:mm] | Query: "<resumen de la consulta>" | Tokens: <número> | Status: SUCCESS|FAIL
```

Ejemplo:

```
[2024-05-20 14:00] | Query: "Generar Login Flutter" | Tokens: 1,250 | Status: SUCCESS
```

Ver: `hooks/post-query-kpi.md` y ejemplo `hooks/kpi.txt.example`.
