#!/usr/bin/env bash
# Genera un Markdown de implementación por rama hus/* (commits vs main).
# Uso: desde la raíz del repo, con historial completo (fetch-depth: 0 en CI).

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

BRANCH="${GITHUB_REF_NAME:-$(git branch --show-current 2>/dev/null || true)}"
if [[ -z "$BRANCH" ]]; then
  echo "No se pudo determinar la rama (GITHUB_REF_NAME o branch actual)." >&2
  exit 1
fi

# Slug seguro para nombre de archivo: hus/HU-001-x -> hu-001-x
SLUG=$(echo "$BRANCH" | sed 's#^hus/##' | tr '/' '-' | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9._-' '-' | sed 's/^-//;s/-$//')
if [[ -z "$SLUG" ]]; then
  SLUG="branch"
fi

git fetch origin main 2>/dev/null || git fetch origin refs/heads/main:refs/remotes/origin/main 2>/dev/null || true

if git show-ref --verify --quiet refs/remotes/origin/main; then
  MAIN_REF="origin/main"
elif git show-ref --verify --quiet refs/heads/main; then
  MAIN_REF="main"
else
  echo "No se encontró main (local ni origin/main)." >&2
  exit 1
fi

BASE=$(git merge-base HEAD "$MAIN_REF" 2>/dev/null || true)
if [[ -z "$BASE" ]]; then
  echo "No hay merge-base con $MAIN_REF." >&2
  exit 1
fi

OUT_DIR="agents/outputs/hus-implementations"
mkdir -p "$OUT_DIR"
OUT_FILE="$OUT_DIR/${SLUG}.md"

RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-}/actions/runs/${GITHUB_RUN_ID:-}"
COMMIT_SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
COMMIT_SHORT=$(git rev-parse --short HEAD)

{
  cat <<EOF
# Implementación — \`${BRANCH}\`

**Generado:** $(date -u +"%Y-%m-%dT%H:%M:%SZ") (UTC)  
**Rama:** \`${BRANCH}\`  
**HEAD:** \`${COMMIT_SHORT}\` (\`${COMMIT_SHA}\`)  
**Base vs:** \`${MAIN_REF}\` (\`$(git rev-parse --short "$BASE")\`)

EOF
  if [[ -n "${GITHUB_RUN_ID:-}" ]]; then
    echo "**Workflow run:** [${GITHUB_RUN_ID}](${RUN_URL})"
    echo ""
  fi

  cat <<'EOF'
## Resumen de commits (desde divergencia con `main`)

EOF
  git log "$BASE"..HEAD --pretty=format:'- **%h** — %s *(autor: %an)*' --no-merges

  cat <<'EOF'


## Detalle (mensajes completos)

EOF
  git log "$BASE"..HEAD --pretty=format:'### %h %s%n%n%b%n---%n' --no-merges

  cat <<'EOF'

## Archivos tocados

EOF
  git diff --name-status "$BASE"..HEAD || true

} >"$OUT_FILE"

echo "Escrito: $OUT_FILE"
test -s "$OUT_FILE"
