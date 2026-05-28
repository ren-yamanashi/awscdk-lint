#!/bin/bash

set -e

cd "$(dirname "${0}")/.."

# NOTE: main (ESLint-only) reports 43 on the identical fixtures. This branch reports 45
# because corsa's getImplementedTypesOfType returns [], so no-construct-in-interface /
# no-construct-in-public-property-of-construct over-match `MetricFilter` (2 false positives).
# See docs/report-corsa-oxlint.md (corsa-bind #164/#176). Target is 43 once that is fixed.
EXPECTED_ERRORS=45

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
check_oxlint_output "vp run -F @eslint-plugin-awscdk/example-eslint lint:oxlint"
