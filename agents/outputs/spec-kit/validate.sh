#!/usr/bin/env bash
# Copia del spec-kit — delega en la raíz del repo (detecta hus/INDEX.md).
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
  echo "No se encontró hus/INDEX.md"
  exit 1
fi
exec "$ROOT/spec-kit/validate.sh"
