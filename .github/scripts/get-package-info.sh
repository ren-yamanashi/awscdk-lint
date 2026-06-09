#!/bin/bash

set -e

VERSION=$(jq -r '.version' package.json)
PACKAGE_NAME=$(jq -r '.name' package.json)
if [[ "$VERSION" == *-* ]]; then
  DIST_TAG="next"
  IS_PRERELEASE="true"
else
  DIST_TAG="latest"
  IS_PRERELEASE="false"
fi
{
  echo "version=$VERSION"
  echo "name=$PACKAGE_NAME"
  echo "dist_tag=$DIST_TAG"
  echo "is_prerelease=$IS_PRERELEASE"
} >> "$GITHUB_OUTPUT"
