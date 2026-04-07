#!/usr/bin/env bash
# Guardian de estabilidad: API pytest + web lint + web tests.
# Salida en consola y en guardian-check.log (raíz del repo). Código de salida != 0 si algo falla.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="${GUARDIAN_LOG:-$ROOT/guardian-check.log}"
export ROOT LOG

{
  echo "=== guardian-check $(date -u +"%Y-%m-%dT%H:%M:%SZ") ==="
  echo "root: $ROOT"
} | tee "$LOG"

ec=0

run_step() {
  local title="$1"
  shift
  echo "" | tee -a "$LOG"
  echo "== $title ==" | tee -a "$LOG"
  if "$@" 2>&1 | tee -a "$LOG"; then
    echo "(ok) $title" | tee -a "$LOG"
  else
    echo "(FAIL) $title" | tee -a "$LOG"
    ec=1
  fi
}

if [[ ! -x "$ROOT/apps/api/.venv/bin/python" ]]; then
  echo "ERROR: falta apps/api/.venv (crea el venv e instala dependencias)." | tee -a "$LOG"
  ec=1
else
  run_step "API pytest" bash -c 'cd "$ROOT/apps/api" && .venv/bin/python -m pytest tests/ -q --tb=short'
fi

if [[ ! -d "$ROOT/apps/web/node_modules" ]]; then
  echo "WARN: apps/web/node_modules no existe; ejecuta npm install en apps/web." | tee -a "$LOG"
  ec=1
else
  run_step "Web eslint" bash -c 'cd "$ROOT/apps/web" && npm run lint'
  run_step "Web vitest" bash -c 'cd "$ROOT/apps/web" && npm run test'
fi

echo "" | tee -a "$LOG"
echo "=== fin (exit $ec) log: $LOG ===" | tee -a "$LOG"
exit "$ec"
