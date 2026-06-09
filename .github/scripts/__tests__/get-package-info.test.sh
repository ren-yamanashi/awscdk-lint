#!/bin/bash

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$DIR/../get-package-info.sh"
source "$DIR/test-helper.sh"

echo "get-package-info.sh"

test_stable_version_picks_latest_tag() {
  cd "$TEST_TMP_DIR"
  echo '{"version": "4.3.3", "name": "eslint-plugin-awscdk"}' > package.json
  bash "$SCRIPT"
  local out
  out="$(cat "$GITHUB_OUTPUT")"
  assert_contains "$out" "version=4.3.3"
  assert_contains "$out" "name=eslint-plugin-awscdk"
  assert_contains "$out" "dist_tag=latest"
  assert_contains "$out" "is_prerelease=false"
}

test_prerelease_version_picks_next_tag() {
  cd "$TEST_TMP_DIR"
  echo '{"version": "5.0.0-alpha.0", "name": "eslint-plugin-awscdk"}' > package.json
  bash "$SCRIPT"
  local out
  out="$(cat "$GITHUB_OUTPUT")"
  assert_contains "$out" "version=5.0.0-alpha.0"
  assert_contains "$out" "dist_tag=next"
  assert_contains "$out" "is_prerelease=true"
}

run_test test_stable_version_picks_latest_tag
run_test test_prerelease_version_picks_next_tag
report
