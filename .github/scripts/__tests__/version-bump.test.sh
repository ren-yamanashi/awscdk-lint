#!/bin/bash

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$DIR/../version-bump.sh"
source "$DIR/test-helper.sh"

echo "version-bump.sh"

test_patch_passes_through_without_preid() {
  cd "$TEST_TMP_DIR"
  echo '{"version": "4.3.4"}' > package.json
  stub_command npm
  VERSION_TYPE=patch bash "$SCRIPT"
  assert_eq "$(cat "$STUB_LOG")" "npm version patch --no-git-tag-version" "npm args"
  assert_eq "$(cat "$GITHUB_OUTPUT")" "version=4.3.4" "GITHUB_OUTPUT"
}

test_premajor_uses_alpha_preid() {
  cd "$TEST_TMP_DIR"
  echo '{"version": "5.0.0-alpha.0"}' > package.json
  stub_command npm
  VERSION_TYPE=premajor bash "$SCRIPT"
  assert_eq "$(cat "$STUB_LOG")" "npm version premajor --preid=alpha --no-git-tag-version" "npm args"
  assert_eq "$(cat "$GITHUB_OUTPUT")" "version=5.0.0-alpha.0" "GITHUB_OUTPUT"
}

test_prerelease_uses_alpha_preid() {
  cd "$TEST_TMP_DIR"
  echo '{"version": "5.0.0-alpha.1"}' > package.json
  stub_command npm
  VERSION_TYPE=prerelease bash "$SCRIPT"
  assert_eq "$(cat "$STUB_LOG")" "npm version prerelease --preid=alpha --no-git-tag-version" "npm args"
}

run_test test_patch_passes_through_without_preid
run_test test_premajor_uses_alpha_preid
run_test test_prerelease_uses_alpha_preid
report
