#!/usr/bin/env bash
# V2 comparison harness stub — run prompt-only vs agent loop vs background (A/B/C).
# V0 workshops: run arms manually in Cursor IDE; append logs with --log-only.
#
# Usage:
#   ./scripts/loop-harness.sh --task oms-status-race-001 --method B --log loop-runs/run.json
#   ./scripts/loop-harness.sh --task oms-status-race-001 --method B --log-only --pass true --iterations 4
#
# :::caution VERIFY — cursor-agent flags against cursor.com/docs/cli before production use.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TASKS_DIR="$WORKSHOP_ROOT/tasks"

TASK_ID=""
METHOD=""
LOG_PATH=""
LOG_ONLY=false
PASS=""
ITERATIONS=""
HUMAN_INTERVENTIONS=""
REGRESSIONS="0"
LAB_REPO=""

usage() {
  cat <<EOF
Loop Engineering comparison harness (V2 stub)

  --task ID          Task id matching tasks/<id>.yaml
  --method A|B|C     A=prompt-only, B=agent loop, C=background
  --log PATH         Write FR-4 metric JSON to PATH
  --lab-repo PATH    Lab checkout (default: ./atlas-oms or ../atlas-oms)
  --log-only         Append metrics without invoking cursor-agent (manual runs)
  --pass true|false  Required with --log-only
  --iterations N     Iterations to green (arm B/C)
  --interventions N  Human interventions count
  --regressions N    Regression count (default 0)

Examples:
  ./scripts/loop-harness.sh --task oms-status-race-001 --method B \\
    --log-only --pass true --iterations 4 --interventions 0 \\
    --log loop-runs/oms-status-race-001-manual.json

  ./scripts/loop-harness.sh --task oms-status-race-001 --method B \\
    --log loop-runs/run.json --lab-repo ../atlas-oms
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --task) TASK_ID="$2"; shift 2 ;;
    --method) METHOD="$2"; shift 2 ;;
    --log) LOG_PATH="$2"; shift 2 ;;
    --lab-repo) LAB_REPO="$2"; shift 2 ;;
    --log-only) LOG_ONLY=true; shift ;;
    --pass) PASS="$2"; shift 2 ;;
    --iterations) ITERATIONS="$2"; shift 2 ;;
    --interventions) HUMAN_INTERVENTIONS="$2"; shift 2 ;;
    --regressions) REGRESSIONS="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

if [[ -z "$TASK_ID" || -z "$METHOD" ]]; then
  echo "ERROR: --task and --method are required" >&2
  usage
  exit 1
fi

TASK_FILE="$TASKS_DIR/${TASK_ID}.yaml"
if [[ ! -f "$TASK_FILE" ]]; then
  echo "ERROR: Task spec not found: $TASK_FILE" >&2
  exit 1
fi

if [[ -z "$LOG_PATH" ]]; then
  mkdir -p "$WORKSHOP_ROOT/loop-runs"
  LOG_PATH="$WORKSHOP_ROOT/loop-runs/${TASK_ID}-$(date +%s).json"
fi

mkdir -p "$(dirname "$LOG_PATH")"

if [[ "$LOG_ONLY" == true ]]; then
  if [[ -z "$PASS" ]]; then
    echo "ERROR: --log-only requires --pass true|false" >&2
    exit 1
  fi
  cat > "$LOG_PATH" <<EOF
{
  "task_id": "$TASK_ID",
  "method": "$METHOD",
  "pass": $PASS,
  "pass_at_1": false,
  "iterations_to_green": ${ITERATIONS:-null},
  "human_interventions": ${HUMAN_INTERVENTIONS:-null},
  "wall_clock_seconds": null,
  "token_cost_usd": null,
  "regression_count": $REGRESSIONS,
  "harness_version": "v0-manual",
  "recorded_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
  echo "==> Logged metrics to $LOG_PATH"
  exit 0
fi

# Automated path (V2) — requires cursor-agent in PATH
if ! command -v cursor-agent >/dev/null 2>&1; then
  echo "ERROR: cursor-agent not found. Install via cursor.com/docs/cli" >&2
  echo "       For V0, run the loop in IDE and use --log-only instead." >&2
  exit 1
fi

if [[ -z "$LAB_REPO" ]]; then
  for candidate in "./atlas-oms" "../atlas-oms" "$WORKSHOP_ROOT/../atlas-oms"; do
    if [[ -d "$candidate" ]]; then
      LAB_REPO="$(cd "$candidate" && pwd)"
      break
    fi
  done
fi

if [[ -z "$LAB_REPO" || ! -d "$LAB_REPO" ]]; then
  echo "ERROR: Lab repo not found. Pass --lab-repo /path/to/atlas-oms" >&2
  exit 1
fi

echo "==> V2 automated harness not yet implemented."
echo "    Task:     $TASK_ID"
echo "    Method:   $METHOD"
echo "    Lab repo: $LAB_REPO"
echo "    Task spec: $TASK_FILE"
echo ""
echo "    Run manually in Cursor Agent mode with @loop-discipline and /loop-engineering,"
echo "    then log results:"
echo "      $0 --task $TASK_ID --method $METHOD --log-only --pass true --iterations N --log $LOG_PATH"
exit 2
