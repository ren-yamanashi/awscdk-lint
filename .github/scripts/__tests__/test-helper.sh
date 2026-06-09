#!/bin/bash

# Shared test helpers for .github/scripts/.
# Tests stub external commands via PATH and capture script output to
# temp GITHUB_OUTPUT / GITHUB_ENV files.

PASS_COUNT=0
FAIL_COUNT=0
ORIGINAL_PATH="$PATH"

setup() {
  TEST_TMP_DIR="$(mktemp -d)"
  STUB_BIN="$TEST_TMP_DIR/bin"
  STUB_LOG="$TEST_TMP_DIR/stub.log"
  GITHUB_OUTPUT="$TEST_TMP_DIR/github_output"
  GITHUB_ENV="$TEST_TMP_DIR/github_env"
  mkdir -p "$STUB_BIN"
  : > "$STUB_LOG"
  : > "$GITHUB_OUTPUT"
  : > "$GITHUB_ENV"
  PATH="$STUB_BIN:$ORIGINAL_PATH"
  export PATH GITHUB_OUTPUT GITHUB_ENV
}

teardown() {
  PATH="$ORIGINAL_PATH"
  rm -rf "$TEST_TMP_DIR"
}

stub_command() {
  local name="$1"
  local body="${2:-}"
  local exit_code="${3:-0}"
  cat > "$STUB_BIN/$name" <<EOF
#!/bin/bash
echo "$name \$*" >> "$STUB_LOG"
$body
exit $exit_code
EOF
  chmod +x "$STUB_BIN/$name"
}

assert_eq() {
  local got="$1" want="$2" msg="${3:-values}"
  if [ "$got" = "$want" ]; then
    return 0
  fi
  echo "  ASSERT FAILED: $msg"
  echo "    got:  $got"
  echo "    want: $want"
  return 1
}

assert_contains() {
  local haystack="$1" needle="$2" msg="${3:-substring}"
  if [[ "$haystack" == *"$needle"* ]]; then
    return 0
  fi
  echo "  ASSERT FAILED: $msg"
  echo "    haystack: $haystack"
  echo "    needle:   $needle"
  return 1
}

assert_not_contains() {
  local haystack="$1" needle="$2" msg="${3:-substring}"
  if [[ "$haystack" != *"$needle"* ]]; then
    return 0
  fi
  echo "  ASSERT FAILED: $msg should not contain"
  echo "    haystack: $haystack"
  echo "    needle:   $needle"
  return 1
}

run_test() {
  local fn="$1"
  setup
  if ( set -e; "$fn" ); then
    echo "  PASS  $fn"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "  FAIL  $fn"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
  teardown
}

report() {
  echo ""
  echo "Result: $PASS_COUNT passed, $FAIL_COUNT failed"
  if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
  fi
}
