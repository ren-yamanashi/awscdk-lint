#!/bin/bash

set -e

cd "$(dirname "${0}")/.."

EXPECTED_ERRORS=46

check_eslint_output() {
  local command="$1"
  local output
  echo "RUNNING: $command"
  output=$($command 2>&1) || true
  if ! echo "$output" | grep -q "✖ $EXPECTED_ERRORS problems ($EXPECTED_ERRORS errors, 0 warnings)"; then
    echo "ERROR: Expected $EXPECTED_ERRORS errors not found!"
    echo "ACTUAL OUTPUT:"
    echo "$output" | tail -5
    exit 1
  fi
  echo "SUCCESS: Expected error count found!"
}

check_oxlint_output() {
  local command="$1"
  local output
  local count
  echo "RUNNING: $command"
  output=$($command 2>&1) || true
  count=$(echo "$output" | grep -c ": error ")
  if [ "$count" -ne "$EXPECTED_ERRORS" ]; then
    echo "ERROR: Expected $EXPECTED_ERRORS errors but found $count!"
    echo "ACTUAL OUTPUT:"
    echo "$output" | tail -5
    exit 1
  fi
  echo "SUCCESS: Expected error count found!"
}

check_eslint_output "vp run -F @eslint-plugin-awscdk/example-eslint lint:esm"
check_eslint_output "vp run -F @eslint-plugin-awscdk/example-eslint lint:cjs"
check_oxlint_output "vp run -F @eslint-plugin-awscdk/example-oxlint lint"
