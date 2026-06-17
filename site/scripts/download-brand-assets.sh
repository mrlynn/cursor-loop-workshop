#!/usr/bin/env bash
# Download Cursor presentation logos and painterly backgrounds into a Docusaurus site.
# Usage: ./download-brand-assets.sh /path/to/site/static/img

set -euo pipefail

IMG_DIR="${1:-}"
if [[ -z "$IMG_DIR" || ! -d "$(dirname "$IMG_DIR")" ]]; then
  echo "Usage: $0 /path/to/site/static/img" >&2
  exit 1
fi

CDN="https://lasrdtujxhb5vgsk.public.blob.vercel-storage.com/presentation-backgrounds"
mkdir -p "$IMG_DIR/backgrounds"

echo "Downloading logos..."
curl -sf -o "$IMG_DIR/cursor-logo-white.png" "$CDN/cursor-logo-white.png"
curl -sf -o "$IMG_DIR/cursor-logo-dark.png" "$CDN/cursor-logo-dark.png"
cp "$IMG_DIR/cursor-logo-dark.png" "$IMG_DIR/cursor-favicon.ico"

echo "Downloading backgrounds (bg_1 … bg_9)..."
for i in 1 2 3 4 5 6 7 8 9; do
  curl -sf -o "$IMG_DIR/backgrounds/bg_${i}.jpg" "$CDN/bg_${i}.jpg"
done

echo "Done. Assets in $IMG_DIR:"
ls -la "$IMG_DIR/cursor-logo-"*.png
ls -la "$IMG_DIR/backgrounds/"
