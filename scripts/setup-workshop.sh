#!/usr/bin/env bash
# Clone loop-engineering workshop + atlas-oms lab repo side by side.
# Usage: ./scripts/setup-workshop.sh [target-directory]
set -euo pipefail

TARGET_DIR="${1:-$HOME/code/loop-workshop}"
WORKSHOP_REPO="${WORKSHOP_REPO:-}" # set when published; empty = use parent of this script
LAB_REPO="${ATLAS_OMS_REPO:-https://github.com/cursor-education/atlas-oms.git}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

echo "==> Target directory: $TARGET_DIR"

# Workshop repo — copy from local checkout if WORKSHOP_REPO unset
if [[ -d loop-engineering ]]; then
  echo "==> loop-engineering/ already exists — skipping"
else
  if [[ -n "$WORKSHOP_REPO" ]]; then
    echo "==> Cloning workshop from $WORKSHOP_REPO"
    git clone "$WORKSHOP_REPO" loop-engineering
  else
    echo "==> Copying workshop from local tree: $WORKSHOP_ROOT"
    cp -R "$WORKSHOP_ROOT" loop-engineering
    rm -rf loop-engineering/site/node_modules loop-engineering/site/build loop-engineering/site/.docusaurus 2>/dev/null || true
  fi
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
    echo "WARN: Could not clone atlas-oms. Ask your facilitator for the lab repo URL."
    echo "      Create an empty atlas-oms/ directory and clone manually before the lab."
    mkdir -p atlas-oms
  fi
fi

echo ""
echo "==> Next steps"
echo "  1. cd loop-engineering/site && npm install && npm run start"
echo "  2. Copy harness:  ./loop-engineering/scripts/copy-harness.sh ../atlas-oms"
echo "  3. Checkout lab task branch (facilitator provides), e.g.:"
echo "       cd atlas-oms && git checkout workshop/oms-status-race-001"
echo "  4. Open atlas-oms in Cursor and confirm verifier is RED before the lab."
