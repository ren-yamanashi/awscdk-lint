#!/bin/bash

set -euo pipefail

if [[ -z "${PR_TITLE-}" ]]; then
  echo "ERROR: PR_TITLE environment variable is not set." >&2
  exit 1
fi

ALLOWED_TYPES='feat|fix|chore|docs|test|refactor|perf|style|build|ci|revert'
PATTERN="^(${ALLOWED_TYPES})(\([^)[:space:]]+\))?!?: .+"

if printf '%s' "$PR_TITLE" | grep -qE "$PATTERN"; then
  echo "PR title is valid: $PR_TITLE"
  exit 0
fi

{
  echo "::error::PR title does not follow Conventional Commits."
  echo "  title:   $PR_TITLE"
  echo "  allowed: ${ALLOWED_TYPES//|/, }"
  echo "  format:  <type>(<optional-scope>)<optional-!>: <subject>"
  echo "  example: fix: prevent crash on synthetic type arguments"
  echo "           fix(oxlint-plugin-awscdk): apply safe symbol lookup"
  echo "           feat!: drop Node 18 support"
} >&2
exit 1
