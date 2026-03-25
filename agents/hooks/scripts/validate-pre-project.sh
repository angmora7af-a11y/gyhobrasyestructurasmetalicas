#!/usr/bin/env bash
# Pre-Project Hook: valida existencia de claude.md y architecture.md
# Uso: desde la raíz del proyecto: ./hooks/scripts/validate-pre-project.sh
# Salida: 0 si todo OK; 1 si falta algún archivo (mensaje en stderr)

set -e
ROOT="${1:-.}"
MISSING=()

if [[ ! -f "$ROOT/claude.md" ]]; then
  MISSING+=( "claude.md" )
fi
if [[ ! -f "$ROOT/architecture.md" ]]; then
  MISSING+=( "architecture.md" )
fi

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo "Pre-Project Hook: faltan los siguientes archivos: ${MISSING[*]}" >&2
  exit 1
fi
echo "Pre-Project Hook: claude.md y architecture.md presentes."
exit 0
