#!/bin/bash

set -e

cd "$(dirname "${0}")"

check_eslint_output() {
  local command="$1"
  local output
  echo "RUNNING: $command"
  output=$($command 2>&1) || true
  if ! echo "$output" | grep -q "✖ 40 problems (40 errors, 0 warnings)"; then
    echo "ERROR: Expected error count not found!"
    exit 1
  fi
  echo "SUCCESS: Expected error count found!"
}

check_oxlint_output() {
  local command="$1"
  local output
  echo "RUNNING: $command"
  output=$($command 2>&1) || true
  if ! echo "$output" | grep -q "Found 0 warnings and 1 error."; then
    echo "ERROR: Expected error count not found!"
    exit 1
  fi
  echo "SUCCESS: Expected error count found!"
}

check_eslint_output "pnpm run example:flat-config lint:esm"
check_eslint_output "pnpm run example:flat-config lint:cjs"
check_eslint_output "pnpm run example:classic-config lint"
check_oxlint_output "pnpm run example:oxlint lint"
