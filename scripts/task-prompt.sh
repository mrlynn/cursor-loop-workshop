#!/usr/bin/env bash
# Emit a copy-paste Agent prompt from a task YAML spec.
# Usage: ./scripts/task-prompt.sh <task_id> [--copy]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TASKS_DIR="$WORKSHOP_ROOT/tasks"

list_tasks() {
  echo "Available tasks:"
  for f in "$TASKS_DIR"/*.yaml; do
    [[ -f "$f" ]] || continue
    base="$(basename "$f" .yaml)"
    rung="$(grep -E '^rung:' "$f" | head -1 | sed 's/rung: *//')"
    echo "  - $base (rung $rung)"
  done
}

if [[ $# -lt 1 || "$1" == "--list" || "$1" == "-l" ]]; then
  list_tasks
  exit 0
fi

TASK_ID="$1"
COPY=false
[[ "${2:-}" == "--copy" ]] && COPY=true

TASK_FILE="$TASKS_DIR/${TASK_ID}.yaml"
if [[ ! -f "$TASK_FILE" ]]; then
  echo "ERROR: Unknown task: $TASK_ID" >&2
  list_tasks >&2
  exit 1
fi

# Lightweight YAML read (avoid requiring yq)
read_field() {
  local key="$1"
  grep -E "^${key}:" "$TASK_FILE" | head -1 | sed "s/^${key}: *//" | sed 's/^> *//' | tr -d '\r'
}

TASK_ID_VAL="$(read_field task_id)"
RUNG="$(read_field rung)"
AREA="$(read_field area)"
VERIFIER="$(read_field verifier)"

SEEDED="$(awk '/^seeded_state:/{flag=1; sub(/^seeded_state: *>? */, ""); if(length) print; next} flag && /^[^ ]/{flag=0} flag && /^  /{sub(/^  /,""); print}' "$TASK_FILE" | tr '\n' ' ' | sed 's/  */ /g' | sed 's/ $//')"

COMMON_FAILS="$(awk '/^common_fails:/{flag=1; sub(/^common_fails: *>? */, ""); if(length) print; next} flag && /^[^ ]/{flag=0} flag && /^  /{sub(/^  /,""); print}' "$TASK_FILE" | tr '\n' ' ' | sed 's/  */ /g' | sed 's/ $//')"

MAX_ITER="$(grep -E 'max_iterations:' "$TASK_FILE" | head -1 | sed 's/.*max_iterations: *//')"
BLOCKED="$(grep -E 'blocked_after_same_error:' "$TASK_FILE" | head -1 | sed 's/.*blocked_after_same_error: *//')"

REGRESSION=""
while IFS= read -r line; do
  gate="$(echo "$line" | sed 's/^  - //')"
  REGRESSION="${REGRESSION}${gate}"$'\n'
done < <(grep -A 20 '^regression_gates:' "$TASK_FILE" | tail -n +2 | grep '  - ')

PROMPT="@loop-discipline @loop-termination @loop-safety

/loop-engineering

Task: ${TASK_ID_VAL}
Rung: ${RUNG}
Area: ${AREA}

Seeded state: ${SEEDED}

Verifier (run after EVERY edit):
  ${VERIFIER}

Regression gates (required before done):
${REGRESSION}
Budget: ${MAX_ITER:-8} iterations. Stop if blocked ${BLOCKED:-3}x on same error.

Common failure mode to avoid: ${COMMON_FAILS}"

if $COPY; then
  if command -v pbcopy >/dev/null 2>&1; then
    printf '%s' "$PROMPT" | pbcopy
    echo "Copied prompt for $TASK_ID to clipboard."
  else
    echo "$PROMPT"
    echo "---" >&2
    echo "pbcopy not found; prompt printed above." >&2
  fi
else
  echo "$PROMPT"
fi
