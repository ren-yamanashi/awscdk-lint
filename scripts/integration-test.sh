#!/bin/bash

set -e

cd "$(dirname "${0}")/.."

check_eslint_output() {
  local command="$1"
  local output
  echo "RUNNING: $command"
  output=$($command 2>&1) || true
  if ! echo "$output" | grep -q "✖ 43 problems (43 errors, 0 warnings)"; then
    echo "ERROR: Expected error count not found!"
    exit 1
  fi
  echo "SUCCESS: Expected error count found!"
}

check_oxlint_output() {
  local command="$1"
  local expected_errors="$2"
  local output
  echo "RUNNING: $command"
  output=$($command 2>&1) || true
  if ! echo "$output" | grep -q "Found .* and $expected_errors errors"; then
    echo "ERROR: Expected $expected_errors errors not found!"
    echo "ACTUAL OUTPUT:"
    echo "$output" | tail -5
    exit 1
  fi
  echo "SUCCESS: Expected error count found!"
}

check_eslint_output "vp run -F @eslint-plugin-awscdk/example-eslint lint:esm"
check_eslint_output "vp run -F @eslint-plugin-awscdk/example-eslint lint:cjs"

# NOTE: oxlint detects 43 errors (same as ESLint, using oxlint-disable comments for parity)
# See docs/report-corsa-oxlint.md for details on tsgo type resolution differences
check_oxlint_output "vp run -F @eslint-plugin-awscdk/example-oxlint lint" "43"
