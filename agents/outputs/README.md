# Entregables de agentes (`agents/outputs/`)

| Archivo | Agente / rol | Descripción |
|:---|:---|:---|
| `backlog.md` | Gimena (HU writer) | Registro maestro HU-001…HU-026 |
| `HU_RUN-MVP-2026-03-24-all.md` | Gimena | Espejo de `hus/HU_RUN-MVP-2026-03-24-all.md` |
| `schedule.md` | gimena-scheduler | Hitos, fases, horas, recursos |
| `PROJECT-PLAN.md` | Gabi work planner | Plan técnico TDD y fases |
| `spec-kit/` | Spec-kit | Espejo histórico; la validación canónica vive en **`agents/spec-kit/`** |

**Canon:** las HUs viven en **`hus/`**; esta carpeta duplica para trazabilidad con el flujo de agentes.

---

Ejecutar validación (desde la raíz del repo):

```bash
./spec-kit/validate.sh
./agents/spec-kit/validate.sh
./agents/outputs/spec-kit/validate.sh
```
