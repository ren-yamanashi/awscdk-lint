#!/bin/bash

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$DIR/../check-tag.sh"
source "$DIR/test-helper.sh"

echo "check-tag.sh"

test_existing_tag_reports_true() {
  stub_command git "" 0
  VERSION=1.0.0 bash "$SCRIPT"
  assert_eq "$(cat "$GITHUB_OUTPUT")" "exists=true"
}

test_missing_tag_reports_false() {
  stub_command git "" 1
  VERSION=9.9.9 bash "$SCRIPT"
  assert_eq "$(cat "$GITHUB_OUTPUT")" "exists=false"
}

run_test test_existing_tag_reports_true
run_test test_missing_tag_reports_false
report
