#!/bin/bash

set -e

if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "exists=true" >> "$GITHUB_OUTPUT"
else
  echo "exists=false" >> "$GITHUB_OUTPUT"
fi
