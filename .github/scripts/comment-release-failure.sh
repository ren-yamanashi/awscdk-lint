#!/bin/bash

set -euo pipefail

gh pr comment "$PR_NUMBER" \
  --body "❌ **Release v$VERSION failed**

Please check the workflow logs for details.
🔗 Workflow run: $SERVER_URL/$REPOSITORY/actions/runs/$RUN_ID"
