#!/usr/bin/env bash
# Spec-kit: valida presencia de artefactos de planificación y HUs.
# Ejecutar desde cualquier subcarpeta: ./spec-kit/validate.sh o ./agents/outputs/spec-kit/validate.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT=""
for cand in "$SCRIPT_DIR/.." "$SCRIPT_DIR/../.." "$SCRIPT_DIR/../../.."; do
  if [[ -f "$cand/hus/INDEX.md" ]]; then
    ROOT="$(cd "$cand" && pwd)"
    break
  fi
done
if [[ -z "${ROOT}" ]]; then
  echo "No se encontró hus/INDEX.md subiendo desde $SCRIPT_DIR"
  exit 1
fi
cd "$ROOT"

ERR=0

echo "== Spec-kit validation (gyhobras) — ROOT=$ROOT =="

check_file() {
  if [[ -f "$1" ]]; then
    echo "  ✓ $1"
  else
    echo "  ✗ MISSING: $1"
    ERR=1
  fi
}

check_dir() {
  if [[ -d "$1" ]]; then
    echo "  ✓ $1/"
  else
    echo "  ✗ MISSING DIR: $1"
    ERR=1
  fi
}

check_dir "hus"
check_file "hus/INDEX.md"
check_file "hus/HU_RUN-MVP-2026-03-24-all.md"
check_file "pdr/PDR-02-functional-requirements.md"
check_file "pdr/PDR-06-module-specs-and-delivery-order.md"
check_file "spec-kit/TRACEABILITY.md"
check_file "agents/outputs/backlog.md"

HU_COUNT=$(grep -c '^# HU-[0-9]' hus/HU_RUN-MVP-2026-03-24-all.md 2>/dev/null || echo 0)
echo "  → HUs detectadas en maestro: $HU_COUNT (esperado 26)"

if [[ "$HU_COUNT" -lt 26 ]]; then
  echo "  ✗ Se esperaban 26 secciones HU-###"
  ERR=1
fi

if [[ $ERR -eq 0 ]]; then
  echo "== OK =="
else
  echo "== FALLÓ — revisar artefactos =="
  exit 1
fi
