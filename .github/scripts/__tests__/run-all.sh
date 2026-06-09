#!/bin/bash

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

failed=0
for test_file in "$DIR"/*.test.sh; do
  if ! bash "$test_file"; then
    failed=1
  fi
  echo ""
done

exit "$failed"
