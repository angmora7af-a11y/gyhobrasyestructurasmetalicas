# Spec-kit — Validación PDR ↔ HU ↔ Pruebas

> **Documentación ampliada (metodología IA Hybrid Teams + contratos por fase):** ver [`../agents/spec-kit/README.md`](../agents/spec-kit/README.md) y [`../agents/INDEX.md`](../agents/INDEX.md).

**Propósito:** asegurar que cada entrega del MVP G&H sea **trazable** a requisitos (`pdr/PDR-02`) y **validable** con criterios explícitos.

## Contenido

| Archivo | Uso |
|:---|:---|
| [TRACEABILITY.md](./TRACEABILITY.md) | Matriz FR → HU → tipo de prueba (API/E2E/manual) |
| [VALIDATION-PROTOCOL.md](./VALIDATION-PROTOCOL.md) | Cómo dar por “hecha” una HU en UAT y en CI |
| [validate.sh](./validate.sh) | Script de comprobación de artefactos (existencia de `hus/`, `INDEX` coherente) |

## Flujo recomendado

1. Antes de desarrollar una HU: confirmar **FR** en `TRACEABILITY.md`.
2. Al implementar: tests según columna “pytest/API” o checklist manual.
3. Antes de release: ejecutar `./spec-kit/validate.sh` desde la raíz del repo.

## Relación con agentes

| Agente | Entregable | Validación |
|:---|:---|:---|
| Gimena (HU writer) | `hus/*.md` | Cada HU tiene AC → casos de prueba |
| Gabi (work planner) | plan por HU → `agents/outputs/` | TDD según plan |
| Scheduler | `agents/outputs/schedule.md` | Hitos alineados a `pdr/PDR-06` |

---

*Mantener `TRACEABILITY.md` al añadir o cambiar HUs.*
