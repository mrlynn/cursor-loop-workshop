#!/usr/bin/env bash
# Clone cursor-loop-workshop + atlas-oms lab repo side by side.
# Usage: ./scripts/setup-workshop.sh [target-directory]
set -euo pipefail

TARGET_DIR="${1:-$HOME/code/loop-workshop}"
WORKSHOP_REPO="${WORKSHOP_REPO:-https://github.com/mrlynn/cursor-loop-workshop.git}"
WORKSHOP_DIR="${WORKSHOP_DIR:-cursor-loop-workshop}"
LAB_REPO="${ATLAS_OMS_REPO:-https://github.com/cursor-education/atlas-oms.git}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

echo "==> Target directory: $TARGET_DIR"

# Workshop repo — copy local checkout when running from this repo; else clone
if [[ -d "$WORKSHOP_DIR" ]]; then
  echo "==> $WORKSHOP_DIR/ already exists — skipping"
elif [[ -d loop-engineering ]]; then
  echo "==> loop-engineering/ exists (legacy name) — skipping"
  WORKSHOP_DIR=loop-engineering
elif [[ "${USE_LOCAL_COPY:-}" == "1" ]] \
     || git -C "$WORKSHOP_ROOT" remote get-url origin 2>/dev/null | grep -q 'cursor-loop-workshop'; then
  echo "==> Copying workshop from local checkout: $WORKSHOP_ROOT"
  cp -R "$WORKSHOP_ROOT" "$WORKSHOP_DIR"
  rm -rf "$WORKSHOP_DIR/site/node_modules" "$WORKSHOP_DIR/site/build" "$WORKSHOP_DIR/site/.docusaurus" 2>/dev/null || true
else
  echo "==> Cloning workshop from $WORKSHOP_REPO"
  git clone "$WORKSHOP_REPO" "$WORKSHOP_DIR"
fi

# Lab substrate (separate repo per PRD §6.1)
if [[ -d atlas-oms ]]; then
  echo "==> atlas-oms/ already exists — skipping clone"
else
  echo "==> Cloning lab substrate: $LAB_REPO"
  echo "    (Override with ATLAS_OMS_REPO=... if your fork URL differs)"
  if git clone "$LAB_REPO" atlas-oms 2>/dev/null; then
    :
  else
    echo "WARN: Could not clone atlas-oms. Use BYO.md or bring-your-own-repo — no lab required."
    echo "      Create an empty atlas-oms/ directory and clone manually if you need facilitated labs."
    mkdir -p atlas-oms
  fi
fi

echo ""
echo "==> Next steps"
echo "  1. cd $WORKSHOP_DIR/site && npm install && npm run start"
echo "  2. Copy harness:  ./$WORKSHOP_DIR/scripts/copy-harness.sh ../atlas-oms"
echo "     Or BYO:         make -C $WORKSHOP_DIR install-plugin  →  /byo-loop-task in your repo"
echo "  3. Facilitated lab only — checkout task branch, e.g.:"
echo "       cd atlas-oms && git checkout workshop/oms-status-race-001"
echo "  4. Open atlas-oms (or your repo) in Cursor; confirm verifier is RED before the lab."
