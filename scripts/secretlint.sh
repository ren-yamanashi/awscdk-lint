#!/bin/bash
set -e

cd "$(dirname "${0}")/.."

show_help() {
  cat <<EOF
Usage: $(basename "$0") <file>...

Options:
  -h, --help    Show this help message
EOF
}

if ! command -v node > /dev/null 2>&1; then
  exit 0
fi

# Show help if no arguments or help flag is passed
if [[ $# -eq 0 || "$1" == "-h" || "$1" == "--help" ]]; then
  show_help
  exit 0
fi

echo "  ▶ Check credentials by secretlint"
if [ -f ".secretlintignore" ]; then
    ./node_modules/.bin/secretlint --secretlintignore ".secretlintignore" --secretlintrc ".secretlintrc.json" "$@"
else
    ./node_modules/.bin/secretlint --secretlintrc ".secretlintrc.json" "$@"
fi
