#!/bin/bash

set -euo pipefail

if [[ "$VERSION_TYPE" == pre* ]]; then
  npm version "$VERSION_TYPE" --preid=alpha --no-git-tag-version
else
  npm version "$VERSION_TYPE" --no-git-tag-version
fi
VERSION=$(jq -r '.version' package.json)
echo "version=$VERSION" >> "$GITHUB_OUTPUT"
