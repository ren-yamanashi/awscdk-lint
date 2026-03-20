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
  echo "RUNNING: $command"
  if ! $command 2>&1 | grep -q "Found 0 warnings and 1 error."; then
    echo "ERROR: Expected error count not found!"
    exit 1
  fi
  echo "SUCCESS: Expected error count found!"
}

check_eslint_output "vp run -F @eslint-plugin-awscdk/example-eslint lint:esm"
check_eslint_output "vp run -F @eslint-plugin-awscdk/example-eslint lint:cjs"
check_oxlint_output "pnpm --filter @eslint-plugin-awscdk/example-oxlint exec oxlint"
