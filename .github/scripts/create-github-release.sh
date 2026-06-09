#!/bin/bash

set -euo pipefail

PRERELEASE_FLAG=""
if [ "$IS_PRERELEASE" = "true" ]; then
  PRERELEASE_FLAG="--prerelease"
fi
RELEASE_URL=$(gh release create "v$VERSION" \
  --title "v$VERSION" \
  --target "$SHA" \
  --notes "$PR_BODY" \
  $PRERELEASE_FLAG)
echo "url=$RELEASE_URL" >> "$GITHUB_OUTPUT"
