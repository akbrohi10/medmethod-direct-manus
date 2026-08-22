#!/usr/bin/env bash
set -euo pipefail

IMAGE_ARCHIVE="${1:-medmethod-public-assets.zip}"
VIDEO_ARCHIVE="${2:-medmethod-large-video.zip}"
TARGET="client/public/manus-storage"

mkdir -p "$TARGET"

if [[ ! -f "$IMAGE_ARCHIVE" ]]; then
  echo "Missing $IMAGE_ARCHIVE" >&2
  exit 1
fi

unzip -j -o "$IMAGE_ARCHIVE" 'files/*' -d "$TARGET"

if [[ -f "$VIDEO_ARCHIVE" ]]; then
  unzip -j -o "$VIDEO_ARCHIVE" 'files/*' -d "$TARGET"
else
  echo "Large video archive not supplied; the consultation video will remain unavailable until migrated." >&2
fi

echo "Installed $(find "$TARGET" -maxdepth 1 -type f | wc -l) public assets into $TARGET"
