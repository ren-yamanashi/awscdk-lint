#!/bin/bash

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$DIR/../create-github-release.sh"
source "$DIR/test-helper.sh"

echo "create-github-release.sh"

FAKE_URL="https://github.com/owner/repo/releases/tag/v1.0.0"

test_stable_release_omits_prerelease_flag() {
  stub_command gh "echo $FAKE_URL"
  IS_PRERELEASE=false VERSION=1.0.0 SHA=deadbeef PR_BODY="notes" bash "$SCRIPT"
  local log
  log="$(cat "$STUB_LOG")"
  assert_contains "$log" "gh release create v1.0.0"
  assert_not_contains "$log" "--prerelease"
  assert_eq "$(cat "$GITHUB_OUTPUT")" "url=$FAKE_URL"
}

test_prerelease_adds_prerelease_flag() {
  stub_command gh "echo $FAKE_URL"
  IS_PRERELEASE=true VERSION=5.0.0-alpha.0 SHA=deadbeef PR_BODY="notes" bash "$SCRIPT"
  local log
  log="$(cat "$STUB_LOG")"
  assert_contains "$log" "gh release create v5.0.0-alpha.0"
  assert_contains "$log" "--prerelease"
}

run_test test_stable_release_omits_prerelease_flag
run_test test_prerelease_adds_prerelease_flag
report
