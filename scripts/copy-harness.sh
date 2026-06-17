#!/usr/bin/env bash
# Copy loop harness (.cursor/rules + .cursor/skills) into a lab repo.
# Usage: ./scripts/copy-harness.sh /path/to/atlas-oms
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <lab-repo-path>" >&2
  echo "Example: $0 ../atlas-oms" >&2
  exit 1
fi

LAB_REPO="$(cd "$1" && pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SRC_CURSOR="$WORKSHOP_ROOT/.cursor"
DEST_CURSOR="$LAB_REPO/.cursor"

if [[ ! -d "$SRC_CURSOR" ]]; then
  echo "ERROR: No .cursor/ in workshop root: $WORKSHOP_ROOT" >&2
  exit 1
fi

mkdir -p "$DEST_CURSOR/rules" "$DEST_CURSOR/skills" "$DEST_CURSOR/commands"

echo "==> Copying loop rules..."
cp -R "$SRC_CURSOR/rules/"* "$DEST_CURSOR/rules/"

echo "==> Copying loop skills..."
cp -R "$SRC_CURSOR/skills/"* "$DEST_CURSOR/skills/"

if [[ -d "$SRC_CURSOR/commands" ]] && [[ -n "$(ls -A "$SRC_CURSOR/commands" 2>/dev/null)" ]]; then
  echo "==> Copying slash commands..."
  cp -R "$SRC_CURSOR/commands/"* "$DEST_CURSOR/commands/"
fi

# Suggest .cursorignore entries if missing
IGNORE_FILE="$LAB_REPO/.cursorignore"
if [[ ! -f "$IGNORE_FILE" ]]; then
  cat > "$IGNORE_FILE" <<'EOF'
.env
.env.*
!.env.example
loop-runs/
EOF
  echo "==> Created $IGNORE_FILE"
else
  echo "==> $IGNORE_FILE exists — ensure .env and loop-runs/ are ignored"
fi

mkdir -p "$LAB_REPO/loop-runs"
touch "$LAB_REPO/loop-runs/.gitkeep"

echo "==> Harness installed in $LAB_REPO"
echo "    Rules:    $(ls "$DEST_CURSOR/rules" | tr '\n' ' ')"
echo "    Skills:   $(ls "$DEST_CURSOR/skills" | tr '\n' ' ')"
if [[ -d "$DEST_CURSOR/commands" ]]; then
  echo "    Commands: $(ls "$DEST_CURSOR/commands" 2>/dev/null | tr '\n' ' ')"
fi
