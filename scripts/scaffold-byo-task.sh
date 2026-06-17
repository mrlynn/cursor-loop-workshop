#!/usr/bin/env bash
# Scaffold a BYO loop task YAML in tasks/ and optional loop-runs stub.
# Usage: ./scripts/scaffold-byo-task.sh
#    or: ./scripts/scaffold-byo-task.sh --id my-bug-001 --verifier "pytest tests/foo.py -x"
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TASKS_DIR="$WORKSHOP_ROOT/tasks"
TEMPLATE="$TASKS_DIR/_template.yaml"

TASK_ID=""
VERIFIER=""
RUNG="2"
AREA="maintenance"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --id) TASK_ID="$2"; shift 2 ;;
    --verifier) VERIFIER="$2"; shift 2 ;;
    --rung) RUNG="$2"; shift 2 ;;
    --area) AREA="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: $0 [--id TASK] [--verifier CMD] [--rung N] [--area NAME]"
      exit 0
      ;;
    *) echo "Unknown: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$TASK_ID" ]]; then
  read -r -p "Task id (kebab-case): " TASK_ID
fi
if [[ -z "$TASK_ID" ]]; then
  echo "ERROR: task id required" >&2
  exit 1
fi

OUT="$TASKS_DIR/${TASK_ID}.yaml"
if [[ -f "$OUT" ]]; then
  echo "ERROR: already exists: $OUT" >&2
  exit 1
fi

if [[ -z "$VERIFIER" ]]; then
  read -r -p "Primary verifier command: " VERIFIER
fi

read -r -p "Seeded state (one sentence): " SEEDED
read -r -p "Regression gate (optional, Enter to skip): " REGRESSION

cp "$TEMPLATE" "$OUT"

# Portable sed
if [[ "$(uname)" == "Darwin" ]]; then
  SED=(-i '')
else
  SED=(-i)
fi

sed "${SED[@]}" "s/YOUR-TASK-ID/${TASK_ID}/g" "$OUT"
sed "${SED[@]}" "s/rung: 2/rung: ${RUNG}/" "$OUT"
sed "${SED[@]}" "s/YOUR-DOMAIN/${AREA}/" "$OUT"
sed "${SED[@]}" "s|YOUR-PRIMARY-VERIFIER-COMMAND|${VERIFIER}|" "$OUT"

if [[ -n "$SEEDED" ]]; then
  # Replace seeded_state placeholder line
  perl -i -pe "BEGIN{undef \$/;} s/seeded_state: >\\n  One sentence:.*/seeded_state: >\\n  ${SEEDED}/s" "$OUT" 2>/dev/null || \
    sed "${SED[@]}" "s/One sentence: what is broken.*/${SEEDED}/" "$OUT"
fi

if [[ -n "$REGRESSION" ]]; then
  sed "${SED[@]}" "s|YOUR-BROADER-TEST-SUITE-COMMAND|${REGRESSION}|" "$OUT"
  sed "${SED[@]}" "s|  - YOUR-LINT-OR-TYPECHECK-COMMAND||" "$OUT"
else
  sed "${SED[@]}" "s|  - YOUR-BROADER-TEST-SUITE-COMMAND||" "$OUT"
  sed "${SED[@]}" "s|  - YOUR-LINT-OR-TYPECHECK-COMMAND||" "$OUT"
fi

echo "==> Created $OUT"
echo "==> Next:"
echo "    1. Confirm verifier is RED on your seeded state"
echo "    2. ./scripts/copy-harness.sh /path/to/your-repo"
echo "    3. ./scripts/task-prompt.sh ${TASK_ID} --copy"
echo "    4. Add entry to tasks/index.json and tasks/README.md"
