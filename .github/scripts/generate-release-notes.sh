#!/bin/bash

set -e

DEFAULT_BRANCH=$(gh api "repos/$GITHUB_REPOSITORY" --jq '.default_branch')

if LAST_TAG=$(gh api "repos/$GITHUB_REPOSITORY/releases/latest" --jq '.tag_name' 2>/dev/null); then
  echo "Previous release found: $LAST_TAG"
else
  LAST_TAG=""
  echo "No previous releases found - this will be the first release"
fi

echo "Generating release notes for tag: v$VERSION"
if [ -n "$LAST_TAG" ]; then
  echo "Using previous tag: $LAST_TAG"
  RELEASE_NOTES=$(gh api \
    --method POST \
    -H "Accept: application/vnd.github+json" \
    "/repos/$GITHUB_REPOSITORY/releases/generate-notes" \
    -f "tag_name=v$VERSION" \
    -f "target_commitish=$DEFAULT_BRANCH" \
    -f "previous_tag_name=$LAST_TAG" \
    --jq '.body')
else
  echo "Generating notes from all commits"
  RELEASE_NOTES=$(gh api \
    --method POST \
    -H "Accept: application/vnd.github+json" \
    "/repos/$GITHUB_REPOSITORY/releases/generate-notes" \
    -f "tag_name=v$VERSION" \
    -f "target_commitish=$DEFAULT_BRANCH" \
    --jq '.body')
fi

{
  echo "RELEASE_NOTES<<EOF"
  echo "$RELEASE_NOTES"
  echo "EOF"
} >> "$GITHUB_ENV"
