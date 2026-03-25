# Hooks Contract (Contrato de Automatización)

Este documento describe cómo deben comportarse los hooks definidos en `hooks/` cuando se ejecutan como “control” alrededor de consultas a agentes.

## Pre-Project Hook

- Archivo fuente: `hooks/pre-project-validate.md`
- Script: `hooks/scripts/validate-pre-project.sh`
- Objetivo:
  - Verificar existencia de contexto mínimo antes de iniciar tareas.
- Reglas:
  - Debe validar `claude.md`
  - Debe validar `architecture.md`
  - Si falta alguno, debe fallar con mensaje explícito.

## Post-Query Hook (KPIs)

- Archivo fuente: `hooks/post-query-kpi.md`
- Ejemplo: `hooks/kpi.txt.example`
- Objetivo:
  - Registrar trazabilidad de consumo (tokens), query y status.

## KPI Formato Estándar

```
[YYYY-MM-DD HH:mm] | Query: "<resumen de la consulta>" | Tokens: <número> | Status: SUCCESS|FAIL
```

## Contratos adicionales (para ahorrar token y contractualizar)

El “contract” del agente se respeta así:

- El hook debe ejecutar un recorte previo (cuando aplique) para:
  - eliminar redundancia
  - incluir solo el contexto obligatorio del agente
  - no incluir materiales que no afectan el output
- La salida del agente debe incluir:
  - el formato requerido
  - los entregables verificables (URLs, reportes, listas de módulos/hitos, etc.)

