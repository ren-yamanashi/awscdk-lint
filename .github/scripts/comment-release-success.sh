#!/bin/bash

set -e

gh pr comment "$PR_NUMBER" \
  --body "✅ **Release v$VERSION completed successfully!**

- 📦 npm package: https://www.npmjs.com/package/$PACKAGE_NAME/v/$VERSION
- 🏷️ GitHub Release: $RELEASE_URL
- 🔗 Workflow run: $SERVER_URL/$REPOSITORY/actions/runs/$RUN_ID"
