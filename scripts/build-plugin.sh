#!/usr/bin/env bash
# Assemble plugin/ distributable from .cursor harness (rules, skills, commands).
# Usage: ./scripts/build-plugin.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PLUGIN_DIR="$WORKSHOP_ROOT/plugin"
SRC="$WORKSHOP_ROOT/.cursor"

rm -rf "$PLUGIN_DIR/rules" "$PLUGIN_DIR/skills" "$PLUGIN_DIR/commands"
mkdir -p "$PLUGIN_DIR/.cursor-plugin" "$PLUGIN_DIR/rules" "$PLUGIN_DIR/skills" "$PLUGIN_DIR/commands"

cp -R "$SRC/rules/"* "$PLUGIN_DIR/rules/"
cp -R "$SRC/skills/"* "$PLUGIN_DIR/skills/"
if [[ -d "$SRC/commands" ]]; then
  cp -R "$SRC/commands/"* "$PLUGIN_DIR/commands/"
fi

# plugin.json is maintained in plugin/.cursor-plugin/ — verify version sync
echo "==> Plugin bundle built at plugin/"
echo "    Rules:    $(ls "$PLUGIN_DIR/rules" | wc -l | tr -d ' ') files"
echo "    Skills:   $(ls "$PLUGIN_DIR/skills" | wc -l | tr -d ' ') dirs"
echo "    Commands: $(ls "$PLUGIN_DIR/commands" 2>/dev/null | wc -l | tr -d ' ') files"
echo ""
echo "Local install:"
echo "  ln -sf \"$PLUGIN_DIR\" ~/.cursor/plugins/local/loop-engineering"
echo "  # Restart Cursor → Settings → Plugins → enable Loop Engineering"
