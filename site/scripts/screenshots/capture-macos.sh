#!/usr/bin/env bash
# Semi-automated Cursor IDE screenshots for Docusaurus workshop docs (macOS).
#
# Usage:
#   ./capture-macos.sh --list
#   ./capture-macos.sh --all
#   ./capture-macos.sh --scene indexing-status-bar
#   ./capture-macos.sh --all --yes --site-root /path/to/site
#
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "capture-macos.sh requires macOS." >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "Installing screenshot script dependencies..."
  npm install --no-fund --no-audit
fi

exec node lib/run-scenes.mjs "$@"
