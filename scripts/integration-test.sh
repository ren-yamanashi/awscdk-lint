#!/bin/bash

set -euo pipefail

cd "$(dirname "${0}")/.."

EXPECTED_ERRORS=43

check_eslint_output() {
  local command="$1"
  local output
  echo "RUNNING: $command"
  output=$($command 2>&1) || true
  if ! echo "$output" | grep -q "✖ $EXPECTED_ERRORS problems ($EXPECTED_ERRORS errors, 0 warnings)";  then
    echo "ERROR: Expected error count not found!"
    exit 1
  fi
  echo "SUCCESS: Expected error count found!"
}

check_oxlint_output() {
  local command="$1"
  local output
  local count
  # FIXME
  EXPECTED_ERRORS=1
  echo "RUNNING: $command"
  output=$($command 2>&1) || true
  count=$(echo "$output" | grep -c "\[Error/" || true)
  if [ "$count" -ne "$EXPECTED_ERRORS" ]; then
    echo "ERROR: Expected $EXPECTED_ERRORS errors but found $count!"
    echo "ACTUAL OUTPUT:"
    echo "$output" | tail -5
    exit 1
  fi
  echo "SUCCESS: Expected error count found!"
}

check_eslint_output "vp run -F @eslint-plugin-awscdk/example eslint:esm"
check_eslint_output "vp run -F @eslint-plugin-awscdk/example eslint:cjs"
check_oxlint_output "vp run -F @eslint-plugin-awscdk/example oxlint"
